import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { ExtensionConfigurationUpdateDTO } from "../../dto/extension/extension-configuration-update.dto";
import { GeneralExtensionSettings } from "../../../infrastructure/database/models/generalExtensionSettings.model";
import sequelize from "../../../infrastructure/database/sequelize";

export class UpdateExtensionConfigurationUseCase {
    constructor(private orgRepo: OrganizationRepository) {}

    async execute(
        organizationId: string,
        userId: string,
        dto: ExtensionConfigurationUpdateDTO
    ) {
        const org = await this.orgRepo.findById(organizationId);

        if (!org) {
            throw new Error("Organization not found");
        }

        // Check if user is owner
        const orgUser = await this.orgRepo.getOrganizationUserByUserId(
            organizationId,
            userId
        );

        if (!orgUser || orgUser.roleId !== 1) {
            // 1 = OWNER role
            throw new Error("Only owner can update extension configuration");
        }

        const tx = await sequelize.transaction();

        try {
            // Find or create extension settings
            const [settings] = await GeneralExtensionSettings.findOrCreate({
                where: { organization_id: organizationId },
                defaults: {
                    organization_id: organizationId,
                    ring_timeout_seconds: dto.ring_timeout_seconds ?? 60,
                    max_concurrent_calls: dto.max_concurrent_calls ?? 1,
                    is_record_a_call: dto.is_record_a_call ? 1 : 0,
                    last_update_by: userId,
                },
                transaction: tx,
            });

            // Update settings if they exist
            const updateData: any = {
                last_update_by: userId,
                updated_at: new Date(),
            };

            if (dto.ring_timeout_seconds !== undefined) {
                updateData.ring_timeout_seconds = dto.ring_timeout_seconds;
            }

            if (dto.max_concurrent_calls !== undefined) {
                updateData.max_concurrent_calls = dto.max_concurrent_calls;
            }

            if (dto.is_record_a_call !== undefined) {
                updateData.is_record_a_call = dto.is_record_a_call ? 1 : 0;
            }

            await settings.update(updateData, { transaction: tx });

            await tx.commit();

            return {
                ring_timeout_seconds: settings.ring_timeout_seconds,
                max_concurrent_calls: settings.max_concurrent_calls,
                is_record_a_call: settings.is_record_a_call === 1,
            };
        } catch (err) {
            await tx.rollback();
            throw err;
        }
    }
}

