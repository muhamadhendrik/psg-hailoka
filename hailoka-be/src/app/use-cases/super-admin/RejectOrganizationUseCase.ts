import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { EmailService } from "../../../domain/email";
import { OrganizationStatusUpdateDTO } from "../../dto/super-admin/organization-status-update.dto";
import { Organization } from "../../../infrastructure/database/models/organization.model";
import sequelize from "../../../infrastructure/database/sequelize";

const REJECTED_STATUS_ID = 2; // REJECTED

export class RejectOrganizationUseCase {
    constructor(
        private orgRepo: OrganizationRepository,
        private userRepo: UserRepository,
        private emailService: EmailService
    ) {}

    async execute(
        organizationId: string,
        rejectedBy: string,
        dto?: OrganizationStatusUpdateDTO
    ) {
        const org = await this.orgRepo.findById(organizationId);

        if (!org) {
            throw new Error("Organization not found");
        }

        if (org.organizationStatusId === REJECTED_STATUS_ID) {
            throw new Error("Organization is already rejected");
        }

        const tx = await sequelize.transaction();

        try {
            // Update organization status
            await this.orgRepo.updateStatus(organizationId, REJECTED_STATUS_ID);

            // Update organization with notes if provided
            if (dto?.reviewer_notes !== undefined || dto?.internal_notes !== undefined) {
                await Organization.update(
                    {
                        ...(dto.reviewer_notes !== undefined && { reviewer_notes: dto.reviewer_notes }),
                        ...(dto.internal_notes !== undefined && { internal_notes: dto.internal_notes }),
                        updated_by: rejectedBy,
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

        // Send email to owner
        const owner = await this.userRepo.findById(org.createdBy);
        if (owner?.email) {
            const emailBody = `Halo ${owner.name},

Kami menyesal menginformasikan bahwa pendaftaran organisasi ${org.name} Anda telah ditolak.

${dto?.reviewer_notes ? `Alasan: ${dto.reviewer_notes}` : ""}

Jika Anda memiliki pertanyaan atau ingin mengajukan ulang, silakan hubungi kami di support@hailoka.com.

Terima kasih telah menggunakan Hailoka!
Tim Hailoka`;

            try {
                await this.emailService.sendMail(
                    owner.email,
                    "Pendaftaran Organisasi Ditolak - Hailoka",
                    emailBody
                );
            } catch (emailErr) {
                console.error("Failed to send rejection email:", emailErr);
            }
        }

        return { success: true, message: "Organization rejected successfully" };
    }
}

