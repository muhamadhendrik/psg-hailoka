import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";

export class GetStaffByOrganizationUsecase {
  constructor(private orgRepo: OrganizationRepository) {}

  async execute(organizationId: string) {
    const staffs = await this.orgRepo.getStaffsByOrganization(organizationId);
    return { staffs };
  }
}