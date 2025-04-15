const sequelize = require('./config/database');
const Car = require('./models/Car');
const Reservation = require('./models/Reservation');
const Track = require('./models/Track'); // ✅ Import du modèle Track

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // ⚠️ Supprime et recrée les tables (utile pour le développement)
    console.log('✅ Base de données synchronisée avec succès !');

    // Ajout de voitures de test
    await Car.bulkCreate([
      { name: 'Ferrari SF90', brand: 'Ferrari', max_speed: 340, type: 'circuit', price_per_day: 2000, image: 'ferrari.jpg' },
      { name: 'Lamborghini Huracán', brand: 'Lamborghini', max_speed: 325, type: 'route', price_per_day: 1800, image: 'huracan.jpg' },
      { name: 'Porsche 911 GT3', brand: 'Porsche', max_speed: 320, type: 'circuit', price_per_day: 2200, image: 'porsche.jpg' }
    ]);

    // ✅ Ajout de circuits de test
    await Track.bulkCreate([
      { name: 'Circuit Paul Ricard', location: 'Le Castellet', length_km: 5.8, image: 'paul_ricard.jpg' },
      { name: 'Circuit de Spa-Francorchamps', location: 'Belgique', length_km: 7.0, image: 'spa.jpg' },
      { name: 'Circuit de Monaco', location: 'Monaco', length_km: 3.3, image: 'monaco.jpg' }
    ]);

    console.log('🚗 Données test ajoutées (voitures et circuits) !');
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation de la base de données :', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
