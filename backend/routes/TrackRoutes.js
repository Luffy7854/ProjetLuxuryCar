const express = require('express');
const Track = require('../models/Track');
const router = express.Router();

// Récupérer tous les circuits
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    const formatted = tracks.map(track => ({
      ...track.toJSON(),
      imageUrl: `http://localhost:5000/images/${track.image}`
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des circuits' });
  }
});

// Ajouter un circuit
router.post('/', async (req, res) => {
  try {
    const { name, location, length_km, image } = req.body;
    const track = await Track.create({ name, location, length_km, image });
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’ajout du circuit' });
  }
});

// Supprimer un circuit
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Track.destroy({ where: { id: req.params.id } });
    deleted
      ? res.json({ message: 'Circuit supprimé' })
      : res.status(404).json({ error: 'Circuit non trouvé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

module.exports = router;
