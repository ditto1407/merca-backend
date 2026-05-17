const axios = require("axios");

const PAYPAL_API =
  "https://api-m.sandbox.paypal.com";

// OBTENER ACCESS TOKEN
async function generarAccessToken() {

  const response = await axios({

    url: `${PAYPAL_API}/v1/oauth2/token`,

    method: "post",

    data: "grant_type=client_credentials",

    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_CLIENT_SECRET
    },

    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded"
    }

  });

  return response.data.access_token;
}

// CREAR ORDEN PAYPAL
const crearOrden = async (req, res) => {

  try {

    const { cart } = req.body;

    const total = cart.reduce(
      (acc, item) =>
        acc + item.precio * item.cantidad,
      0
    );

    const accessToken =
      await generarAccessToken();

    const response = await axios({

      url: `${PAYPAL_API}/v2/checkout/orders`,

      method: "post",

      headers: {
        Authorization:
          `Bearer ${accessToken}`
      },

      data: {

        intent: "CAPTURE",

        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: (total + 10).toFixed(2)
            }
          }
        ]
      }

    });

    res.json({
      id: response.data.id
    });

  } catch (error) {

    console.error(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Error creando orden PayPal"
    });

  }

};

// CAPTURAR PAGO
const capturarOrden = async (req, res) => {

  try {

    const { orderID } = req.params;

    const accessToken =
      await generarAccessToken();

    const response = await axios({

      url:
        `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,

      method: "post",

      headers: {
        Authorization:
          `Bearer ${accessToken}`
      }

    });

    res.json(response.data);

  } catch (error) {

    console.error(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Error capturando pago"
    });

  }

};

module.exports = {
  crearOrden,
  capturarOrden
};