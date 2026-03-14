const sequelize = require('../config/db');
const Book = require('./Book');
const Member = require('./Member');
const Borrowing = require('./Borrowing');
const Progress = require('./Progress');

// Associations
Member.hasMany(Borrowing, { foreignKey: 'memberId', as: 'borrowings', onDelete: 'CASCADE' });
Borrowing.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

Book.hasMany(Borrowing, { foreignKey: 'bookId', as: 'borrowings', onDelete: 'CASCADE' });
Borrowing.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

Borrowing.hasOne(Progress, { foreignKey: 'borrowingId', as: 'progress', onDelete: 'CASCADE' });
Progress.belongsTo(Borrowing, { foreignKey: 'borrowingId', as: 'borrowing' });

module.exports = { sequelize, Book, Member, Borrowing, Progress };
