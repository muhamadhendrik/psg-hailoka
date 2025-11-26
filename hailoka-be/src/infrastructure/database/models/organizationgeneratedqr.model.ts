import {
  Model,
  DataTypes,
  Optional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../sequelize"; // ✅ import your instance

export interface OrganizationGeneratedQrAttributes {
  id: string;
  organization_id: string;
  qr_url: string;
  data_json: string;
  created_at: Date;
  expired_at?: Date | null;
}

export interface OrganizationGeneratedQrCreationAttributes
  extends Optional<OrganizationGeneratedQrAttributes, "id" | "expired_at" | "created_at"> {}

export class OrganizationGeneratedQr
  extends Model<
    InferAttributes<OrganizationGeneratedQr>,
    InferCreationAttributes<OrganizationGeneratedQr>
  >
  implements OrganizationGeneratedQrAttributes
{
  declare id: string;
  declare organization_id: string;
  declare qr_url: string;
  declare data_json: string;
  declare created_at: Date;
  declare expired_at: Date | null;
}

OrganizationGeneratedQr.init(
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
    qr_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data_json: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize, // ✅ actual Sequelize instance
    modelName: "OrganizationGeneratedQr",
    tableName: "organization_generated_qr",
    timestamps: false,
  }
);
