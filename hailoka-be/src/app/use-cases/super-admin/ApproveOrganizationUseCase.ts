import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { EmailService } from "../../../domain/email";
import { OrganizationStatusUpdateDTO } from "../../dto/super-admin/organization-status-update.dto";
import { Organization } from "../../../infrastructure/database/models/organization.model";
import { GeneralExtensionSettings } from "../../../infrastructure/database/models/generalExtensionSettings.model";
import sequelize from "../../../infrastructure/database/sequelize";

const APPROVED_STATUS_ID = 1; // APPROVED
const PENDING_STATUS_ID = 0; // PENDING APPROVAL

export class ApproveOrganizationUseCase {
    constructor(
        private orgRepo: OrganizationRepository,
        private userRepo: UserRepository,
        private emailService: EmailService
    ) {}

    async execute(
        organizationId: string,
        approvedBy: string,
        dto?: OrganizationStatusUpdateDTO
    ) {
        const org = await this.orgRepo.findById(organizationId);

        if (!org) {
            throw new Error("Organization not found");
        }

        if (org.organizationStatusId === APPROVED_STATUS_ID) {
            throw new Error("Organization is already approved");
        }

        const tx = await sequelize.transaction();

        try {
            // Update organization status
            await this.orgRepo.updateStatus(organizationId, APPROVED_STATUS_ID);

            // Update organization with notes if provided
            if (dto?.reviewer_notes !== undefined || dto?.internal_notes !== undefined) {
                await Organization.update(
                    {
                        ...(dto.reviewer_notes !== undefined && { reviewer_notes: dto.reviewer_notes }),
                        ...(dto.internal_notes !== undefined && { internal_notes: dto.internal_notes }),
                        updated_by: approvedBy,
                        updated_at: new Date(),
                    },
                    { where: { id: organizationId }, transaction: tx }
                );
            }

            // Create or update general_extension_settings (as per PRD requirement)
            await GeneralExtensionSettings.findOrCreate({
                where: { organization_id: organizationId },
                defaults: {
                    organization_id: organizationId,
                    ring_timeout_seconds: 60,
                    max_concurrent_calls: 1,
                    is_record_a_call: 0,
                    last_update_by: approvedBy,
                },
                transaction: tx,
            });

            await tx.commit();
        } catch (err) {
            await tx.rollback();
            throw err;
        }

        // Send email to owner
        const owner = await this.userRepo.findById(org.createdBy);
        if (owner?.email) {
            const emailBody = `Halo ${owner.name},

Selamat! Organisasi ${org.name} Anda telah disetujui dan sekarang dapat digunakan di Hailoka.

Anda dapat mulai mengatur extension dan melakukan konfigurasi lainnya melalui dashboard:
👉 https://org.hailoka.com

Jika ada pertanyaan, silakan hubungi kami di support@hailoka.com.

Terima kasih telah menggunakan Hailoka!
Tim Hailoka`;

            try {
                await this.emailService.sendMail(
                    owner.email,
                    "Organisasi Anda Telah Disetujui - Hailoka",
                    emailBody
                );
            } catch (emailErr) {
                console.error("Failed to send approval email:", emailErr);
            }
        }

        return { success: true, message: "Organization approved successfully" };
    }
}

