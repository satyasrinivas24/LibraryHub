'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Progress', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      borrowingId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Borrowings',
          key: 'id'
        }
      },
      currentPage: Sequelize.INTEGER,
      totalPages: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Progress');
  }
};