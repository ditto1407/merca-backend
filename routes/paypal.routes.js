const express = require("express");

const router = express.Router();

const {
  crearOrden,
  capturarOrden
} = require(
  "../controllers/paypal.controller"
);

router.post(
  "/orders",
  crearOrden
);

router.post(
  "/orders/:orderID/capture",
  capturarOrden
);

module.exports = router;