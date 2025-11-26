import { ExtensionRuleRepository } from "../../../infrastructure/repositories/extension-rule.repository";

export class DeleteExtensionRuleUseCase {
    
    constructor(private extRuleRepo: ExtensionRuleRepository) {}

    async execute(id: string, deletedBy: string) {
        try {
            await this.extRuleRepo.delete(id, deletedBy);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err?.message ?? String(err) };
        }
    }
}