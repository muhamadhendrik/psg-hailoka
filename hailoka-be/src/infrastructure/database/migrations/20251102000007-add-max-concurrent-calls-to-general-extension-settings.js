'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('general_extension_settings', 'max_concurrent_calls', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Maximum number of calls this extension can handle at the same time',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('general_extension_settings', 'max_concurrent_calls');
  }
};

