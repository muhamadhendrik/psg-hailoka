import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { UserModel } from "../../../infrastructure/database/models/user.model";
import { OrganizationUser } from "../../../infrastructure/database/models/organizationUser.model";
import sequelize from "../../../infrastructure/database/sequelize";

export class SuspendUserUseCase {
    constructor(
        private userRepo: UserRepository,
        private orgRepo: OrganizationRepository
    ) {}

    async execute(userId: string, suspendedBy: string) {
        const user = await this.userRepo.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.userType === "superadmin") {
            throw new Error("Cannot suspend super admin");
        }

        const tx = await sequelize.transaction();

        try {
            // Suspend user
            await UserModel.update(
                { suspended_at: new Date() },
                { where: { id: userId }, transaction: tx }
            );

            // If user is owner, suspend their organizations
            if (user.userType === "user") {
                const ownerOrgs = await OrganizationUser.findAll({
                    where: {
                        user_id: userId,
                        role_id: 1, // OWNER role
                        status: "active",
                    },
                    transaction: tx,
                });

                for (const orgUser of ownerOrgs) {
                    // Update organization status to SUSPENDED (3)
                    await this.orgRepo.updateStatus(orgUser.organization_id, 3);

                    // Update organization_user status to suspended
                    await OrganizationUser.update(
                        { status: "suspended", updated_by: suspendedBy },
                        {
                            where: {
                                user_id: userId,
                                organization_id: orgUser.organization_id,
                            },
                            transaction: tx,
                        }
                    );
                }
            } else {
                // If user is staff, only suspend the user, not organizations
                await OrganizationUser.update(
                    { status: "suspended", updated_by: suspendedBy },
                    {
                        where: { user_id: userId },
                        transaction: tx,
                    }
                );
            }

            await tx.commit();
        } catch (err) {
            await tx.rollback();
            throw err;
        }

        return { success: true, message: "User suspended successfully" };
    }
}

