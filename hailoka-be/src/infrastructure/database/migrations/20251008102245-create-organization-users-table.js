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
    await queryInterface.createTable('organization_users', {
      user_id: { type: Sequelize.UUID, primaryKey: true },
      organization_id: { type: Sequelize.UUID, primaryKey: true },
      user_email: { type: Sequelize.STRING, primaryKey: true },
      role_id: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'rejected', 'active', 'suspended'), allowNull: false },
      added_by: { type: Sequelize.UUID, allowNull: false },
      updated_by: { type: Sequelize.UUID, allowNull: false },
      removed_by: { type: Sequelize.UUID, allowNull: true },
      removed_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') },
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('organization_users');
  }
};
