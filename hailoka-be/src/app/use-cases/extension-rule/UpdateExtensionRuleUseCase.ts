import { CreateExtensionRuleDTO, ExtensionRuleRepository } from "../../../infrastructure/repositories/extension-rule.repository";

export class UpdateExtensionRuleUseCase {
    constructor(private extRuleRepo: ExtensionRuleRepository) {}

    async execute(id: string, data: Partial<CreateExtensionRuleDTO>) {
        try {
            const updatedRule = await this.extRuleRepo.update(id, data);
            return { success: true, data: updatedRule };
        } catch (err: any) {
            return { success: false, error: err?.message ?? String(err) };
        }
    }
}