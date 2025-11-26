import { ExtensionRepository } from "../../../infrastructure/repositories/extension.repository"; 

export class GetSelectExtensionByOrg {
  constructor(private extRepo: ExtensionRepository) {}

  async execute(organizationId: string) {
    const data = await this.extRepo.getSelectExtensionsByOrgId(organizationId);
    return { data };
  }
}