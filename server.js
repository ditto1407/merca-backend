const express = require("express");
const cors = require("cors");
require("dotenv").config();

const conectarDB = require("./config/db");

const productosRoutes =
  require("./routes/productos.routes");

const ordenesRoutes =
  require("./routes/ordenes.routes");

const app = express();

conectarDB();
mongoose.connection.once("open", async () => {
  console.log("DB:", mongoose.connection.name);

  const collections = await mongoose.connection.db
    .listCollections()
    .toArray();

  console.log(collections);
});

app.use(cors());

app.use(express.json());

app.use("/api/productos", productosRoutes);

app.use("/api/ordenes", ordenesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor en puerto ${PORT}`);
});