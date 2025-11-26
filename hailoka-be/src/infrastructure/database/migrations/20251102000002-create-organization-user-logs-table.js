'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('organization_user_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      extension_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'extensions',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      old_data_json: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      new_data_json: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_by: {
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
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('organization_user_logs');
  }
};

