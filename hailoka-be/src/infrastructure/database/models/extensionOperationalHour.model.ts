import {
  Model,
  DataTypes,
  Optional,
} from "sequelize";
import sequelize from "../sequelize";
import { Extension } from "./extension.model";

export interface ExtensionOperationalHourAttributes {
  id: number;
  extension_id: string;
  day_of_week: number; // 1-7 (Mon-Sun)
  start_time: string; // "04:00"
  end_time: string;   // "20:00"
}

export type ExtensionOperationalHourCreationAttributes = Optional<
  ExtensionOperationalHourAttributes,
  "id"
>;

export class ExtensionOperationalHour
  extends Model<
    ExtensionOperationalHourAttributes,
    ExtensionOperationalHourCreationAttributes
  >
  implements ExtensionOperationalHourAttributes
{
  public id!: number;
  public extension_id!: string;
  public day_of_week!: number;
  public start_time!: string;
  public end_time!: string;
}

ExtensionOperationalHour.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    extension_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    day_of_week: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ExtensionOperationalHour",
    tableName: "extension_operational_hours",
    timestamps: false,
  }
);

// ExtensionOperationalHour.belongsTo(Extension, {
//   foreignKey: "extension_id",
// });
