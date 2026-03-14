const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  coverImage: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: { min: 0, max: 5 },
  },
  availableCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  totalCopies: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  publishedYear: {
    type: DataTypes.INTEGER,
  },
  pages: {
    type: DataTypes.INTEGER,
  },
  isbn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'books',
  timestamps: true,
});

module.exports = Book;
