const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/UserRoutes');
const carRoutes = require('./routes/CarRoutes'); // Import des routes des voitures
const reservationRoutes = require('./routes/ReservationRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Assure-toi que tes routes sont montées correctement
app.use('/api/users', userRoutes); // API pour utilisateurs
app.use('/api/cars', carRoutes); // API pour voitures
app.use('/api/reservations', reservationRoutes); // API pour réservations

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie.');
    await sequelize.sync();
    console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données :', error);
  }
});
