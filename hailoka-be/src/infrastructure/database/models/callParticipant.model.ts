import {
  Model,
  DataTypes,
  Optional,
  Association,
  BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../sequelize";
import { Call } from "./call.model";
import { UserModel } from "./user.model";
import { Extension } from "./extension.model";
import { CallEvent } from "./callEvent.model";

export interface CallParticipantAttributes {
  id: number;
  call_id: string;
  role: "host" | "caller" | "recipient";
  kind: "user" | "guest" | "extension";
  ref_id: string | null;
  // ref_type: "user" | "extension" | null;
  
  created_at: Date;
}

export type CallParticipantCreationAttributes = Optional<
  CallParticipantAttributes,
  // "id" | "ref_id" | "ref_type" | "created_at"
  "id" | "ref_id" | "created_at"
>;

export class CallParticipant
  extends Model<CallParticipantAttributes, CallParticipantCreationAttributes>
  implements CallParticipantAttributes {
  public id!: number;
  public call_id!: string;
  public role!: "host" | "caller" | "recipient";
  public kind!: "user" | "guest" | "extension";
  public ref_id!: string | null;
  public ref_type!: "user" | "extension" | null;
  public created_at!: Date;

  public events?: CallEvent[];
  public extension?: Extension;
  public user?: UserModel;

  // association helpers
  public getCall!: BelongsToGetAssociationMixin<Call>;
  public getUserRef?: BelongsToGetAssociationMixin<UserModel>;
  public getExtensionRef?: BelongsToGetAssociationMixin<Extension>;

  public static associations: {
    call: Association<CallParticipant, Call>;
    extension: Association<CallParticipant, Extension>;
    user: Association<CallParticipant, UserModel>;
  };
}

CallParticipant.init(
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
    role: {
      type: DataTypes.ENUM("host", "caller", "recipient"),
      allowNull: false,
    },
    kind: {
      type: DataTypes.ENUM("user", "guest", "extension"),
      allowNull: false,
    },
    ref_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: "References user.id or extension.id depending on ref_type",
    },
    // ref_type: {
    //   type: DataTypes.ENUM("user", "extension"),
    //   allowNull: true,
    //   comment: "Polymorphic type of ref_id",
    // },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "CallParticipant",
    tableName: "call_participants",
    timestamps: false,
  }
);
