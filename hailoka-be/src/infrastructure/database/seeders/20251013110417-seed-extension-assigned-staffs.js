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

    // Example: Assign each extension to a dummy staff user
    const [extensions] = await queryInterface.sequelize.query(
      'SELECT id FROM extensions'
    );

    const now = new Date();
    const dummyUserIds = [
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
      uuidv4(),
    ];

    await queryInterface.bulkInsert(
      'extension_assigned_staffs',
      extensions.map((ext, index) => ({
        extension_id: ext.id,
        user_id: dummyUserIds[index],
        assigned_by: uuidv4(),
        assigned_at: now,
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
    await queryInterface.bulkDelete('extension_assigned_staffs', null, {});
  }
};
