const Producto = require("../models/Producto");

const obtenerProductos = async (req, res) => {

  try {

    const productos = await Producto.find({
      activo: true
    });

    const productosFormateados =
      productos.map(producto => ({
        id: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        precioAnterior: producto.precioAnterior,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        categoria: producto.categoria,
        stock: producto.stock
      }));

    res.json(productosFormateados);

  } catch (error) {

    res.status(500).json({
      error: "Error obteniendo productos"
    });

  }

};

const crearProducto = async (req, res) => {

  try {

    const producto = new Producto(req.body);

    await producto.save();

    res.status(201).json(producto);

  } catch (error) {

    res.status(500).json({
      error: "Error creando producto"
    });

  }

};

module.exports = {
  obtenerProductos,
  crearProducto
};