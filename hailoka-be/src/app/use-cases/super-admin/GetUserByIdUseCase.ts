import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { OrganizationUser } from "../../../infrastructure/database/models/organizationUser.model";

export class GetUserByIdUseCase {
    constructor(
        private userRepo: UserRepository,
        private orgRepo: OrganizationRepository
    ) {}

    async execute(userId: string) {
        const user = await this.userRepo.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Get user's organizations
        const orgUsers = await OrganizationUser.findAll({
            where: { user_id: userId },
            attributes: ["organization_id", "role_id", "status"],
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            picture_path: user.picturePath,
            is_verified_email: user.isVerifiedEmail,
            suspended_at: user.suspendedAt,
            created_at: user.createdAt,
            user_type: user.userType,
            organizations: orgUsers.map((ou) => ({
                organization_id: ou.organization_id,
                role_id: ou.role_id,
                status: ou.status,
            })),
        };
    }
}

