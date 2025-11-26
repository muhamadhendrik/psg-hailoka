import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";

export class DeleteStaffUsecase {
  constructor(private orgRepo: OrganizationRepository) {}

  async execute(userId: string, removedBy: string) {
    await this.orgRepo.updateOrganizationUserRemoved(userId, removedBy);
    return { success: true };
  }
}