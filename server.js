const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================================
   CONEXIÓN A MONGODB
========================================================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.error("❌ Error MongoDB:", err));

/* =========================================================
   MODELO DE PRODUCTO
========================================================= */

const ProductoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  precioAnterior: Number,
  descripcion: String,
  imagen: String,
  categoria: String
});

const Producto = mongoose.model("Producto", ProductoSchema);

/* =========================================================
   PAYPAL CONFIG
========================================================= */

const PAYPAL_API = "https://api-m.sandbox.paypal.com";

/* =========================================================
   ACCESS TOKEN
========================================================= */

async function generarAccessToken() {
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
      }
    }
  );

  return response.data.access_token;
}

/* =========================================================
   PRODUCTOS (NUEVO)
========================================================= */

// GET productos desde BD
app.get("/api/productos", async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

/* =========================================================
   PAYPAL ORDERS
========================================================= */

app.post("/api/orders", async (req, res) => {
  try {
    const { cart } = req.body;

    const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
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
        }
      }
    );

    res.json({ id: response.data.id });

  } catch (error) {
    console.error("ERROR CREANDO ORDEN:", error.response?.data || error.message);
    res.status(500).json({ error: "Error creando orden" });
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
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error("ERROR CAPTURANDO:", error.response?.data || error.message);
    res.status(500).json({ error: "Error capturando pago" });
  }
});

/* =========================================================
   SERVER
========================================================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${PORT}`);
});