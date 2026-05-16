const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================================
   CONFIG PAYPAL
========================================================= */

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

/* =========================================================
   OBTENER ACCESS TOKEN
========================================================= */

async function generarAccessToken() {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
    const secret = process.env.PAYPAL_CLIENT_SECRET?.trim();

    const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        timeout: 15000
      }
    );

    return response.data.access_token;

  } catch (error) {
    console.error("❌ ERROR GENERANDO ACCESS TOKEN:");
    console.error(error.response?.status);
    console.error(error.response?.data || error.message);
    throw error;
  }
}

/* =========================================================
   CREAR ORDEN
========================================================= */

app.post("/api/orders", async (req, res) => {

  try {

    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({
        error: "Carrito vacío"
      });
    }

    // Total calculado en servidor
    const subtotal = cart.reduce((acc, item) => {
      return acc + (item.precio * item.cantidad);
    }, 0);

    const envio = 10;

    const total = subtotal + envio;

    const accessToken = await generarAccessToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",

        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total.toFixed(2)
            }
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    res.json({
      id: response.data.id
    });

  } catch (error) {

    console.error(
      "ERROR CREANDO ORDEN:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Error creando la orden"
    });

  }

});

/* =========================================================
   CAPTURAR PAGO
========================================================= */

app.post("/api/orders/:orderID/capture", async (req, res) => {

  try {

    const { orderID } = req.params;

    const accessToken = await generarAccessToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    res.json(response.data);

  } catch (error) {

    console.error(
      "ERROR CAPTURANDO PAGO:",
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Error capturando pago"
    });

  }

});

/* =========================================================
   SERVER
========================================================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${PORT}`);
});