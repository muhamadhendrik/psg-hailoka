import { OrgCodeQrRepository } from "../../../infrastructure/repositories/org-code-qr.repository";

export class GetQrByOrgUseCase {
  constructor(private qrRepo: OrgCodeQrRepository) {}

  async execute(organizationId: string) {
    try {
      const result = await this.qrRepo.findLatestByOrganizationId(organizationId);

      if (!result) {
        return { success: false, message: "No QR code found for this organization." };
      }

      return { success: true, data: result };
    } catch (err: any) {
      return { success: false, error: err?.message ?? String(err) };
    }
  }
}
