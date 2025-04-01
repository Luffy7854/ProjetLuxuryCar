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
    type: DataTypes.ENUM('en cours', 'terminé'), // ✅ statuts mis à jour ici
    defaultValue: 'en cours'
  }
}, {
  timestamps: true
});

// Relation entre les voitures et les réservations
Reservation.belongsTo(Car, { foreignKey: 'car_id' });

module.exports = Reservation;

// Supprimer une réservation
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Reservation.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Réservation supprimée' });
    } else {
      res.status(404).json({ error: 'Réservation non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la réservation' });
  }
});
