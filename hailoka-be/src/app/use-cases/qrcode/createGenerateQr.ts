import { OrgCodeQrRepository } from "../../../infrastructure/repositories/org-code-qr.repository";

export class CreateGenerateQrUseCase {

    constructor(
        private qrRepo: OrgCodeQrRepository,
    ){}

    async execute(data: any) {

        try {

            // console.log("repo debug ", data);
            
            await this.qrRepo.insert(data)
            
            return { success: true, data };
            
        } catch (err: any) {

            // console.log("err repo >>> ", err);
            
            return { success: false, error: err?.message ?? String(err) };
        }
        
    }
}