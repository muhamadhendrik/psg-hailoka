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

    await queryInterface.createTable('role', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    });

    // Optional: seed default roles
    await queryInterface.bulkInsert('role', [
      { id: 1, name: 'owner' },
      { id: 2, name: 'admin' },
      { id: 3, name: 'member' },
      { id: 4, name: 'viewer' },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.bulkDelete('role', null, {});
    await queryInterface.dropTable('role');
  }
};
