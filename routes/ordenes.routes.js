const express = require("express");

const router = express.Router();

const Orden = require("../models/tempo");

// OBTENER ÓRDENES
router.get("/", async (req, res) => {

  try {

    const ordenes = await Orden.find()
      .sort({ createdAt: -1 });

    res.json(ordenes);

  } catch (error) {

    res.status(500).json({
      error: "Error obteniendo órdenes"
    });

  }

});

// GUARDAR ORDEN
router.post("/", async (req, res) => {

  try {

    const orden = new Orden(req.body);

    await orden.save();

    res.json({
      ok: true
    });

  } catch (error) {

    res.status(500).json({
      error: "Error guardando orden"
    });

  }

});

module.exports = router;