import { OrganizationChangeLogRepository } from "../../../infrastructure/repositories/organizationChangeLog.repository";
import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";

export class GetOrganizationChangeLogsUseCase {
    constructor(
        private changeLogRepo: OrganizationChangeLogRepository,
        private orgRepo: OrganizationRepository
    ) {}

    async execute(organizationId: string, userId: string, page: number = 1, limit: number = 50) {
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

        // Get change logs
        const logs = await this.changeLogRepo.findByOrganizationId(
            organizationId,
            limit,
            offset
        );

        // Parse JSON data
        return logs.map((log) => ({
            id: log.id,
            organization_id: log.organizationId,
            old_data: log.oldDataJson ? JSON.parse(log.oldDataJson) : null,
            new_data: JSON.parse(log.newDataJson),
            user_id: log.userId,
            created_at: log.createdAt,
        }));
    }
}

