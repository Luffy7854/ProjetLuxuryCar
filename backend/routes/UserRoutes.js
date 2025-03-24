const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const newUser = await User.create({ username, email, password }); // 👈 NE PLUS hash ici
    res.status(201).json({ message: 'Compte créé', user: newUser });
  } catch (error) {
    console.error('Erreur inscription :', error);
    res.status(500).json({ error: 'Erreur interne serveur' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password); // 👈 comparaison OK si un seul hash
    if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect' });

    res.status(200).json({ message: 'Connexion réussie', user });
  } catch (error) {
    console.error('Erreur login :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
