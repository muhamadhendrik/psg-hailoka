import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { UserModel } from "../../../infrastructure/database/models/user.model";
import { Op } from "sequelize";

export class GetAllUsersUseCase {
    constructor(private userRepo: UserRepository) {}

    async execute() {
        const users = await UserModel.findAll({
            where: {
                user_type: { [Op.in]: ["user", "superadmin"] },
            },
            attributes: [
                "id",
                "name",
                "email",
                "is_verified_email",
                "suspended_at",
                "created_at",
                "user_type",
            ],
            order: [["created_at", "DESC"]],
        });

        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            is_verified_email: user.is_verified_email === 1,
            suspended_at: user.suspended_at,
            created_at: user.created_at,
            user_type: user.user_type,
        }));
    }
}

