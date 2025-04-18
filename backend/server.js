const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const userRoutes = require('./routes/UserRoutes');
const carRoutes = require('./routes/CarRoutes');
const reservationRoutes = require('./routes/ReservationRoutes');
const trackRoutes = require('./routes/TrackRoutes'); // ✅ circuits

// ✅ Créer app
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Servir les images statiques
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// ✅ Routes API
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/tracks', trackRoutes);

// ✅ Fallback 404 (si aucune route ne correspond)
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ✅ Lancer le serveur
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
