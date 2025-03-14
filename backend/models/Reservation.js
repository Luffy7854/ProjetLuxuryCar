const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Car = require('./Car');

const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  car_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Car,
      key: 'id'
    }
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('en attente', 'confirmée', 'annulée'),
    defaultValue: 'en attente'
  }
}, {
  timestamps: true
});

// Définition de la relation entre les voitures et les réservations
Reservation.belongsTo(Car, { foreignKey: 'car_id' });

module.exports = Reservation;
