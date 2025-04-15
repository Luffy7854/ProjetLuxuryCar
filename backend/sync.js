const sequelize = require('./config/database');
const Car = require('./models/Car');
const Reservation = require('./models/Reservation');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // ❗ attention : supprime les données existantes
    console.log('✅ Base de données synchronisée avec succès !');

    // Ajout de voitures
    const cars = await Car.bulkCreate([
      { name: 'Ferrari SF90', brand: 'Ferrari', max_speed: 340, type: 'circuit', price_per_day: 2000, image: 'ferrari.jpg' },
      { name: 'Lamborghini Huracán', brand: 'Lamborghini', max_speed: 325, type: 'route', price_per_day: 1800, image: 'huracan.jpg' },
      { name: 'Porsche 911 GT3', brand: 'Porsche', max_speed: 320, type: 'circuit', price_per_day: 2200, image: 'porsche.jpg' }
    ]);

    console.log('🚗 Données test ajoutées !');

    // ✅ Ajout d'une réservation avec ville
    await Reservation.create({
      user_name: 'testuser',
      car_id: cars[1].id, // Lamborghini Huracán (type route)
      start_date: '2025-04-20',
      end_date: '2025-04-22',
      total_price: 3600,
      status: 'en cours',
      city: 'Paris'
    });

    console.log('📅 Réservation test ajoutée avec ville : Paris');

  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation de la base de données :', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
