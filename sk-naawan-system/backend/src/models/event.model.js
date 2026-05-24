const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING(100)
  },
  location: {
    type: DataTypes.STRING(200)
  },
  status: {
    type: DataTypes.ENUM('Planning', 'Upcoming', 'Completed', 'Cancelled', 'Approved', 'Pending'),
    defaultValue: 'Planning'
  },
  budget_proposal_id: {
    type: DataTypes.INTEGER
  },
  created_by: {
    type: DataTypes.INTEGER
  },
  archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Event;
