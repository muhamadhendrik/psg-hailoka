import { ExtensionRuleRepository } from "../../../infrastructure/repositories/extension-rule.repository";

export class GetAllExtensionRuleUseCase {
    constructor(private extRuleRepo: ExtensionRuleRepository) {}

    async execute(orgId: string) {
        try {
            const extensionRules = await this.extRuleRepo.getAllExtensionRule(orgId);
            return { success: true, data: extensionRules };
        } catch (err: any) {
            return { success: false, error: err?.message ?? String(err) };
        }
    }
}