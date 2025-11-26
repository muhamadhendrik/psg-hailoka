'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('general_extension_settings', {
      organization_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      ring_timeout_seconds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
      },
      is_record_a_call: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 0,
        comment: '0 = false, 1 = true',
      },
      last_update_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('general_extension_settings');
  }
};

