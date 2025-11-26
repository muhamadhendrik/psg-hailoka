import { OrgCodeQrRepository } from "../infrastructure/repositories/org-code-qr.repository";
import { CreateGenerateQrUseCase } from "../app/use-cases/qrcode/createGenerateQr";
import { GetQrUrlUsecase } from "../app/use-cases/qrcode/getQrUrlUsecase";
import { GetQrByOrgUseCase } from "../app/use-cases/qrcode/getQrByOrgUseCase";
import { Request, Response } from "express";
import QRCode from "qrcode";

const qrRepo = new OrgCodeQrRepository()

export class QrOrganizationController {

    static async getByOrgId(req: Request, res: Response) {

        const getQrByOrgUc = new GetQrByOrgUseCase(qrRepo)

        try {

            const organizationId    = req.params.organizationId || "";
            const result            = await getQrByOrgUc.execute(organizationId);
            res.json(result);
            
        } catch (err: any) {
             res.status(400).json({ error: err.message });
        }

    }

    /**
   * Generate and store a new QR code for an organization
   */
    static async generateQr(req: Request, res: Response) {

        const createQrUc = new CreateGenerateQrUseCase(qrRepo);

        try {
            const { organization_id, data } = req.body;

            if (!organization_id) {
                return res.status(400).json({ error: "organization_id is required" });
            }

            const qrUrl = crypto.randomUUID();

            // ✅ Convert request data into JSON string
            const payload = {
                organization_id,
                data_json: JSON.stringify(data),
                qr_url: qrUrl, // optional if you generate this elsewhere
                created_at: new Date(),
                expired_at: null,
            };

            // console.log("payload >>>> ", payload);
            

            const result = await createQrUc.execute(payload);

            res.json(result);

        } catch (err: any) {

            res.status(500).json({ error: err.message });

        }
    }

    /**
   * Get a QR record by its QR URL (and check if expired)
   */
    static async getByQrUrl(req: Request, res: Response) {

        const getQrUrlUc = new GetQrUrlUsecase(qrRepo);

        try {
            const qrUrl = req.params.qrUrl || "";

            if (!qrUrl) {
                return res.status(400).json({ error: "qrUrl parameter is required" });
            }

            const result = await getQrUrlUc.execute(qrUrl);

            res.cookie("tokenOrganizationIndentity", result.token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 60 * 60 * 1000,
            });

            // return res.status(200).json({
            //     message: "Login successful",
            //     user: {
            //     email: parsed.email,
            //     },
            // });

            res.json({ data: result.data?.data_json});

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async generateQrImage(req: Request, res: Response) {
        const organizationId = req.params.organizationId || "";
    
        try {
          const getQrByOrgUc = new GetQrByOrgUseCase(qrRepo);
          const result = await getQrByOrgUc.execute(organizationId);
    
          if (!result.success || !result.data) {
            return res.status(404).json({ error: "QR record not found" });
          }
    
          const qrRecord = result.data;
          const qrUrl = qrRecord.qr_url;
    
          // Generate QR code as PNG buffer
          const qrImageBuffer = await QRCode.toBuffer(qrUrl, {
            type: "png",
            width: 300,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
    
          // Set response headers
          res.setHeader("Content-Type", "image/png");
          res.setHeader("Content-Disposition", `inline; filename="${organizationId}.png"`);
    
          // Send image
          return res.send(qrImageBuffer);
        } catch (err: any) {
          console.error("Error generating QR:", err);
          res.status(500).json({ error: err.message || "Failed to generate QR code" });
        }
      }
}