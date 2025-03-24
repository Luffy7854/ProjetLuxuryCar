const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/UserRoutes'); // ✅ nom de variable corrigé ici
const carRoutes = require('./routes/CarRoutes');
const reservationRoutes = require('./routes/ReservationRoutes');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/users', userRoutes); // ✅ correspond à l'import
app.use('/api/cars', carRoutes);
app.use('/api/reservations', reservationRoutes);

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

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});
