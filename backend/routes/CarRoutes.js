const express = require('express');
const Car = require('../models/Car');
const router = express.Router();

// ✅ Récupérer toutes les voitures
router.get('/', async (req, res) => {
  try {
    const { brand } = req.query;
    const cars = brand
      ? await Car.findAll({ where: { brand } })
      : await Car.findAll();

    const carsWithImages = cars.map(car => ({
      ...car.toJSON(),
      imageUrl: `http://localhost:5000/images/${car.image}`
    }));

    res.json(carsWithImages);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des voitures' });
  }
});

// ✅ Ajouter une voiture (admin)
router.post('/', async (req, res) => {
  try {
    const { name, brand, max_speed, type, price_per_day, image } = req.body;
    const newCar = await Car.create({ name, brand, max_speed, type, price_per_day, image });
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’ajout de la voiture' });
  }
});

// ✅ Supprimer une voiture (admin)
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.destroy({ where: { id: req.params.id } });
    if (car) {
      res.json({ message: 'Voiture supprimée' });
    } else {
      res.status(404).json({ error: 'Voiture non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

module.exports = router;
