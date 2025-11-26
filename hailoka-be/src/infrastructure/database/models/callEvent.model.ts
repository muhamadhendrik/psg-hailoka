import {
  Model,
  DataTypes,
  Optional,
  Association,
  BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../sequelize";
import { Call } from "./call.model";
import { CallParticipant } from "./callParticipant.model";

export interface CallEventAttributes {
  id: number;
  call_id: string;
  call_participant_id: number | null;
  attempt_count: number;
  event_type:
    | "created" | "queued" | "queue_updated" | "dial_attempt" | "ringing" | "answered"
    | "hold" | "unhold" | "forward" | "forward_ringing" | "forward_answered"
    | "forward_no_answer" | "forward_busy" | "transfer" | "transfer_ringing"
    | "transfer_answered" | "transfer_no_answer" | "transfer_busy"
    | "transfer_consulting" | "transfer_connecting" | "transfer_completed"
    | "transfer_failed" | "transfer_canceled" | "transfer_attended"
    | "rejected" | "busy" | "timeout" | "missed" | "canceled" | "failed" | "ended";
  queue_count: number;
  created_at: Date;
}

export type CallEventCreationAttributes = Optional<
  CallEventAttributes,
  "id" | "call_participant_id" | "created_at"
>;

export class CallEvent
  extends Model<CallEventAttributes, CallEventCreationAttributes>
  implements CallEventAttributes {
  public id!: number;
  public call_id!: string;
  public call_participant_id!: number | null;
  public attempt_count!: number;
  public event_type!: CallEventAttributes["event_type"];
  public queue_count!: number;
  public created_at!: Date;

  public getCall!: BelongsToGetAssociationMixin<Call>;
  public getParticipant!: BelongsToGetAssociationMixin<CallParticipant>;

  public static associations: {
    call: Association<CallEvent, Call>;
    participant: Association<CallEvent, CallParticipant>;
  };
}

CallEvent.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    call_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    call_participant_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    attempt_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    event_type: {
      type: DataTypes.ENUM(
        "created", "queued", "queue_updated", "dial_attempt", "ringing", "answered",
        "hold", "unhold", "forward", "forward_ringing", "forward_answered",
        "forward_no_answer", "forward_busy", "transfer", "transfer_ringing",
        "transfer_answered", "transfer_no_answer", "transfer_busy",
        "transfer_consulting", "transfer_connecting", "transfer_completed",
        "transfer_failed", "transfer_canceled", "transfer_attended",
        "rejected", "busy", "timeout", "missed", "canceled", "failed", "ended"
      ),
      allowNull: false,
    },
    queue_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "CallEvent",
    tableName: "call_events",
    timestamps: false,
  }
);
