import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { GeneralExtensionSettings } from "../../../infrastructure/database/models/generalExtensionSettings.model";

export class GetOrganizationSettingsUseCase {
    constructor(private orgRepo: OrganizationRepository) {}

    async execute(organizationId: string, userId: string) {
        const org = await this.orgRepo.findById(organizationId);

        if (!org) {
            throw new Error("Organization not found");
        }

        // Check if user is owner
        const orgUser = await this.orgRepo.getOrganizationUserByUserId(
            organizationId,
            userId
        );

        if (!orgUser || orgUser.roleId !== 1) {
            // 1 = OWNER role
            throw new Error("Only owner can access organization settings");
        }

        // Get general extension settings
        const extensionSettings = await GeneralExtensionSettings.findByPk(
            organizationId
        );

        return {
            organization: {
                id: org.id,
                name: org.name,
                total_member: org.totalMember,
                description: org.description,
                address: org.address,
                latitude: org.latitude,
                longitude: org.longitude,
                organization_status_id: org.organizationStatusId,
                primary_contact_full_name: org.primaryContactFullName,
                primary_contact_phone_number: org.primaryContactPhoneNumber,
                created_at: org.createdAt,
                updated_at: org.updatedAt,
            },
            extension_settings: extensionSettings
                ? {
                      ring_timeout_seconds: extensionSettings.ring_timeout_seconds,
                      max_concurrent_calls: extensionSettings.max_concurrent_calls,
                      is_record_a_call: extensionSettings.is_record_a_call === 1,
                  }
                : null,
        };
    }
}

