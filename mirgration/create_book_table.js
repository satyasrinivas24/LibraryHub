'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      title: Sequelize.STRING,
      author: Sequelize.STRING,
      genre: Sequelize.STRING,
      isbn: Sequelize.STRING,
      description: Sequelize.TEXT,
      coverUrl: Sequelize.STRING,
      rating: Sequelize.FLOAT,
      totalCopies: Sequelize.INTEGER,
      availableCopies: Sequelize.INTEGER,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Books');
  }
};