import { ExtensionRepository } from "../../../infrastructure/repositories/extension.repository"; 

export class GetExtensionByOrganization {
  constructor(private extRepo: ExtensionRepository) {}

  async execute(organizationId: string) {
    const data = await this.extRepo.getExtensionsByOrgId(organizationId);
    return { data };
  }
}