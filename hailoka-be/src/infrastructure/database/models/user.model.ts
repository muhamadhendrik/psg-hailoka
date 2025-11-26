import { Association, DataTypes, Model, Optional } from "sequelize";
import sequelize from "../sequelize";
import { ExtensionAssignedStaff } from "./extensionAssignedStaff.model";
import { CallParticipant } from "./callParticipant.model";
import { CallStaffAvailability } from "./callStaffAvailability";

export interface UserAttributes {
  id: string;
  name: string;
  email?: string | null;
  picture_path?: string | null;
  is_verified_email: number;
  created_at: Date;
  updated_at: Date;
  suspended_at?: Date | null;
  deleted_at?: Date | null;
  user_type: "guest" | "superadmin" | "user";
}

// ✅ Make DB-managed fields optional for creation
export type UserCreationAttributes = Optional<
  UserAttributes,
  | "id"
  | "email"
  | "picture_path"
  | "suspended_at"
  | "deleted_at"
  | "is_verified_email"
  | "user_type"
  | "created_at"
  | "updated_at"
>;

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: string;
  declare name: string;
  declare email: string | null;
  declare picture_path: string | null;
  declare is_verified_email: number;
  declare created_at: Date;
  declare updated_at: Date;
  declare suspended_at: Date | null;
  declare deleted_at: Date | null;
  declare user_type: "guest" | "superadmin" | "user";
  public callParticipants?: CallParticipant[];

  public static associations: {
    callParticipants: Association<UserModel, CallParticipant>;
  };
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    picture_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verified_email: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    suspended_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    user_type: {
      type: DataTypes.ENUM("guest", "superadmin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

UserModel.hasMany(CallParticipant, {
  foreignKey: 'ref_id',
  constraints: false,
  scope: { kind: 'user' },
  as: 'callParticipantsList',
});

// add association function (called from central loader)
// (UserModel as any).associate = function (models: any) {
//   const { ExtensionAssignedStaff, Extension } = models;

//   UserModel.hasMany(ExtensionAssignedStaff, {
//     foreignKey: "user_id",
//     as: "extension_assignments",
//   });

//   UserModel.belongsToMany(Extension, {
//     through: ExtensionAssignedStaff,
//     foreignKey: "user_id",
//     otherKey: "extension_id",
//     as: "extensions",
//   });
// };

// UserModel.hasMany(ExtensionAssignedStaff, {
//   foreignKey: "user_id",
// });
