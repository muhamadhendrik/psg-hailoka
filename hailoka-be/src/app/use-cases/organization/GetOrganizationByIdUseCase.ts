import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";

export class GetOrganizationByIdUseCase {
    constructor(private orgRepo: OrganizationRepository) {}

    async execute(organizationId: string, userId: string, userType: string) {
        const org = await this.orgRepo.findById(organizationId);

        if (!org) {
            throw new Error("Organization not found");
        }

        // Superadmin can access all organizations
        if (userType === "superadmin") {
            return {
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
                primary_did_number: org.primaryDidNumber,
                created_by: org.createdBy,
                updated_by: org.updatedBy,
                created_at: org.createdAt,
                updated_at: org.updatedAt,
            };
        }

        // Regular users can only access organizations they belong to
        if (userType === "user") {
            const orgUser = await this.orgRepo.getOrganizationUserByUserId(
                organizationId,
                userId
            );

            if (!orgUser) {
                throw new Error("You don't have access to this organization");
            }

            return {
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
                primary_did_number: org.primaryDidNumber,
                created_by: org.createdBy,
                updated_by: org.updatedBy,
                created_at: org.createdAt,
                updated_at: org.updatedAt,
            };
        }

        throw new Error("Forbidden");
    }
}

