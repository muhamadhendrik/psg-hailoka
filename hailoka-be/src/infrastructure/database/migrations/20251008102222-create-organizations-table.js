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
    await queryInterface.createTable('organizations', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.literal("(UUID())"), primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      total_member: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      description: { type: Sequelize.TEXT },
      address: { type: Sequelize.TEXT },
      latitude: { type: Sequelize.FLOAT },
      longitude: { type: Sequelize.FLOAT },
      organization_status_id: { type: Sequelize.INTEGER, allowNull: false },
      primary_contact_full_name: { type: Sequelize.STRING },
      primary_contact_phone_number: { type: Sequelize.STRING },
      internal_notes: { type: Sequelize.TEXT, allowNull: true },
      created_by: { type: Sequelize.UUID, allowNull: false },
      updated_by: { type: Sequelize.UUID, allowNull: false },
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
    await queryInterface.dropTable('organizations');
  }
};
