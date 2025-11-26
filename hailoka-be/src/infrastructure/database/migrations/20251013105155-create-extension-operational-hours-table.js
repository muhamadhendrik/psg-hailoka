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
    await queryInterface.createTable('extension_operational_hours', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      extension_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      day_of_week: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        comment: '1=Mon, 2=Tue, ..., 7=Sun',
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('extension_operational_hours');
    
  }
};
