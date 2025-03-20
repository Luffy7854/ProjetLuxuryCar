const express = require('express');
const Car = require('../models/Car');

const router = express.Router();

// 📌 Récupérer toutes les voitures ou filtrer par marque
router.get('/', async (req, res) => {
  console.log("📡 Requête GET /api/cars");
  try {
    const { brand } = req.query;
    let cars;

    if (brand) {
      cars = await Car.findAll({ where: { brand } });
      console.log(`🔎 Filtre appliqué : ${brand}`);
    } else {
      cars = await Car.findAll();
    }

    res.json(cars);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des voitures :", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📌 Ajouter une voiture
router.post('/', async (req, res) => {
  console.log("📡 Requête POST /api/cars");
  try {
    const { name, brand, max_speed, type, price_per_day, image } = req.body;
    const newCar = await Car.create({ name, brand, max_speed, type, price_per_day, image });
    res.status(201).json(newCar);
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout :", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
