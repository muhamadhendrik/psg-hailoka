'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('call_feedbacks', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("(UUID())"),
        primaryKey: true,
        allowNull: false,
      },
      call_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'calls',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      kind: {
        type: Sequelize.ENUM('GUEST', 'USER'),
        allowNull: false,
      },
      ref_id: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'ID dari guest / user / extension yang memberikan feedback',
      },
      score: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        comment: 'Score 1-5',
      },
      feedback: {
        type: Sequelize.STRING(500),
        allowNull: true,
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
    await queryInterface.dropTable('call_feedbacks');
  }
};

