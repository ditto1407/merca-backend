const fs = require("fs");
const path = require("path");

const rutaProductos = path.join(
  __dirname,
  "../data/productos.json"
);

const obtenerProductos = async (req, res) => {

  try {

    const data = fs.readFileSync(
      rutaProductos,
      "utf8"
    );

    const productos = JSON.parse(data);

    const activos = productos.filter(
      p => p.activo
    );

    res.json(activos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo productos"
    });

  }

};

const crearProducto = async (req, res) => {

  try {

    const data = fs.readFileSync(
      rutaProductos,
      "utf8"
    );

    const productos = JSON.parse(data);

    const nuevoProducto = {
      id: Date.now().toString(),
      ...req.body,
      activo: true
    };

    productos.push(nuevoProducto);

    fs.writeFileSync(
      rutaProductos,
      JSON.stringify(productos, null, 2)
    );

    res.status(201).json(nuevoProducto);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error creando producto"
    });

  }

};

module.exports = {
  obtenerProductos,
  crearProducto
};