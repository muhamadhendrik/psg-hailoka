import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { OrganizationStatusUpdateDTO } from "../../dto/organization/organization-status-update.dto";
import { Organization } from "../../../infrastructure/database/models/organization.model";
import sequelize from "../../../infrastructure/database/sequelize";

export class UpdateOrganizationStatusUseCase {
    constructor(private orgRepo: OrganizationRepository) {}

    async execute(
        organizationId: string,
        userId: string,
        dto: OrganizationStatusUpdateDTO
    ) {
        const org = await this.orgRepo.findById(organizationId);

        if (!org) {
            throw new Error("Organization not found");
        }

        // Validate status ID (1-4)
        if (dto.organization_status_id < 1 || dto.organization_status_id > 4) {
            throw new Error("Invalid organization status ID. Must be between 1 and 4");
        }

        const tx = await sequelize.transaction();

        try {
            // Update organization status and other fields in one transaction
            const updateData: any = {
                organization_status_id: dto.organization_status_id,
                updated_by: userId,
                updated_at: new Date(),
            };

            if (dto.reviewer_notes !== undefined) {
                updateData.reviewer_notes = dto.reviewer_notes;
            }

            if (dto.internal_notes !== undefined) {
                updateData.internal_notes = dto.internal_notes;
            }

            await Organization.update(
                updateData,
                { where: { id: organizationId }, transaction: tx }
            );

            await tx.commit();
        } catch (err) {
            await tx.rollback();
            throw err;
        }

        return { 
            success: true, 
            message: "Organization status updated successfully",
            organization_status_id: dto.organization_status_id
        };
    }
}

