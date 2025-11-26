import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../sequelize";

export interface GeneralExtensionSettingsAttributes {
    organization_id: string;
    ring_timeout_seconds: number;
    max_concurrent_calls: number;
    is_record_a_call: number;
    last_update_by: string;
    created_at: Date;
    updated_at: Date;
}

export type GeneralExtensionSettingsCreationAttributes = Optional<
    GeneralExtensionSettingsAttributes,
    "created_at" | "updated_at"
>;

export class GeneralExtensionSettings
    extends Model<
        GeneralExtensionSettingsAttributes,
        GeneralExtensionSettingsCreationAttributes
    >
    implements GeneralExtensionSettingsAttributes
{
    public organization_id!: string;
    public ring_timeout_seconds!: number;
    public max_concurrent_calls!: number;
    public is_record_a_call!: number;
    public last_update_by!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

GeneralExtensionSettings.init(
    {
        organization_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        ring_timeout_seconds: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 60,
        },
        max_concurrent_calls: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        is_record_a_call: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0,
        },
        last_update_by: {
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
        modelName: "GeneralExtensionSettings",
        tableName: "general_extension_settings",
        timestamps: false,
    }
);

