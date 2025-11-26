import { ExtensionAssignedStaff } from "../../../infrastructure/database/models/extensionAssignedStaff.model";
import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { EditStaffRequestDTO } from "../../dto/staff/editStaffRequest.dto";


export class EditStaffUsecase {

  constructor(
    private userRepo: UserRepository,
    private orgRepo: OrganizationRepository
  ) {}

  async execute(dto: EditStaffRequestDTO, userIdOwner: string): Promise<any> {

    // 1. Update user fields if provided
    if (dto.name || dto.email) {
      await this.userRepo.update(dto.userId, {
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email }),
      });
    }

    // 2. Update organization_users role if provided
    if (dto.roleId) {
      await this.orgRepo.updateOrganizationUserRole({
        userId: dto.userId,
        roleId: dto.roleId,
        updatedBy: userIdOwner,
      });
    }

    if (dto.extensions !== undefined) {
      // Always delete all assigned extensions for this user
      await ExtensionAssignedStaff.destroy({
        where: { user_id: dto.userId },
      });

      // If extensions array is non-empty, bulk create new assignments
      if (dto.extensions && dto.extensions.length > 0) {
        const bulkData = dto.extensions.map((extId) => ({
          extension_id: extId,
          user_id: dto.userId,
          assigned_by: userIdOwner,
          assigned_at: new Date(),
        }));
        await ExtensionAssignedStaff.bulkCreate(bulkData);
      }
    }

    return { success: true, userId: dto.userId };
    
  }
}