'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('extension_assigned_staffs', {
      extension_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      assigned_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      assigned_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('extension_assigned_staffs');
    
  }
};
