import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";
// import sequelize from "../../database/connection"; // adjust path
import sequelize from "../sequelize";

// ---- Attributes ----
export interface UserAuthMethodAttributes {
  user_id: string;
  provider: "guest_token" | "password" | "google_login";
  provider_user_id: string;
  password_hash?: string | null;
  last_login_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

// ---- Creation Attributes ----
export interface UserAuthMethodCreationAttributes
  extends Optional<UserAuthMethodAttributes, "password_hash" | "last_login_at" | "created_at" | "updated_at"> {}

// ---- Model ----
export class UserAuthMethodModel
  extends Model<UserAuthMethodAttributes, UserAuthMethodCreationAttributes>
  implements UserAuthMethodAttributes {
  public user_id!: string;
  public provider!: "guest_token" | "password" | "google_login";
  public provider_user_id!: string;
  public password_hash!: string | null;
  public last_login_at!: Date | null;
  public created_at!: Date;
  public updated_at!: Date;
}

UserAuthMethodModel.init(
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM("guest_token", "password", "google_login"),
      allowNull: false,
      defaultValue: "guest_token",
      primaryKey: true,
    },
    provider_user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
  },
  {
    sequelize,
    tableName: "user_auth_methods",
    timestamps: false, // we manage created_at/updated_at manually
  }
);
