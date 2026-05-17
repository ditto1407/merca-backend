const express = require("express");
const cors = require("cors");
require("dotenv").config();

const conectarDB = require("./config/db");

const productosRoutes =
  require("./routes/productos.routes");

const app = express();

const ordenesRoutes =
  require("./routes/ordenes.routes");

app.use("/api/ordenes", ordenesRoutes);

conectarDB();

app.use(cors());

app.use(express.json());

app.use("/api/productos", productosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor en puerto ${PORT}`);
});

