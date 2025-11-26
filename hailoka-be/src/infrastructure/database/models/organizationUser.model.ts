import {
  Model,
  DataTypes,
  Optional,
  Association,
  HasManyGetAssociationsMixin,
  BelongsToGetAssociationMixin,
} from "sequelize";
import sequelize from "../sequelize";

import { UserModel } from "./user.model";
import { ExtensionAssignedStaff } from "./extensionAssignedStaff.model";
import { Extension } from "./extension.model";

export interface OrganizationUserAttributes {
  user_id: string;
  organization_id: string;
  user_email: string;
  role_id: number;
  status: "pending" | "rejected" | "active" | "suspended";
  added_by: string;
  updated_by: string;
  removed_by?: string | null;
  removed_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type OrganizationUserCreationAttributes = Optional<
  OrganizationUserAttributes,
  "removed_by" | "removed_at" | "created_at" | "updated_at"
>;

export class OrganizationUser
  extends Model<OrganizationUserAttributes, OrganizationUserCreationAttributes>
  implements OrganizationUserAttributes
{
  public user_id!: string;
  public organization_id!: string;
  public user_email!: string;
  public role_id!: number;
  public status!: "pending" | "rejected" | "active" | "suspended";
  public added_by!: string;
  public updated_by!: string;
  public removed_by!: string | null;
  public removed_at!: Date | null;
  public created_at!: Date;
  public updated_at!: Date;

  // ✅ Declare association properties explicitly
  public user?: UserModel; // belongsTo
  public assignedExtensions?: ExtensionAssignedStaff[]; // hasMany

  // ✅ (Optional) Mixins if you want to use lazy-loading methods later
  public getUser!: BelongsToGetAssociationMixin<UserModel>;
  public getAssignedExtensions!: HasManyGetAssociationsMixin<ExtensionAssignedStaff>;

  // ✅ Associations (for TS)
  public static associations: {
    user: Association<OrganizationUser, UserModel>;
    assignedExtensions: Association<OrganizationUser, ExtensionAssignedStaff>;
  };
}

// ----------
// 4️⃣ Initialize the model
// ----------
OrganizationUser.init(
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "rejected", "active", "suspended"),
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
    removed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    removed_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: "OrganizationUser",
    tableName: "organization_users",
    timestamps: false,
  }
);

// ----------
// 5️⃣ Associations
// ----------
OrganizationUser.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "user",
});

OrganizationUser.hasMany(ExtensionAssignedStaff, {
  foreignKey: "user_id",
  sourceKey: "user_id",
  as: "assignedExtensions",
});

ExtensionAssignedStaff.belongsTo(Extension, {
  foreignKey: "extension_id",
  as: "extension",
});
