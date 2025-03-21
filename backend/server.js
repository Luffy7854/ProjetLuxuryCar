const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/UserRoutes');
const carRoutes = require('./routes/CarRoutes');
const reservationRoutes = require('./routes/ReservationRoutes');
const path = require('path'); // ✅ Ajout pour servir les images statiques

require('dotenv').config();

const app = express();

// 📌 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Ajout pour supporter les formulaires
app.use('/images', express.static(path.join(__dirname, 'public/images'))); // ✅ Servir les images statiques

// ✅ Montage des routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);

// 📌 Vérifier que la base de données est bien connectée avant de démarrer le serveur
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

// 📌 Gestion des erreurs
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});
