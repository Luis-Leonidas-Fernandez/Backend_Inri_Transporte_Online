import { MercadoPagoConfig, Preference } from "mercadopago";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://www.tobiasnicolasn.com/";
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

/** Redirige al usuario/conductor a Mercado Pago para que autorice actuar en su nombre (Crear pagos). Es parte del flujo OAuth 2.0 con Authorization Code. */
export const connectMercado = (_req, res) => {
  try {
    const redirect = `https://auth.mercadopago.com/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&state=AUTORIZACIONCLIENTE&redirect_uri=${REDIRECT_URI}`;
    console.log(redirect);
    res.status(200).json({ redirect });
  } catch (error) {
    res.status(400).json({ error: error });
    console.log("[payments.connectMercado] Se ha producido un error", error);
  }
};

/** Función que se encarga de recibir el código de autorización y obtener el access_token y refresh_token */
export const getAccessToken = async (req, res) => {
  const { code } = req.query;

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("code", code);
  params.append("redirect_uri", REDIRECT_URI);

  try {
    const response = await fetch("https://api.mercadopago.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await response.json();

    // Utilizamos el access_token y refresh_token para realizar acciones en nombre del usuario
    const { access_token, refresh_token, user_id } = data;

    console.log(
      "[payments.getAccessToken] Se ha obtenido el access_token:",
      access_token,
      "del usuario:",
      user_id
    );
    res.status(200).json({ access_token, user_id });
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
