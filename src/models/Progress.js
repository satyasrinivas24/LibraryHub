const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  borrowingId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  currentPage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalPages: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  percentComplete: {
    type: DataTypes.VIRTUAL,
    get() {
      if (!this.totalPages || this.totalPages === 0) return 0;
      return Math.round((this.currentPage / this.totalPages) * 100);
    },
  },
  lastReadDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'progress',
  timestamps: true,
});

module.exports = Progress;
