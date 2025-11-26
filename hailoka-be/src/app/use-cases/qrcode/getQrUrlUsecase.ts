import { OrgCodeQrRepository } from "../../../infrastructure/repositories/org-code-qr.repository";
import jwt from "jsonwebtoken";

export class GetQrUrlUsecase {
  constructor(private qrRepo: OrgCodeQrRepository) {}

  async execute(qrUrl: string) {


    try {
      const result = await this.qrRepo.findByQrUrl(qrUrl);

      if (!result) {
        return { success: false, message: "QR code not found." };
      }

      // If repository returns an expired message object
      if ("message" in result) {
        return { success: false, message: result.message };
      }

      console.log("result >>> ", result.organization_id);
      

      // jwt token
      const token = jwt.sign(
            {
              organizationId: result.id,
              data: result.data_json,
            },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "7h" }
      );


      return { success: true, data: result, token: token };
    } catch (err: any) {
      return { success: false, error: err?.message ?? String(err) };
    }
  }
}
