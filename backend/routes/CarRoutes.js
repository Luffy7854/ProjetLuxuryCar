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

    // Ajouter l'URL complète de l'image pour chaque voiture
    const carsWithImages = cars.map(car => ({
      ...car.toJSON(),
      imageUrl: `http://localhost:5000/images/${car.image}` // Créer l'URL complète de l'image
    }));

    res.json(carsWithImages); // Retourner les voitures avec l'URL des images
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des voitures' });
  }
});

// 📌 Récupérer une voiture par son ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);

    if (!car) {
      return res.status(404).json({ error: 'Voiture non trouvée' });
    }

    // Ajouter l'URL complète de l'image pour cette voiture
    const carWithImage = {
      ...car.toJSON(),
      imageUrl: `http://localhost:5000/images/${car.image}` // Créer l'URL complète de l'image
    };

    res.json(carWithImage); // Retourner la voiture avec l'URL de l'image
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la voiture' });
  }
});

// 📌 Ajouter une nouvelle voiture (utile pour admin)
router.post('/', async (req, res) => {
  try {
    const { name, brand, max_speed, type, price_per_day, image } = req.body;

    const newCar = await Car.create({
      name,
      brand,
      max_speed,
      type,
      price_per_day,
      image
    });

    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’ajout de la voiture' });
  }
});

module.exports = router;
