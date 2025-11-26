import { ExtensionRepository } from "../../../infrastructure/repositories/extension.repository"
import { ExtensionOperationalRepository } from "../../../infrastructure/repositories/extension-operational.repository"
import { ExtensionStaffRepository } from "../../../infrastructure/repositories/extension-staff.repository"

export class UpdateExtensionUsecase {

    constructor(
            private extRepo: ExtensionRepository,
            private extOperationalRepo: ExtensionOperationalRepository,
            private extStaffRepo: ExtensionStaffRepository
        ){}

    async execute(dto: any, userIdOwner: string, extId: string): Promise<any> {

         // prepare payload for extension creation
        const createDto = {
            organization_id: dto.organization_id,
            name: dto.name,
            icon: dto.icon,
            // default status if not provided
            status_id: dto.status_id ?? 1,
            // added_by: userIdOwner,
            updated_by: userIdOwner,
        };

        try {
            // 1) create extension and get id
            await this.extRepo.update(extId, createDto);

            // 2) replace operational hours (if any)
            const hours = dto.extension_operation_hours ?? [];
            await this.extOperationalRepo.replaceOperationalHours(extId, hours);

            // 3) replace assigned staff (if any) - convert simple id array to expected objects
            const staffIds: string[] = dto.extension_assigned_staffs ?? [];
            const staffPayload = staffIds.map((id) => ({
                user_id: id,
                assigned_by: userIdOwner,
            }));

            await this.extStaffRepo.replaceAssignedStaff(extId, staffPayload);

            return { success: true, };
        } catch (err: any) {
            return { success: false, error: err?.message ?? String(err) };
        }
        
    }

}