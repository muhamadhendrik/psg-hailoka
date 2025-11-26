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

    await queryInterface.createTable("call_events", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      call_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "calls", key: "id" },
        onDelete: "CASCADE",
      },
      call_participant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "call_participants", key: "id" },
        onDelete: "SET NULL",
        comment: "Nullable; filled for event types like answered, rejected, etc.",
      },
      attempt_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      event_type: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: "ENUM: created, queued, ringing, answered, rejected, bridged, bridge_ended, hold, unhold, forward_unconditional, forward_no_answer, forward_busy, transfer_blind, transfer_attended, dial_attempt_started, dial_attempt_result, missed, canceled, ended, queue_updated",
      },
      queue_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "Used only if event_type = queue",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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

    await queryInterface.dropTable("call_events");
  }
};
