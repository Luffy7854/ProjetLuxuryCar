const express = require('express');
const { Op } = require('sequelize');
const Reservation = require('../models/Reservation');
const Car = require('../models/Car');

const router = express.Router();

// 📌 Récupérer toutes les réservations
router.get('/', async (req, res) => {
  try {
    const today = new Date();

    // 🔁 Met à jour les réservations terminées automatiquement
    await Reservation.update(
      { status: 'terminé' },
      {
        where: {
          end_date: { [Op.lt]: today },
          status: 'en cours',
        },
      }
    );

    const reservations = await Reservation.findAll({
      include: [{ model: Car }],
    });

    res.json(reservations);
  } catch (error) {
    console.error('Erreur récupération réservations :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réservations' });
  }
});

// 📌 Créer une nouvelle réservation
router.post('/', async (req, res) => {
  const { user_name, car_id, start_date, end_date, total_price, city } = req.body;

  try {
    const today = new Date();
    const start = new Date(start_date);
    const end = new Date(end_date);

    if (start < today || end < today || end < start) {
      return res.status(400).json({ error: 'Dates invalides. Impossible de réserver dans le passé.' });
    }

    const existingReservation = await Reservation.findOne({
      where: {
        car_id,
        [Op.or]: [
          {
            start_date: { [Op.between]: [start_date, end_date] },
          },
          {
            end_date: { [Op.between]: [start_date, end_date] },
          },
          {
            start_date: { [Op.lte]: start_date },
            end_date: { [Op.gte]: end_date },
          },
        ],
      },
    });

    if (existingReservation) {
      return res.status(400).json({ error: 'Cette voiture est déjà réservée à ces dates.' });
    }

    const reservation = await Reservation.create({
      user_name,
      car_id,
      start_date,
      end_date,
      total_price,
      city: city || null
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur création réservation :', error);
    res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
  }
});

// 📌 Récupérer les réservations d’un utilisateur (avec ville)
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const today = new Date();

    await Reservation.update(
      { status: 'terminé' },
      {
        where: {
          user_name: username,
          end_date: { [Op.lt]: today },
          status: 'en cours',
        },
      }
    );

    const reservations = await Reservation.findAll({
      where: { user_name: username },
      include: [{ model: Car }],
      attributes: [
        'id',
        'user_name',
        'car_id',
        'start_date',
        'end_date',
        'total_price',
        'status',
        'city',
        'createdAt',
        'updatedAt'
      ],
    });

    res.json(reservations);
  } catch (error) {
    console.error('Erreur récupération réservations utilisateur :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📌 Supprimer une réservation
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Reservation.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Réservation supprimée' });
    } else {
      res.status(404).json({ error: 'Réservation non trouvée' });
    }
  } catch (error) {
    console.error('Erreur suppression réservation :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la réservation' });
  }
});

module.exports = router;
