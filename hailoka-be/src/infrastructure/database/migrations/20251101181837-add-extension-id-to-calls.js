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
    await queryInterface.addColumn("calls", "extension_id", {
      type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "extensions", // ✅ name of the table, not model
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        comment: "Links a call to its extension (if applicable)",
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("calls", "extension_id");
  }
};
