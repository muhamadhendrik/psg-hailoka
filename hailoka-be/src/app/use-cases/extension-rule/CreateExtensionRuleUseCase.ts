import { ExtensionRuleRepository } from "../../../infrastructure/repositories/extension-rule.repository";

export class CreateExtensionRuleUseCase {

    constructor(
        private extRuleRepo: ExtensionRuleRepository,
    ){}

    async execute(data: any, ownerId: string) {

        const createExtRuleData = {
            ...data,
            created_by: ownerId,
            updated_by: null
        }

        try {
            await this.extRuleRepo.create(createExtRuleData)
            
            return { success: true, data };
            
        } catch (err: any) {
            return { success: false, error: err?.message ?? String(err) };
        }
        
    }
}