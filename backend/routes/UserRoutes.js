const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// 📌 Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 📌 Inscription (ajout d’un utilisateur avec hashage du mot de passe)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe avant d’enregistrer l’utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajouter l’utilisateur dans la base de données
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    console.error('❌ Erreur lors de l’inscription :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// 📌 Connexion (vérification de l’email et du mot de passe)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l’utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    res.status(200).json({ message: 'Connexion réussie', user });
  } catch (error) {
    console.error('❌ Erreur lors de la connexion :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
