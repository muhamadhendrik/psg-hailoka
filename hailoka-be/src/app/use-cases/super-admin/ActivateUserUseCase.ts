import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { UserModel } from "../../../infrastructure/database/models/user.model";
import { OrganizationUser } from "../../../infrastructure/database/models/organizationUser.model";
import sequelize from "../../../infrastructure/database/sequelize";

export class ActivateUserUseCase {
    constructor(
        private userRepo: UserRepository,
        private orgRepo: OrganizationRepository
    ) {}

    async execute(userId: string, activatedBy: string) {
        const user = await this.userRepo.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const tx = await sequelize.transaction();

        try {
            // Activate user
            await UserModel.update(
                { suspended_at: null },
                { where: { id: userId }, transaction: tx }
            );

            // Update organization_user status to active
            await OrganizationUser.update(
                { status: "active", updated_by: activatedBy },
                {
                    where: { user_id: userId },
                    transaction: tx,
                }
            );

            // Note: Organizations are not automatically activated when user is activated
            // Super admin needs to activate organizations separately

            await tx.commit();
        } catch (err) {
            await tx.rollback();
            throw err;
        }

        return { success: true, message: "User activated successfully" };
    }
}

