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
    await queryInterface.createTable("extension_rules", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      organization_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      extension_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "extensions", key: "id" },
        onDelete: "CASCADE",
      },
      extension_destination: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "extensions", key: "id" },
        onDelete: "CASCADE",
      },
      timescope: {
        type: Sequelize.ENUM("any", "work_hours", "off_hours"),
        allowNull: false,
      },
      condition: {
        type: Sequelize.ENUM("always", "busy", "no_answer", "unreachable"),
        allowNull: false,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_by: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable("extension_rules");
  }
};
