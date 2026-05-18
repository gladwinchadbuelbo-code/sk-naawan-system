const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const Event = require('./event.model'); // I should check if event.model.js exists

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  participant_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  barangay: {
    type: DataTypes.STRING(100)
  },
  age: {
    type: DataTypes.INTEGER
  },
  gender: {
    type: DataTypes.STRING(20)
  },
  time_in: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  remarks: {
    type: DataTypes.TEXT
  },
  qr_code_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recorded_by: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'attendance',
  timestamps: false // We use time_in and created_at manually if needed, but schema says time_in is enough
});

module.exports = Attendance;
