import { UserAuthMethodModel } from "../database/models/user_auth_method.model";
import { UserAuthMethods } from "../../domain/userAuthMethods";

export class UserAuthMethodsRepository {
    async findPasswordAuthByEmail(email: string) {
        return await UserAuthMethodModel.findOne({
            where: { provider: "password", provider_user_id: email },
            raw: true,
        });
    }

    async findByEmail(email: string) {
        return await UserAuthMethodModel.findOne({
            where: { provider: "password", provider_user_id: email },
        });
    }

    async findByUserIdAndProvider(
        userId: string,
        provider: string
    ): Promise<UserAuthMethods | null> {
        const row = await UserAuthMethodModel.findOne({
            where: { user_id: userId, provider: provider },
        });

        if (!row) return null;

        return {
            userId: row.user_id,
            provider: row.provider,
            providerUserId: row.provider_user_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }

    async findByProviderId(
        provider: "guest_token" | "password" | "google_login",
        providerUserId: string
    ): Promise<UserAuthMethods | null> {
        const record = await UserAuthMethodModel.findOne({
            where: { provider, provider_user_id: providerUserId },
        });

        if (!record) return null;

        return {
            userId: record.user_id,
            provider: record.provider as UserAuthMethods["provider"],
            providerUserId: record.provider_user_id,
            password_hash: record.password_hash ?? null,
        };
    }

    // 🔹 NEW: ambil auth method password by userId
    async findPasswordAuthByUserId(
        userId: string
    ): Promise<UserAuthMethods | null> {
        const record = await UserAuthMethodModel.findOne({
            where: { user_id: userId, provider: "password" },
        });

        if (!record) return null;

        return {
            userId: record.user_id,
            provider: record.provider as UserAuthMethods["provider"],
            providerUserId: record.provider_user_id,
            password_hash: record.password_hash ?? null,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
        };
    }

    async updatePassword(userId: string, newHashedPassword: string) {
        await UserAuthMethodModel.update(
            { password_hash: newHashedPassword },
            { where: { user_id: userId, provider: "password" } }
        );
    }

    async create(authMethod: UserAuthMethods): Promise<UserAuthMethods> {
        const created = await UserAuthMethodModel.create({
            user_id: authMethod.userId,
            provider: authMethod.provider,
            provider_user_id: authMethod.providerUserId,
        });

        const json = created.toJSON() as any;

        return {
            userId: json.user_id,
            provider: json.provider,
            providerUserId: json.provider_user_id,
            password_hash: json.password_hash,
            lastLoginAt: json.last_login_at,
            createdAt: json.created_at,
            updatedAt: json.updated_at,
        };
    }
}
