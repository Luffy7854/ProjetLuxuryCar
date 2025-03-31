const express = require('express');
const { Op } = require('sequelize'); // 🔁 Ajout pour les opérateurs Sequelize
const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

const router = express.Router();

// 📌 Récupérer toutes les réservations avec les infos des voitures
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [{ model: Car }]
    });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// 📌 Créer une nouvelle réservation avec vérification des dates
router.post('/', async (req, res) => {
  const { user_name, car_id, start_date, end_date, total_price } = req.body;

  try {
    // 🔍 Vérifie s'il existe déjà une réservation chevauchante pour cette voiture
    const existingReservation = await Reservation.findOne({
      where: {
        car_id,
        [Op.or]: [
          {
            start_date: { [Op.between]: [start_date, end_date] }
          },
          {
            end_date: { [Op.between]: [start_date, end_date] }
          },
          {
            start_date: { [Op.lte]: start_date },
            end_date: { [Op.gte]: end_date }
          }
        ]
      }
    });

    if (existingReservation) {
      return res.status(400).json({ error: 'Cette voiture est déjà réservée à ces dates.' });
    }

    // ✅ Crée la réservation si aucune collision
    const reservation = await Reservation.create({
      user_name,
      car_id,
      start_date,
      end_date,
      total_price
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur création réservation :', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// 📌 Récupérer les réservations d'un utilisateur
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const reservations = await Reservation.findAll({
      where: { user_name: username },
      include: [{ model: Car }]
    });

    res.json(reservations);
  } catch (error) {
    console.error('Erreur récupération réservations utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
