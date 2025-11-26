import { ExtensionRuleRepository } from "../../../infrastructure/repositories/extension-rule.repository";

export class GetExtensionRuleByIdUseCase {
    constructor(private extRuleRepo: ExtensionRuleRepository) {}

    async execute(id: string) {
        try {
            const extensionRule = await this.extRuleRepo.getExtensionRuleById(id);
            if (!extensionRule) {
                return { success: false, error: "Extension rule not found" };
            }
            return { success: true, data: extensionRule };
        } catch (err: any) {
            return { success: false, error: err?.message ?? String(err) };
        }
    }
}