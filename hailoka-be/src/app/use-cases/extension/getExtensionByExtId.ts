import { ExtensionRepository } from "../../../infrastructure/repositories/extension.repository";



export class GetExtensionByExtId {
    constructor(private extRepo: ExtensionRepository) {}
    
      async execute(extId: string) {
        const data = await this.extRepo.getExtensionsByExtId(extId);
        return { data };
      }
}