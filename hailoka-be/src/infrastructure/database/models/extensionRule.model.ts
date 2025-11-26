import {
  Model,
  DataTypes,
  Optional,
  BelongsToGetAssociationMixin,
  Association,
} from "sequelize";
import sequelize from "../sequelize";
import { Extension } from "./extension.model";

export interface ExtensionRuleAttributes {
  id: string;
  organization_id: string;
  extension_id: string;
  extension_destination: string;
  timescope: "any" | "work_hours" | "off_hours";
  condition: "always" | "busy" | "no_answer" | "unreachable";
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  deleted_by?: string | null;
  deleted_at?: Date | null;
}

export type ExtensionRuleCreationAttributes = Optional<
  ExtensionRuleAttributes,
  "id" | "deleted_by" | "deleted_at" | "created_at" | "updated_at"
>;

export class ExtensionRule
  extends Model<ExtensionRuleAttributes, ExtensionRuleCreationAttributes>
  implements ExtensionRuleAttributes
{
  public id!: string;
  public organization_id!: string;
  public extension_id!: string;
  public extension_destination!: string;
  public timescope!: "any" | "work_hours" | "off_hours";
  public condition!: "always" | "busy" | "no_answer" | "unreachable";
  public created_by!: string;
  public created_at!: Date;
  public updated_by!: string;
  public updated_at!: Date;
  public deleted_by!: string | null;
  public deleted_at!: Date | null;

  // Associations
  public extension?: Extension;
  public destination?: Extension;

  // Sequelize association mixins
  public getExtension!: BelongsToGetAssociationMixin<Extension>;
  public getDestination!: BelongsToGetAssociationMixin<Extension>;

  public static associations: {
    extension: Association<ExtensionRule, Extension>;
    destination: Association<ExtensionRule, Extension>;
  };
}

ExtensionRule.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    extension_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    extension_destination: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    timescope: {
      type: DataTypes.ENUM("any", "work_hours", "off_hours"),
      allowNull: false,
    },
    condition: {
      type: DataTypes.ENUM("always", "busy", "no_answer", "unreachable"),
      allowNull: false,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deleted_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ExtensionRule",
    tableName: "extension_rules",
    timestamps: false,
  }
);
