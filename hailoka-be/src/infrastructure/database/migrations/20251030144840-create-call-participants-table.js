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

    await queryInterface.createTable("call_participants", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      call_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "calls", key: "id" },
        onDelete: "CASCADE",
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "ENUM: host / caller / recipient",
      },
      kind: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "ENUM: user / guest / extension",
      },
      ref_id: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: "References users.id or extensions.id depending on kind",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("call_participants", ["call_id", "ref_id", "kind"]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

     await queryInterface.dropTable("call_participants");
  }
};
