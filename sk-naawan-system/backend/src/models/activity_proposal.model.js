const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');
const User = require('./user.model');

const ActivityProposal = sequelize.define('ActivityProposal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  project_title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  project_proponent: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  barangay: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  objectives: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rationale: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  target_beneficiaries: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING(200)
  },
  venue: {
    type: DataTypes.STRING(200)
  },
  budget_requirement: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'returned'),
    defaultValue: 'pending'
  },
  chairperson_comments: {
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
  tableName: 'activity_proposals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

ActivityProposal.belongsTo(User, { as: 'submitter', foreignKey: 'submitted_by' });

module.exports = ActivityProposal;
