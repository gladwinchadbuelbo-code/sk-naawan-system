const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const User = require('./user.model');

const TransactionLog = sequelize.define('TransactionLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  related_record_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'transaction_logs',
  timestamps: false
});

// Define relations
TransactionLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = TransactionLog;
