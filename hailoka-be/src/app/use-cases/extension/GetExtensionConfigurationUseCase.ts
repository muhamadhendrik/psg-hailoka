import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { GeneralExtensionSettings } from "../../../infrastructure/database/models/generalExtensionSettings.model";

export class GetExtensionConfigurationUseCase {
    constructor(private orgRepo: OrganizationRepository) {}

    async execute(organizationId: string, userId: string) {
        const org = await this.orgRepo.findById(organizationId);

        if (!org) {
            throw new Error("Organization not found");
        }

        // Check if user is owner or staff
        const orgUser = await this.orgRepo.getOrganizationUserByUserId(
            organizationId,
            userId
        );

        if (!orgUser) {
            throw new Error("User is not a member of this organization");
        }

        // Get general extension settings
        const extensionSettings = await GeneralExtensionSettings.findByPk(
            organizationId
        );

        // Return default values if settings don't exist
        if (!extensionSettings) {
            return {
                ring_timeout_seconds: 60,
                max_concurrent_calls: 1,
                is_record_a_call: false,
            };
        }

        return {
            ring_timeout_seconds: extensionSettings.ring_timeout_seconds,
            max_concurrent_calls: extensionSettings.max_concurrent_calls,
            is_record_a_call: extensionSettings.is_record_a_call === 1,
        };
    }
}

