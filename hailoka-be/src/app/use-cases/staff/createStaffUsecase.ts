// import { EmailService } from "../../../domain/email";
import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { ExtensionAssignedStaff } from "../../../infrastructure/database/models/extensionAssignedStaff.model";
import { CreateStaffRequestDTO } from "../../dto/staff/createStaffRequest.dto";
import { CallStaffAvailibilityRepository } from "../../../infrastructure/repositories/callStaffAvailibility.repository";

export class CreateStaffUsecase {

    constructor(
        private userRepo: UserRepository,
        private orgRepo: OrganizationRepository,
        private callStaffAvailRepo: CallStaffAvailibilityRepository
    ){}

    async execute( dto: CreateStaffRequestDTO, userIdOwner: string ): Promise<any> {

        // 1. Create user
        const user = await this.userRepo.create({
            name: dto.name,
            email: dto.email,
            isVerifiedEmail: false,
            userType: "user",
        });

        // 2. Add to organization_users
        await this.orgRepo.createOrganizationUser({
            userId: user.id,
            organizationId: dto.organizationId,
            userEmail: dto.email,
            roleId: dto.roleId,
            status: "active",
            addedBy: userIdOwner,
            updatedBy: userIdOwner,
        });

        // 3. Bulk assign extensions
        if (dto.extensions && dto.extensions.length > 0) {
            const bulkData = dto.extensions.map((extId) => ({
                extension_id: extId,
                user_id: user.id,
                assigned_by: userIdOwner,
                assigned_at: new Date(),
            }));
            await ExtensionAssignedStaff.bulkCreate(bulkData);

            const bulkStaffAvailibility =  dto.extensions.map((extId) => ({
                extension_id: extId,
                user_id: user.id,
                isAvailable: true,
            }));

            await this.callStaffAvailRepo.bulkCreate(bulkStaffAvailibility)
        }

        return { success: true, userId: user.id };
    }


}