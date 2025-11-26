import { Transaction } from "sequelize";
import { ExtensionAssignedStaff } from "../database/models/extensionAssignedStaff.model";

export class ExtensionStaffRepository {

    async replaceAssignedStaff(

        extension_id: string,
        staff: Array<{ user_id: string; assigned_by: string }>,
        options?: { transaction?: Transaction }

    ): Promise<string[]> {
        
        // Delete existing assignments for the extension
        await ExtensionAssignedStaff.destroy({
        where: { extension_id },
        ...(options?.transaction ? { transaction: options.transaction } : {}),
        });

        if (!staff || staff.length === 0) return [];

        const payload = staff.map((s) => ({
            extension_id,
            user_id: s.user_id,
            assigned_by: s.assigned_by,
        }));

        const created = await ExtensionAssignedStaff.bulkCreate(payload, {
        returning: true,
        ...(options?.transaction ? { transaction: options.transaction } : {}),
        });

        return created.map((c) => c.user_id);
    }

    async deleteByExtension(id: string) {
          return ExtensionAssignedStaff.destroy({
            where:{ extension_id: id }
          });
    }

}