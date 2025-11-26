import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { OrganizationUpdateDTO } from "../../dto/organization/organization-update.dto";
import { GeneralExtensionSettings } from "../../../infrastructure/database/models/generalExtensionSettings.model";
import sequelize from "../../../infrastructure/database/sequelize";
import { Organization } from "../../../infrastructure/database/models/organization.model";

export class UpdateOrganizationSettingsUseCase {
    constructor(private orgRepo: OrganizationRepository) {}

    async execute(
        organizationId: string,
        userId: string,
        dto: OrganizationUpdateDTO & {
            ring_timeout_seconds?: number;
            max_concurrent_calls?: number;
            is_record_a_call?: boolean;
        }
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
            throw new Error("Only owner can update organization settings");
        }

        const tx = await sequelize.transaction();

        try {
            // Update organization fields
            const orgUpdates: any = {
                updated_by: userId,
            };

            if (dto.name !== undefined) orgUpdates.name = dto.name;
            if (dto.total_member !== undefined)
                orgUpdates.total_member = dto.total_member;
            if (dto.description !== undefined)
                orgUpdates.description = dto.description;
            if (dto.address !== undefined) orgUpdates.address = dto.address;
            if (dto.latitude !== undefined) orgUpdates.latitude = dto.latitude;
            if (dto.longitude !== undefined)
                orgUpdates.longitude = dto.longitude;
            if (dto.primary_contact_full_name !== undefined)
                orgUpdates.primary_contact_full_name = dto.primary_contact_full_name;
            if (dto.primary_contact_phone_number !== undefined)
                orgUpdates.primary_contact_phone_number =
                    dto.primary_contact_phone_number;
            if (dto.primary_did_number !== undefined)
                orgUpdates.primary_did_number = dto.primary_did_number;

            if (Object.keys(orgUpdates).length > 1) {
                // More than just updated_by
                // Update organization directly
                await Organization.update(
                    {
                        ...(dto.name !== undefined && { name: dto.name }),
                        ...(dto.total_member !== undefined && { total_member: dto.total_member }),
                        ...(dto.description !== undefined && { description: dto.description }),
                        ...(dto.address !== undefined && { address: dto.address }),
                        ...(dto.latitude !== undefined && { latitude: dto.latitude }),
                        ...(dto.longitude !== undefined && { longitude: dto.longitude }),
                        ...(dto.primary_contact_full_name !== undefined && { primary_contact_full_name: dto.primary_contact_full_name }),
                        ...(dto.primary_contact_phone_number !== undefined && { primary_contact_phone_number: dto.primary_contact_phone_number }),
                        updated_by: userId,
                        updated_at: new Date(),
                    },
                    { where: { id: organizationId }, transaction: tx }
                );
            }

            // Note: primary_did_number field may need to be added via migration
            // For now, it's not included in the update

            // Update extension settings if provided
            if (
                dto.ring_timeout_seconds !== undefined ||
                dto.max_concurrent_calls !== undefined ||
                dto.is_record_a_call !== undefined
            ) {
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

                if (settings) {
                    await settings.update(
                        {
                            ...(dto.ring_timeout_seconds !== undefined && {
                                ring_timeout_seconds: dto.ring_timeout_seconds,
                            }),
                            ...(dto.max_concurrent_calls !== undefined && {
                                max_concurrent_calls: dto.max_concurrent_calls,
                            }),
                            ...(dto.is_record_a_call !== undefined && {
                                is_record_a_call: dto.is_record_a_call ? 1 : 0,
                            }),
                            last_update_by: userId,
                            updated_at: new Date(),
                        },
                        { transaction: tx }
                    );
                }
            }

            await tx.commit();
        } catch (err) {
            await tx.rollback();
            throw err;
        }

        return { success: true, message: "Organization settings updated successfully" };
    }
}

