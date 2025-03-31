const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

// ✅ Inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = 'user' } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const newUser = await User.create({ username, email, password, role });
    res.status(201).json({ message: 'Compte créé', user: newUser });
  } catch (error) {
    console.error('Erreur inscription :', error);
    res.status(500).json({ error: 'Erreur interne serveur' });
  }
});

// ✅ Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect' });

    res.status(200).json({ message: 'Connexion réussie', user });
  } catch (error) {
    console.error('Erreur login :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ Récupérer tous les utilisateurs (admin uniquement)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// ✅ Supprimer un utilisateur (admin)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Utilisateur supprimé' });
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// ✅ Promouvoir un utilisateur en admin (admin)
router.put('/promote/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body;
    if (role !== 'admin') {
      return res.status(400).json({ error: 'Le rôle doit être admin' });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    user.role = 'admin';
    await user.save();
    res.json({ message: 'Utilisateur promu en admin', user });
  } catch (error) {
    console.error('Erreur promotion :', error);
    res.status(500).json({ error: 'Erreur lors de la promotion' });
  }
});

module.exports = router;
