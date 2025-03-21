const express = require('express');
const Car = require('../models/Car');

const router = express.Router();

// 📌 Récupérer toutes les voitures ou filtrer par marque
router.get('/', async (req, res) => {
  try {
    const { brand } = req.query;
    let cars;

    if (brand) {
      cars = await Car.findAll({ where: { brand } });
    } else {
      cars = await Car.findAll();
    }

    // ✅ Générer l'URL complète des images
    const carsWithImages = cars.map(car => ({
      ...car.toJSON(),
      imageUrl: `http://localhost:5000/images/${car.image}`
    }));

    res.json(carsWithImages);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des voitures' });
  }
});

module.exports = router;
