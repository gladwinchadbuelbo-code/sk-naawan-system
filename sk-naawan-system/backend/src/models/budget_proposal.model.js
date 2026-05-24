const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const User = require('./user.model');

const BudgetProposal = sequelize.define('BudgetProposal', {
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
  total_amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  purpose: {
    type: DataTypes.STRING(200)
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'returned'),
    defaultValue: 'pending'
  },
  chairperson_feedback: {
    type: DataTypes.TEXT
  },
  submitted_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reviewed_by: {
    type: DataTypes.INTEGER
  },
  reviewed_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'budget_proposals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

BudgetProposal.belongsTo(User, { as: 'submitter', foreignKey: 'submitted_by' });

module.exports = BudgetProposal;
