import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import sequelize from "../../../infrastructure/database/sequelize";
import { OrganizationCreateDTO } from "../../../app/dto/organization/organization-create.dto";
import { EmailService } from "../../../domain/email";

const OWNER_ROLE_ID = 1;
const DEFAULT_ORG_STATUS_ID = 1; // in review

export class CreateOrganizationUseCase {
    constructor(
        private userRepo: UserRepository,
        private orgRepo: OrganizationRepository,
        private emailService: EmailService
    ) {}

    async execute(dto: OrganizationCreateDTO, submittingUserId: string) {
        const user = await this.userRepo.findById(submittingUserId);
        if (!user) throw new Error("Submitting user not found");

        const tx = await sequelize.transaction();
        let org;

        try {
            const orgPayload = {
                ...dto,
                organization_status_id: DEFAULT_ORG_STATUS_ID,
                created_by: submittingUserId,
                updated_by: submittingUserId,
            };

            org = await this.orgRepo.createOrganization(orgPayload, tx);

            await this.orgRepo.createOrganizationUser(
                {
                    userId: submittingUserId,
                    organizationId: org.id,
                    userEmail: user.email || "",
                    roleId: OWNER_ROLE_ID,
                    status: "active",
                    addedBy: submittingUserId,
                    updatedBy: submittingUserId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                tx
            );

            await tx.commit(); // ✅ commit sekali saja di sini
        } catch (err) {
            // ✅ rollback hanya kalau transaksinya belum selesai
            if (!(tx as any).finished) {
                await tx.rollback();
            }
            throw err;
        }

        // 📩 Kirim email DI LUAR transaksi
        const emailBody = `Halo ${user.name},

Terima kasih telah mendaftarkan organisasi ${org.name} di Hailoka.

Setelah kami meninjau pendaftaran anda, kami akan segera memberi kabar melalui email.

Anda dapat melihat status dan melakukan tindakan selanjutnya melalui dashboard:
👉 https://org.hailoka.com

Jika ada pertanyaan, silakan hubungi kami di support@hailoka.com.

Terima kasih telah menggunakan Hailoka!
Tim Hailoka`;

        try {
            await this.emailService.sendMail(
                user.email || "",
                "Pendaftaran Organisasi di Hailoka",
                emailBody
            );
        } catch (emailErr) {
            // Jangan gagalkan proses utama hanya karena email gagal
            console.error(
                "Gagal mengirim email pendaftaran organisasi:",
                emailErr
            );
        }

        return org;
    }
}
