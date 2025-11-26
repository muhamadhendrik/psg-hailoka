import { OrganizationUserLogRepository } from "../../../infrastructure/repositories/organizationUserLog.repository";
import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";

export class GetOrganizationUserLogsUseCase {
    constructor(
        private userLogRepo: OrganizationUserLogRepository,
        private orgRepo: OrganizationRepository
    ) {}

    async execute(
        organizationId: string,
        userId: string,
        targetUserId?: string,
        page: number = 1,
        limit: number = 50
    ) {
        // Check if organization exists
        const org = await this.orgRepo.findById(organizationId);
        if (!org) {
            throw new Error("Organization not found");
        }

        // Check if user has access to this organization
        const orgUser = await this.orgRepo.getOrganizationUserByUserId(
            organizationId,
            userId
        );

        if (!orgUser) {
            throw new Error("User does not have access to this organization");
        }

        // Calculate offset
        const offset = (page - 1) * limit;

        // Get user logs
        let logs;
        if (targetUserId) {
            // Get logs for specific user
            // Verify target user is in the organization
            const targetOrgUser = await this.orgRepo.getOrganizationUserByUserId(
                organizationId,
                targetUserId
            );

            if (!targetOrgUser) {
                throw new Error("Target user not found in organization");
            }

            logs = await this.userLogRepo.findByUserId(
                targetUserId,
                organizationId,
                limit,
                offset
            );
        } else {
            // Get all logs for the organization
            logs = await this.userLogRepo.findByOrganizationId(
                organizationId,
                limit,
                offset
            );
        }

        // Parse JSON data
        return logs.map((log) => ({
            id: log.id,
            extension_id: log.extensionId,
            user_id: log.userId,
            old_data: JSON.parse(log.oldDataJson),
            new_data: JSON.parse(log.newDataJson),
            created_by: log.createdBy,
            created_at: log.createdAt,
        }));
    }
}

