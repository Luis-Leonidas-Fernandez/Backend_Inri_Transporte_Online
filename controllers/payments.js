import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from 'dotenv'

dotenv.config()
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

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
            id: "generico",
            title: "prueba",
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
    res.status(500).json({ error: "No se pudo crear el pago" });
    console.log("[payments.createPreference] Se ha producido un error:", err);
  }
}
