import { User } from "../../domain/user";
import { UserModel } from "../database/models/user.model";
import { UserAuthMethodModel } from "../database/models/user_auth_method.model";
import { UserAuthMethods } from "../../domain/userAuthMethods";

export class UserRepository {
    async create(
        user: Omit<User, "id" | "createdAt" | "updatedAt">
    ): Promise<User> {
        const created = await UserModel.create({
            name: user.name,
            email: user.email ?? null,
            picture_path: user.picturePath ?? null,
            is_verified_email: user.isVerifiedEmail ? 1 : 0,
            suspended_at: user.suspendedAt ?? null,
            deleted_at: user.deletedAt ?? null,
            user_type: user.userType,
        });

        return this.toDomain(created.toJSON());
    }

    async createUserAuthMethod(
        user: Omit<User, "createdAt" | "updatedAt">
    ): Promise<UserAuthMethods> {
        const created = await UserAuthMethodModel.create({
            user_id: user.id,
            provider: "password",
            provider_user_id: user.email || "",
            password_hash: user.hashedPassword || "",
            last_login_at: null,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return this.toDomainAuthMethod(created);
    }

    async findAll(): Promise<User[]> {
        const users = await UserModel.findAll({ raw: true });
        return users.map((u) => this.toDomain(u));
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findByPk(id, { raw: true });
        if (!user) return null;

        const domainUser: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            picturePath: user.picture_path,
            isVerifiedEmail: user.is_verified_email === 1, // convert number to boolean
            createdAt: user.created_at,
            updatedAt: user.updated_at,
            suspendedAt: user.suspended_at,
            deletedAt: user.deleted_at,
            userType: user.user_type,
        };

        return domainUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ where: { email }, raw: true });
        return user ? this.toDomain(user) : null;
    }

    private toDomain(raw: any): User {
        return {
            id: raw.id,
            name: raw.name,
            email: raw.email,
            picturePath: raw.picture_path,
            isVerifiedEmail: raw.is_verified_email === 1,
            createdAt: raw.created_at,
            updatedAt: raw.updated_at,
            suspendedAt: raw.suspended_at,
            deletedAt: raw.deleted_at,
            userType: raw.user_type,
        };
    }

    private toDomainAuthMethod(raw: any): UserAuthMethods {
        return {
            userId: raw.user_id,
            provider: raw.provider,
            providerUserId: raw.provider_user_id, // ⬅️ pakai field DB
        };
    }

    async update(userId: string, updates: Partial<User>): Promise<void> {
        await UserModel.update(updates, { where: { id: userId } });
    }

    // 🔹 NEW: helper khusus update profile + return user terbaru
    async updateProfile(
        userId: string,
        data: { name?: string | undefined }
    ): Promise<User> {
        await UserModel.update(
            {
                ...(typeof data.name !== "undefined"
                    ? { name: data.name }
                    : {}),
            },
            { where: { id: userId } }
        );

        const updated = await this.findById(userId);
        if (!updated) {
            throw new Error("User not found after update");
        }

        return updated;
    }
}
