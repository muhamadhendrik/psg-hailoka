import {
  Model,
  DataTypes,
  Optional,
  HasManyGetAssociationsMixin,
  Association,
} from "sequelize";
import sequelize from "../sequelize";
import { ExtensionOperationalHour } from "./extensionOperationalHour.model";
import { ExtensionAssignedStaff } from "./extensionAssignedStaff.model";
import { CallParticipant } from "./callParticipant.model";

export interface ExtensionAttributes {
  id: string;
  organization_id: string;
  name: string;
  icon: string;
  status_id: number;
  added_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
}

export type ExtensionCreationAttributes = Optional<
  ExtensionAttributes,
  "id" | "created_at" | "updated_at"
>;

export class Extension
  extends Model<ExtensionAttributes, ExtensionCreationAttributes>
  implements ExtensionAttributes
{
  public id!: string;
  public organization_id!: string;
  public name!: string;
  public icon!: string;
  public status_id!: number;
  public added_by!: string;
  public updated_by!: string;
  public created_at!: Date;
  public updated_at!: Date;

   // 👇 Add these association properties so TypeScript knows they exist
  public operational?: ExtensionOperationalHour[];
  public assignedStaff?: ExtensionAssignedStaff[];

  // (Optional) Sequelize mixins if you ever call .getOperational() etc.
  public getOperational!: HasManyGetAssociationsMixin<ExtensionOperationalHour>;
  public getAssignedStaff!: HasManyGetAssociationsMixin<ExtensionAssignedStaff>;

  public callParticipants?: CallParticipant[];

  // (Optional) Static metadata for better IntelliSense
  public static associations: {
    operational: Association<Extension, ExtensionOperationalHour>;
    assignedStaff: Association<Extension, ExtensionAssignedStaff>;
    callParticipants: Association<Extension, CallParticipant>;
  };
}

Extension.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    added_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Extension",
    tableName: "extensions",
    timestamps: false,
  }
);

Extension.hasMany(CallParticipant, {
  foreignKey: 'ref_id',
  constraints: false,
  scope: { kind: 'extension' },
  as: 'callParticipantsList',
});

// // 🧩 Associations
// Extension.hasMany(ExtensionOperationalHour, {
//   foreignKey: "extension_id",
//   as: "operational",
// });
// Extension.hasMany(ExtensionAssignedStaff, {
//   foreignKey: "extension_id",
//   as: "assignedStaff",
// });
