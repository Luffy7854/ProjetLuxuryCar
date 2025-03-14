const express = require('express');
const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

const router = express.Router();

// 📌 Récupérer toutes les réservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [{ model: Car }] // Jointure avec les voitures
    });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// 📌 Récupérer toutes les réservations
router.get('/', async (req, res) => {
    try {
      const reservations = await Reservation.findAll();
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
    }
  });
  
module.exports = router;
