import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface RoleAttributes {
  id: number;
  name: string;
}

export type RoleCreationAttributes = Optional<RoleAttributes, "id">;

export class RoleModel
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  declare id: number;
  declare name: string;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "role",
    timestamps: false,
  }
);

