const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // ✅ Correction du module bcrypt
const router = express.Router();

// 📌 Inscription (avec hashage du mot de passe)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: '✅ Compte créé avec succès', user: newUser });
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
