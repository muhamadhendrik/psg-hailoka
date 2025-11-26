import { ExtensionRepository } from "../../../infrastructure/repositories/extension.repository"
import { ExtensionOperationalRepository } from "../../../infrastructure/repositories/extension-operational.repository"
import { ExtensionStaffRepository } from "../../../infrastructure/repositories/extension-staff.repository"

export class DeleteExtensionUsecase {

    constructor(
            private extRepo: ExtensionRepository,
            private extOperationalRepo: ExtensionOperationalRepository,
            private extStaffRepo: ExtensionStaffRepository
        ){}

    async execute(extId: string): Promise<any> {

        //  // prepare payload for extension creation
        // const createDto = {
        //     organization_id: dto.organization_id,
        //     name: dto.name,
        //     icon: dto.icon,
        //     // default status if not provided
        //     status_id: dto.status_id ?? 1,
        //     // added_by: userIdOwner,
        //     updated_by: userIdOwner,
        // };

        try {
            
            // 1) create extension and get id
            await this.extRepo.deleteById(extId);

            await this.extOperationalRepo.deleteByExtension(extId);

            await this.extStaffRepo.deleteByExtension(extId);

            return { success: true };

        } catch (err: any) {
            return { success: false, error: err?.message ?? String(err) };
        }
        
    }

}