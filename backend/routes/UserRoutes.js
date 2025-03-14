const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter un utilisateur
router.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l’utilisateur' });
  }
});

module.exports = router;
