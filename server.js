const express = require("express");

const cors = require("cors");

require("dotenv").config();

const productosRoutes =
  require("./routes/productos.routes");

const ordenesRoutes =
  require("./routes/ordenes.routes");

const paypalRoutes =
  require("./routes/paypal.routes");

const app = express();

app.use(cors());

app.use(express.json());

// RUTAS
app.use(
  "/api/productos",
  productosRoutes
);

app.use(
  "/api/ordenes",
  ordenesRoutes
);

app.use(
  "/api",
  paypalRoutes
);

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `✅ Servidor funcionando en puerto ${PORT}`
  );

});