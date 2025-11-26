import {
  Model,
  DataTypes,
  Optional,
} from "sequelize";
import sequelize from "../sequelize";
import { Extension } from "./extension.model";
import { UserModel } from "./user.model";

export interface ExtensionAssignedStaffAttributes {
  extension_id: string;
  user_id: string;
  assigned_by: string;
  assigned_at: Date;
}

export type ExtensionAssignedStaffCreationAttributes = Optional<
  ExtensionAssignedStaffAttributes,
  "assigned_at"
>;

export class ExtensionAssignedStaff
  extends Model<
    ExtensionAssignedStaffAttributes,
    ExtensionAssignedStaffCreationAttributes
  >
  implements ExtensionAssignedStaffAttributes
{
  public extension_id!: string;
  public user_id!: string;
  public assigned_by!: string;
  public assigned_at!: Date;
}

ExtensionAssignedStaff.init(
  {
    extension_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    assigned_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assigned_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ExtensionAssignedStaff",
    tableName: "extension_assigned_staffs",
    timestamps: false,
  }
);

// // 🔗 Relations
// ExtensionAssignedStaff.belongsTo(Extension, {
//   foreignKey: "extension_id",
// });
// ExtensionAssignedStaff.belongsTo(UserModel, {
//   foreignKey: "user_id",
// });
