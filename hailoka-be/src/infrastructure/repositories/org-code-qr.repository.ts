import { Op } from "sequelize";
import { OrganizationGeneratedQr, OrganizationGeneratedQrCreationAttributes } from "../database/models/organizationgeneratedqr.model";

export class OrgCodeQrRepository {

    async insert(
    payload: OrganizationGeneratedQrCreationAttributes,
    options?: Record<string, unknown>
  ): Promise<OrganizationGeneratedQr> {
    // console.log("repo debug ", payload);

    const now = new Date();

    try {
      // ✅ Use simpler null filter for better compatibility
      const resultUpdate = await OrganizationGeneratedQr.update(
        { expired_at: now },
        {
          where: {
            organization_id: payload.organization_id,
            [Op.or]: [
              { expired_at: null },
              { expired_at: { [Op.gt]: now } }, // optional: expire any still-active ones
            ],
          },
        }
      );

    //   console.log("resultUpdate >>> ", resultUpdate);

      // ✅ Then create a new record
      const result = await OrganizationGeneratedQr.create(payload as any, options);

    //   console.log("result >>> ", result);

      return result;
    } catch (err) {

      console.error("🔥 Error in insert:", err);
      throw err; // rethrow for the use case to catch
    }
  }

    /**
     * Get the latest organization_generated_qr for an organization (by created_at desc).
     * @param organizationId - organization id to filter by
     */
    async findLatestByOrganizationId(organizationId: string): Promise<OrganizationGeneratedQr | null> {
        return OrganizationGeneratedQr.findOne({
            where: { organization_id: organizationId },
            order: [["created_at", "DESC"]],
        });
    }

    /**
     * Get an organization_generated_qr by qr_url.
     * @param qrUrl - the qr_url to search for
     */
    async findByQrUrl( qrUrl: string ): Promise<OrganizationGeneratedQr | { message: string } | null> {
        const qr = await OrganizationGeneratedQr.findOne({
            where: {
                qr_url: qrUrl,
            },
        });

        if (!qr) return null;

        const now = new Date();
            if (qr.expired_at && qr.expired_at <= now) {
            return { message: "This QR code has expired." };
        }

        return qr;
    }

}