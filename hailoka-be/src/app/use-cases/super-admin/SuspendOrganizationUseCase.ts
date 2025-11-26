import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { OrganizationStatusUpdateDTO } from "../../dto/super-admin/organization-status-update.dto";
import { Organization } from "../../../infrastructure/database/models/organization.model";
import sequelize from "../../../infrastructure/database/sequelize";

const SUSPENDED_STATUS_ID = 3; // SUSPENDED

export class SuspendOrganizationUseCase {
    constructor(private orgRepo: OrganizationRepository) {}

    async execute(
        organizationId: string,
        suspendedBy: string,
        dto?: OrganizationStatusUpdateDTO
    ) {
        const org = await this.orgRepo.findById(organizationId);

        if (!org) {
            throw new Error("Organization not found");
        }

        if (org.organizationStatusId === SUSPENDED_STATUS_ID) {
            throw new Error("Organization is already suspended");
        }

        const tx = await sequelize.transaction();

        try {
            // Update organization status
            await this.orgRepo.updateStatus(organizationId, SUSPENDED_STATUS_ID);

            // Update organization with notes if provided
            if (dto?.reviewer_notes !== undefined || dto?.internal_notes !== undefined) {
                await Organization.update(
                    {
                        ...(dto.reviewer_notes !== undefined && { reviewer_notes: dto.reviewer_notes }),
                        ...(dto.internal_notes !== undefined && { internal_notes: dto.internal_notes }),
                        updated_by: suspendedBy,
                        updated_at: new Date(),
                    },
                    { where: { id: organizationId }, transaction: tx }
                );
            }

            // Note: According to PRD, when organization is suspended, users are NOT suspended

            await tx.commit();
        } catch (err) {
            await tx.rollback();
            throw err;
        }

        return { success: true, message: "Organization suspended successfully" };
    }
}

