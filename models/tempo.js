const mongoose = require("mongoose");

const OrdenSchema = new mongoose.Schema({

  productos: Array,

  total: Number,

  paypalOrderId: String,

  comprador: Object,

  estado: {
    type: String,
    default: "pagado"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "Orden",
  OrdenSchema
);