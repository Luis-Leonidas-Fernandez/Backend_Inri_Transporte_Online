import { MercadoPagoConfig, Preference } from "mercadopago";
import fetch from "node-fetch";
import dotenv from "dotenv";
import PaymentCredential from "../models/PaymentCredential.js";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

/** Redirige al usuario/conductor a Mercado Pago para que autorice actuar en su nombre (Crear pagos). Es parte del flujo OAuth 2.0 con Authorization Code. */
export const connectMercado = async (req, res) => {
  const paymentCredential = await checkPaymentsCredential(req.uid); // Se verifica si el usuario ya tiene credenciales de pago
  if (paymentCredential) {
    return res
      .status(400)
      .json({ error: "El usuario ya genero las credenciales de pago" });
  }
  // Aca añadir si el token esta vencido renovarlo con el refresh_token

  const state = req.uid; // Se guarda el userId en el state para luego reconocerlo en getAccessToken

  try {
    const redirect = `https://auth.mercadopago.com/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&state=${state}&redirect_uri=${REDIRECT_URI}api/payments/accessToken`;
    console.log("[payments.connectMercado] URL de redireccionamiento:", redirect);
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

    await createPaymentsCredential(
      userId,
      access_token,
      refresh_token,
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

const client = new MercadoPagoConfig({
  accessToken: ACCESS_TOKEN,
  options: { timeout: 5000 },
});

const preference = new Preference(client);

/** Genera una dirección para realizar un pago */
export async function createPreference(_req, res) {
  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: "1",
            title: "Envio - Duelos",
            quantity: 1,
            unit_price: 20000,
            currency_id: "ARS",
          },
        ],
      },
    });
    console.log(result.sandbox_init_point);
    res.status(200).json({ urlPago: result.sandbox_init_point });
  } catch (err) {
    res.status(400).json({ error: "No se pudo crear el pago" });
    console.log("[payments.createPreference] Se ha producido un error:", err);
  }
}

/** Guarda las credenciales de pago en la base de datos
 * @param {string} userId - ID del usuario
 * @param {string} access_token - Token de acceso de Mercado Pago
 * @param {string} provider - Proveedor de pago (ej: Mercado Pago)
 */
const createPaymentsCredential = async (
  userId,
  access_token,
  refresh_token,
  provider
) => {
  try {
    const paymentCredentials = new PaymentCredential({
      idConductor: userId,
      accessToken: access_token,
      refreshToken: refresh_token,
      provider: provider,
    });

    await paymentCredentials.save();
    console.log(
      "[payments.createPaymentsCredential] Credenciales de pago guardadas en la base de datos"
    );
  } catch (error) {
    console.log(
      "[payments.createPaymentsCredential] Error al guardar las credenciales de pago:",
      error
    );
  }
};

/** Verifica si el usuario ya tiene credenciales de pago
 * @param {string} userId - ID del usuario
 * @returns {Promise<boolean>} - true si tiene credenciales de pago, false si no
 */
const checkPaymentsCredential = async (userId) => {
  try {
    const paymentCredential = await PaymentCredential.findOne({
      idConductor: userId,
    });

    if (!paymentCredential) {
      console.log(
        "[payments.checkPaymentsCredential] No se encontraron credenciales de pago"
      );
      return false;
    }

    return true;
  } catch (error) {
    console.log(
      "[payments.checkPaymentsCredential] Error al buscar las credenciales de pago:",
      error
    );
  }
};
