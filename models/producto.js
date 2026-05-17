const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  precio: {
    type: Number,
    required: true
  },

  precioAnterior: {
    type: Number,
    default: 0
  },

  descripcion: {
    type: String,
    required: true
  },

  imagen: {
    type: String,
    required: true
  },

  categoria: {
    type: String,
    required: true
  },

  stock: {
    type: Number,
    default: 0
  },

  activo: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "Producto",
  ProductoSchema
);