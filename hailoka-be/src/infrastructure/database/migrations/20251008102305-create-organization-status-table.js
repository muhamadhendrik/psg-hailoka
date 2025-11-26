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

    await queryInterface.createTable('organization_status', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    // Optional: seed initial statuses
    // await queryInterface.bulkInsert('organization_status', [
    //   { id: 1, name: 'in review' },
    //   { id: 2, name: 'approved' },
    //   { id: 3, name: 'rejected' },
    //   { id: 4, name: 'suspended' },
    // ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // await queryInterface.bulkDelete('organization_status', null, {});
    await queryInterface.dropTable('organization_status');
  }
};
