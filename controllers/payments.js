import { MercadoPagoConfig, Preference } from "mercadopago";
import fetch from "node-fetch";
import dotenv from "dotenv";
import PaymentCredential from "../models/paymentCredential.js";
import Payment from "../models/payments.js";
import Orders from "../models/orders.js";
import Bids from "../models/bids.js";
import Users from "../models/usuario.js";
import mongoose from "mongoose";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

/** Redirige al usuario/conductor a Mercado Pago para que autorice actuar en su nombre (Crear pagos). Es parte del flujo OAuth 2.0 con Authorization Code. */
export const connectMercado = async (req, res) => {
  const paymentCredential = await checkPaymentsCredentialDB(req.uid); // Se verifica si el usuario ya tiene credenciales de pago
  if (paymentCredential) {
    return res
      .status(400)
      .json({ error: "El usuario ya genero las credenciales de pago" });
  }
  // Aca añadir si el token esta vencido renovarlo con el refresh_token

  const state = req.uid; // Se guarda el userId en el state para luego reconocerlo en getAccessToken

  try {
    const redirect = `https://auth.mercadopago.com/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&state=${state}&redirect_uri=${REDIRECT_URI}api/payments/accessToken`;
    console.log(
      "[payments.connectMercado] URL de redireccionamiento:",
      redirect
    );
    res.status(200).json({ redirect });
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("[payments.connectMercado] Se ha producido un error", error);
  }
};

/** Función que se encarga de recibir el código de autorización y obtener el access_token y refresh_token */
export const getAccessToken = async (req, res) => {
  const { code, state } = req.query; // Se obtiene el code y el state (userId) de la query
  const userId = state;

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", `${REDIRECT_URI}api/payments/accessToken`);

  try {
    const response = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: params,
      body: params.toString(),
    });
    const data = await response.json();

    // Utilizamos el access_token y refresh_token para realizar acciones en nombre del usuario
    const { access_token, refresh_token, user_id } = data;

    await createPaymentsCredentialDB(
      userId,
      access_token,
      refresh_token,
      user_id,
      "mercadopago"
    ); // Guardamos el access_token en la base de datos

    console.log(
      "[payments.getAccessToken] Se ha guardado el access_token en la base de datos correctamente"
    );
    res.status(200).json({
      access_token,
      refresh_token,
      user_id,
    });
  } catch (error) {
    console.error("[payments.getAccessToken] Se ha producido un error:", error);
    res.status(500).json({ error: error });
  }
};

/** Crea una preferencia de pago en Mercado Pago. Se utiliza para generar la URL de pago.
 * @param {string} accessToken - Token de acceso de Mercado Pago
 * @returns {Preference} - Objeto de preferencia de pago de Mercado Pago
 */
const mercadoPagoPreference = (accessToken) => {
  const client = new MercadoPagoConfig({
    accessToken: accessToken,
    options: { timeout: 5000 },
  });

  const preference = new Preference(client);
  return preference;
};

/** Obtiene la oferta, la orden y el usuario desde la base de datos
 * @param {string} bidId - ID de la oferta (bid)
 * @returns {Promise<Object>} - Objeto con la información de la oferta, orden y usuario
 */
const getBidOrderUser = async (bidId) => {
  try {
    const bid = await Bids.findById(bidId); // Se busca la bid en la base de datos

    const order = await Orders.findById(bid.idOrder); // Se busca la order en la base de datos

    const usuario = await Users.findById(order.idUser); // Se busca el usuario en la base de datos
    return { bid, order, usuario };
  } catch (error) {
    console.log(
      "[payments.getBidOrderUser] Error al buscar la oferta, orden o usuario:",
      error
    );
  }
};

/** Genera una dirección para realizar un pago */
export async function createPreferenceMP(req, res) {
  const { bidId } = req.body; // Se obtiene el id de la orden y de la bid desde el body

  const { bid, order, usuario } = await getBidOrderUser(bidId);

  if (!bid || !order || !usuario) {
    return res
      .status(400)
      .json({ error: "Error al buscar la oferta, orden o usuario" });
  }

  const { carga } = order; // Se obtiene la carga

  const paymentCredential = await getPaymentCredentialDB(bid.idConductor); // Se verifica si el usuario ya tiene credenciales de pago

  if (!paymentCredential) {
    return res.status(400).json({ error: "El usuario no tiene credenciales" });
  }

  const accessToken = paymentCredential.accessToken;

  const precio = bid.oferta.valor / carga.length; // Se divide el precio por la cantidad de cargas para que mercado pago luego genere el precio total correctamente

  const preference = mercadoPagoPreference(accessToken); // Se crea la preferencia de pago

  const items = carga.map((item) => ({
    id: item._id,
    title: item.tipoCarga,
    quantity: 1,
    unit_price: precio, // Precio por unidad
    currency_id: "ARS",
  }));

  try {
    const result = await preference.create({
      body: {
        items: items,
        description: "Envio - Duelos",
        payer: {
          name: usuario.nombre,
          email: usuario.email,
        },
        external_reference: bidId, // Se guarda el id de la bid en la referencia externa para luego poder identificarla
        notification_url: `${REDIRECT_URI}api/payments/webHooks`, // Se guarda la url de notificacion para recibir el webhook
      },
    });

    console.log(
      "[payments.createPreferenceMP] URL generada para redireccionar al pago:",
      result.init_point
    );
    res.status(200).json({ urlPago: result.init_point });
  } catch (err) {
    res.status(400).json({ error: "No se pudo crear el pago" });
    console.log("[payments.createPreferenceMP] Se ha producido un error:", err);
  }
}

/** Guarda las credenciales de pago en la base de datos
 * @param {string} userId - ID del usuario
 * @param {string} access_token - Token de acceso de Mercado Pago
 * @param {string} refresh_token - Token de refresco de Mercado Pago
 * @param {string} user_id - ID de usuario de Mercado Pago
 * @param {string} provider - Proveedor de pago (ej: Mercado Pago)
 */
const createPaymentsCredentialDB = async (
  userId,
  access_token,
  refresh_token,
  user_id,
  provider
) => {
  try {
    const paymentCredentials = new PaymentCredential({
      idConductor: userId,
      accessToken: access_token,
      refreshToken: refresh_token,
      userId: user_id,
      provider: provider,
    });

    await paymentCredentials.save();
    console.log(
      "[payments.createPaymentsCredentialDB] Credenciales de pago guardadas en la base de datos"
    );
  } catch (error) {
    console.log(
      "[payments.createPaymentsCredentialDB] Error al guardar las credenciales de pago:",
      error
    );
  }
};

/** Verifica si el usuario ya tiene credenciales de pago guardadas en la base de datos
 * @param {string} userId - ID del usuario
 * @returns {Promise<boolean>} - true si tiene credenciales de pago, false si no
 */
const checkPaymentsCredentialDB = async (userId) => {
  try {
    const paymentCredential = await PaymentCredential.findOne({
      idConductor: userId,
    });

    if (!paymentCredential) {
      console.log(
        "[payments.checkPaymentsCredentialDB] No se encontraron credenciales de pago"
      );
      return false;
    }

    return true;
  } catch (error) {
    console.log(
      "[payments.checkPaymentsCredentialDB] Error al buscar las credenciales de pago:",
      error
    );
  }
};

/** Obtiene las credenciales de pago del conductor desde la base de datos
 * @param {string} idConductor - ID del conductor
 * @returns {Promise<PaymentCredential | null>} - Credenciales de pago o null si no existen
 */
const getPaymentCredentialDB = async (idConductor) => {
  try {
    const paymentCredential = await PaymentCredential.findOne({
      idConductor: idConductor,
    });

    if (!paymentCredential) {
      console.log(
        "[payments.getPaymentCredentialDB] No se encontraron credenciales de pago"
      );
      return null;
    }

    return paymentCredential;
  } catch (error) {
    console.log(
      "[payments.getPaymentCredentialDB] Error al buscar las credenciales de pago:",
      error
    );
  }
  return null;
};

/** Webhook de Mercado Pago para recibir notificaciones de pagos */
export const webHooks = async (req, res) => {
  const paymentId = req.query["data.id"]; // Se obtiene el id del pago desde la query

  if (!paymentId) {
    return res.status(400).json({ error: "No se ha recibido el paymentId" });
  }

  try {
    const data = await getPaymentMP(paymentId);

    if (!data) {
      console.log(
        "[payments.webHooks] No se pudo obtener la información del pago"
      );
      return res
        .status(400)
        .json({ error: "No se pudo obtener la información del pago" });
    }

    await createPaymentDB(paymentId, data);

    res.status(200).json({ message: "Webhook recibido" });
  } catch (error) {
    console.log("[payments.webHooks] Error al procesar el webhook:", error);
    res.status(500).json({ error: "Error al procesar el webhook" });
  }
};

/** Obtiene el pago desde Mercado Pago
 * @param {string} paymentId - ID del pago
 * @returns {Promise<Object | null>} - Objeto con la información del pago o null si no se pudo obtener
 */
const getPaymentMP = async (paymentId) => {
  const access = ACCESS_TOKEN;
  const url = `https://api.mercadopago.com/v1/payments/${paymentId}`; // Se crea la url para obtener el pago

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(
      "[payments.getPaymentMP] Se ha obtenido el pago correctamente, id:",
      paymentId
    );
    return data;
  } catch (error) {
    console.log("[payments.getPaymentMP] Error al obtener el pago:", error);
    res.status(500).json({ error: "Error al obtener el pago" });
    return null;
  }
};

/** Guarda la información del pago en la base de datos
 * @param {string} paymentId - ID del pago
 * @param {Object} data - Objeto con la información del pago
 * @returns {Promise<void>}
 */
const createPaymentDB = async (paymentId, data) => {
  const bidId = data.external_reference;
  const status = data.status;
  const paymentStatus = data.status_detail;
  const fee = data.fee_details[0].amount;
  const amount = data.transaction_amount;
  const currency_id = data.currency_id;

  const payment = new Payment({
    idBid: bidId,
    paymentId: paymentId,
    status: status,
    paymentStatus: paymentStatus,
    fee: fee,
    amount: amount,
    currencyId: currency_id,
  });

  try {
    await payment.save(); // Se guarda el pago en la base de datos
    console.log(
      "[payments.createPaymentDB] Se ha guardado el pago en la base de datos correctamente"
    );
  } catch (error) {
    console.log(
      "[payments.createPaymentDB] Error al guardar el pago en la base de datos:",
      error
    );
  }
};

export const refundTotal = async (req, res) => {
  const { bidId } = req.body;
  if (!bidId) {
    console.log("[payments.refundTotal] El bidId es obligatorio");
    return res.status(400).json({ error: "El bidId es obligatorio" });
  }

  try {
    if (!isValidMongoId(bidId)) {
      console.log(
        "[payments.refundTotal] bidId no es un ObjectId válido de MongoDB"
      );
      return res
        .status(400)
        .json({ error: "bidId no es un ObjectId válido de MongoDB" });
    }

    const bid = await Bids.findOne({ _id: bidId });
    if (!bid) {
      console.log(
        "[payments.refundTotal] No se encontro la bid en la base de datos"
      );
      return res
        .status(400)
        .json({ error: "No se encontro la bid en la base de datos" });
    }

    const payment = await Payment.find({ idBid: bidId });
    const paymentId = payment[0].paymentId;

    const paymentCredential = await getPaymentCredentialDB(bid.idConductor); // Se verifica si el usuario ya tiene credenciales de pago
    // const accessToken = paymentCredential.accessToken;

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}/refunds`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": bidId,
          Authorization: `Bearer ${paymentCredential.accessToken}`,
        },
      }
    );
    const mpResponse = await response.json();

    console.log("[payments.refundTotal] response:", mpResponse);
    res.status(200).json(mpResponse);
  } catch (error) {
    console.log("[payments.refundTotal] Se ha producido un error:", error);
    res.status(400).json({ error: error });
  }
};

export const refundPartial = async (req, res) => {
  const { bidId } = req.body;
  if (!bidId) {
    console.log("[payments.refundPartial] El bidId es obligatorio");
    return res.status(400).json({ error: "El bidId es obligatorio" });
  }

  try {
    if (!isValidMongoId(bidId)) {
      console.log(
        "[payments.refundPartial] bidId no es un ObjectId válido de MongoDB"
      );
      return res
        .status(400)
        .json({ error: "bidId no es un ObjectId válido de MongoDB" });
    }

    const bid = await Bids.findOne({ _id: bidId });
    if (!bid) {
      console.log(
        "[payments.refundPartial] No se encontro la bid en la base de datos"
      );
      return res
        .status(400)
        .json({ error: "No se encontro la bid en la base de datos" });
    }

    const payment = await Payment.find({ idBid: bidId });
    const paymentId = payment[0].paymentId;

    const paymentCredential = await getPaymentCredentialDB(bid.idConductor); // Se verifica si el usuario ya tiene credenciales de pago
    // const accessToken = paymentCredential.accessToken;

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}/refunds`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": bidId,
          Authorization: `Bearer ${paymentCredential.accessToken}`,
        },
        body: {
          amount: bid.amount / 10, // Reintegrar el 10% como ejemplo
        },
      }
    );
    const mpResponse = await response.json();

    console.log("[payments.refundPartial] response:", mpResponse);
    res.status(200).json(mpResponse);
  } catch (error) {
    console.log("[payments.refundPartial] Se ha producido un error:", error);
    res.status(400).json({ error: error });
  }
};

/** Verifica que el ID sea compatible con mongoDB */
export const isValidMongoId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
