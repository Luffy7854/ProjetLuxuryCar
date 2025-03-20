const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/UserRoutes');
const carRoutes = require('./routes/CarRoutes');
const reservationRoutes = require('./routes/ReservationRoutes');
require('dotenv').config(); // Chargement des variables d’environnement

const app = express();

// 📌 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Montage des routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);

// 📌 Connexion à la base de données et lancement du serveur
const PORT = process.env.PORT || 5000;
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Connexion à la base de données réussie.');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à la base de données :', error);
    process.exit(1);
  });

// 📌 Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// 📌 Gestion centralisée des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur :', err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});
