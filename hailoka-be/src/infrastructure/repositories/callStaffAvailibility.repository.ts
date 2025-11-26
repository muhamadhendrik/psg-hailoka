// import { CallStaffAvailability, UserModel  } from "../database/models";
// repositories/callStaffAvailibility.repository.ts
import { CallStaffAvailability, UserModel } from "../database/models"; // ✅ this must import from `index.ts`


export type CallStaffAvailibilityDTO = {
    user_id: string;
    extension_id: string;
    isAvailable: boolean
};

export class CallStaffAvailibilityRepository {

    async create(data: CallStaffAvailibilityDTO) {
        const [record] = await CallStaffAvailability.upsert(data);
        return record;
    }

    async bulkCreate(data: CallStaffAvailibilityDTO[]) {
        if (!data || data.length === 0) return [];

        const records = await CallStaffAvailability.bulkCreate(data, {
        ignoreDuplicates: true, // avoids duplicate PK errors
        returning: true, // ensures we get the created records
        });

        return records;
    }

    async update(user_id: string, isAvailable: boolean) {
        const [affectedCount] = await CallStaffAvailability.update(
            { isAvailable },
            {
                where: { user_id },
            }
        );

        return affectedCount > 0;
    }

    async getAvailablestaff (extension_id: string) {

        const availableStaff = await CallStaffAvailability.findAll({
            where: { extension_id, isAvailable: true },
            include: [
                {
                model: UserModel,
                as: "user",
                attributes: ["id", "name", "email", "picture_path"],
                },
            ],
        });

        if (availableStaff.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * availableStaff.length);
        return availableStaff[randomIndex];
    }
}