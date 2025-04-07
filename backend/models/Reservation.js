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
    allowNull: false
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
    type: DataTypes.ENUM('en cours', 'terminé'),
    defaultValue: 'en cours'
  }
}, {
  timestamps: true
});

// ✅ Ajoute la relation ici uniquement
Reservation.belongsTo(Car, { foreignKey: 'car_id' });

module.exports = Reservation;
