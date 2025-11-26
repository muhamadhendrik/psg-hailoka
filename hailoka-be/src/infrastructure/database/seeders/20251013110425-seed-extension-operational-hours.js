'use strict';

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

    const [extensions] = await queryInterface.sequelize.query(
      'SELECT id, name FROM extensions'
    );

    const days = [1, 2, 3, 4, 5, 6, 7]; // Mon-Sun
    const now = new Date();

    const rows = [];

    for (const ext of extensions) {
      for (const day of days) {
        rows.push({
          extension_id: ext.id,
          day_of_week: day,
          start_time: '08:00',
          end_time: ext.name.toLowerCase().includes('security')
            ? '23:59'
            : '17:00',
        });
      }
    }

    await queryInterface.bulkInsert('extension_operational_hours', rows);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('extension_operational_hours', null, {});
  }
};
