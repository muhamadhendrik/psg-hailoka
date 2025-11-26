import {
  Model,
  DataTypes,
  Optional,
  HasManyGetAssociationsMixin,
  Association,
} from "sequelize";
import sequelize from "../sequelize";
import { CallParticipant } from "./callParticipant.model";
import { CallEvent } from "./callEvent.model";
import { Extension } from "./extension.model";

export interface CallAttributes {
  id: string;
  organization_id: string;
  join_code: string;
  direction: "inbound" | "outbound" | "internal";
  created_at: Date;
  extension_id?: string;
}

export type CallCreationAttributes = Optional<CallAttributes, "id" | "created_at">;

export class Call extends Model<CallAttributes, CallCreationAttributes> implements CallAttributes {
  public id!: string;
  public organization_id!: string;
  public join_code!: string;
  public direction!: "inbound" | "outbound" | "internal";
  public created_at!: Date;
  public extension_id? : string

  // public extension: Extension;

  public participants?: CallParticipant[];
  public events?: CallEvent[];

  public getParticipants!: HasManyGetAssociationsMixin<CallParticipant>;
  public getEvents!: HasManyGetAssociationsMixin<CallEvent>;

  public static associations: {
    participants: Association<Call, CallParticipant>;
    events: Association<Call, CallEvent>;
    extension: Association<Call, Extension>
  };
}

Call.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    join_code: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      comment: "Unique join code like Google Meet",
    },
    direction: {
      type: DataTypes.ENUM("inbound", "outbound", "internal"),
      allowNull: false,
      defaultValue: "inbound",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    extension_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "Reference to extension.id",
    },
  },
  {
    sequelize,
    modelName: "Call",
    tableName: "calls",
    timestamps: false,
  }
);
