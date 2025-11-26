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
    await queryInterface.createTable("calls", {
      id: {
        type: Sequelize.UUID,
         defaultValue: Sequelize.literal("(UUID())"), // MariaDB generates UUID
        primaryKey: true,
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      join_code: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        comment: "Unique join code like Google Meet (e.g. iozudnuxps)",
      },
      direction: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "inbound",
        comment: "ENUM: inbound / outbound / internal",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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

    await queryInterface.dropTable("calls");
  }
};
