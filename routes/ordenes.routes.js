const express = require("express");

const router = express.Router();

const Orden = require("../models/Orden");

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