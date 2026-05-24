const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const User = require('./user.model');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_by_role: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'announcements',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Announcement.belongsTo(User, { as: 'author', foreignKey: 'created_by' });

module.exports = Announcement;
