const express = require("express");

const fs = require("fs");

const path = require("path");

const router = express.Router();

const rutaOrdenes = path.join(
  __dirname,
  "../data/ordenes.json"
);

// OBTENER ORDENES
router.get("/", async (req, res) => {

  try {

    const data = fs.readFileSync(
      rutaOrdenes,
      "utf8"
    );

    const ordenes = JSON.parse(data);

    res.json(ordenes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo órdenes"
    });

  }

});

// GUARDAR ORDEN
router.post("/", async (req, res) => {

  try {

    const data = fs.readFileSync(
      rutaOrdenes,
      "utf8"
    );

    const ordenes = JSON.parse(data);

    const nuevaOrden = {
      id: Date.now().toString(),
      estado: "pagado",
      createdAt: new Date(),
      ...req.body
    };

    ordenes.push(nuevaOrden);

    fs.writeFileSync(
      rutaOrdenes,
      JSON.stringify(ordenes, null, 2)
    );

    res.json({
      ok: true,
      orden: nuevaOrden
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error guardando orden"
    });

  }

});

module.exports = router;