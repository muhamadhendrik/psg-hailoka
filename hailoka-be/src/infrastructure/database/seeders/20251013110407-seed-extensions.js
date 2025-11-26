'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const now = new Date();
    const orgId = uuidv4(); // Dummy organization

    // Dummy extensions
    const extensions = [
      'Laundry',
      'Receptionist A',
      'Receptionist B',
      'Room Service',
      'Security',
    ];

    await queryInterface.bulkInsert(
      'extensions',
      extensions.map((name, index) => ({
        id: uuidv4(),
        organization_id: orgId,
        name,
        status_id: 2, // active
        added_by: uuidv4(),
        updated_by: uuidv4(),
        created_at: now,
        updated_at: now,
      }))
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('extensions', null, {});
  }
};
