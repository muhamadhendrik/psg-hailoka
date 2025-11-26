// src/infrastructure/database/models/callStaffAvailability.model.ts
import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../sequelize";
import { UserModel } from "./user.model";
import { Extension } from "./extension.model";

export class CallStaffAvailability extends Model {
  declare user_id: string;
  declare extension_id: string;
  declare isAvailable: boolean;

  // <- Add these so TypeScript knows associations exist
  declare user?: UserModel;
  declare extension?: Extension;

  // Optional: static associations metadata for better IntelliSense
  public static associations: {
    user: Association<CallStaffAvailability, UserModel>;
    extension: Association<CallStaffAvailability, Extension>;
  };
}

CallStaffAvailability.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    extension_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "call_staff_availability",
    modelName: "CallStaffAvailability",
    timestamps: false,
  }
);

export default CallStaffAvailability;
