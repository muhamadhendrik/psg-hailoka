import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

export interface ExtensionStatusAttributes {
  id: number;
  name: string;
}

export class ExtensionStatus
  extends Model<ExtensionStatusAttributes>
  implements ExtensionStatusAttributes
{
  public id!: number;
  public name!: string;
}

ExtensionStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ExtensionStatus",
    tableName: "extension_status",
    timestamps: false,
  }
);
