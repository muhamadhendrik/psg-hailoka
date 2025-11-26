'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('organizations', 'reviewer_notes', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'internal_notes',
    });

    await queryInterface.addColumn('organizations', 'primary_did_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
      after: 'primary_contact_phone_number',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('organizations', 'reviewer_notes');
    await queryInterface.removeColumn('organizations', 'primary_did_number');
  }
};

