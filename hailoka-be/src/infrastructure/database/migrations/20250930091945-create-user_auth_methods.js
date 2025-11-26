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

    await queryInterface.createTable("user_auth_methods", {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      provider: {
        type: Sequelize.ENUM("guest_token", "password", "google_login"),
        allowNull: false,
        defaultValue: "guest_token",
        primaryKey: true,
      },
      provider_user_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
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
    await queryInterface.dropTable("user_auth_methods");
  }
};
