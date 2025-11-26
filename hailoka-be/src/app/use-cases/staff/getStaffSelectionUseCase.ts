import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";

export class GetStaffSelectionUseCase {
  constructor(private orgRepo: OrganizationRepository) {}

  async execute(organizationId: string) {
    const staffs = await this.orgRepo.getStaffsByOrganizationStaffOnly(organizationId);
    return { staffs };
  }
}