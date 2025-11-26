import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";

export class GetStaffByUserIdUsecase {
  constructor(private orgRepo: OrganizationRepository) {}

  async execute(organizationId: string, userId: string) {
    const staff = await this.orgRepo.getOrganizationUserByUserId(organizationId, userId);
    return { staff };
  }
}