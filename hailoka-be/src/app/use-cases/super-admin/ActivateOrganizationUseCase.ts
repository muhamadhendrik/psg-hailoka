import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { OrganizationStatusUpdateDTO } from "../../dto/super-admin/organization-status-update.dto";
import { Organization } from "../../../infrastructure/database/models/organization.model";
import sequelize from "../../../infrastructure/database/sequelize";

const APPROVED_STATUS_ID = 1; // APPROVED

export class ActivateOrganizationUseCase {
    constructor(private orgRepo: OrganizationRepository) {}

    async execute(
        organizationId: string,
        activatedBy: string,
        dto?: OrganizationStatusUpdateDTO
    ) {
        const org = await this.orgRepo.findById(organizationId);

        if (!org) {
            throw new Error("Organization not found");
        }

        if (org.organizationStatusId === APPROVED_STATUS_ID) {
            throw new Error("Organization is already active");
        }

        const tx = await sequelize.transaction();

        try {
            // Update organization status to APPROVED
            await this.orgRepo.updateStatus(organizationId, APPROVED_STATUS_ID);

            // Update organization with notes if provided
            if (dto?.reviewer_notes !== undefined || dto?.internal_notes !== undefined) {
                await Organization.update(
                    {
                        ...(dto.reviewer_notes !== undefined && { reviewer_notes: dto.reviewer_notes }),
                        ...(dto.internal_notes !== undefined && { internal_notes: dto.internal_notes }),
                        updated_by: activatedBy,
                        updated_at: new Date(),
                    },
                    { where: { id: organizationId }, transaction: tx }
                );
            }

            await tx.commit();
        } catch (err) {
            await tx.rollback();
            throw err;
        }

        return { success: true, message: "Organization activated successfully" };
    }
}

