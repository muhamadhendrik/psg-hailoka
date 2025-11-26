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
    await queryInterface.addColumn('extensions', 'icon', {
      type: Sequelize.STRING, // Or other data type like INTEGER, DATE, BOOLEAN, etc.
      allowNull: true, // Or false if the column cannot be null
      defaultValue: null, // Optional: Set a default value
      // You can also add other options like unique, primaryKey, after, etc.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('extensions', 'icon');
  }
};
