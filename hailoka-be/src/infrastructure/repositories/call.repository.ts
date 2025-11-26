import { Call } from "../database/models";
import { nanoid } from "nanoid";

export type CreateCallDTO = {
    organization_id: string;
    join_code: string;
    direction?: "inbound" | "outbound" | "internal";
};

export class CallRepository {
    /**
     * Create a new Call record.
     * @param data - Object containing organization_id, join_code, and direction (optional).
     * @returns The newly created Call instance.
     */
    async create(data: CreateCallDTO) {
        const MAX_RETRIES = 3;

        for (let i = 0; i < MAX_RETRIES; i++) {
            const join_code = this.generatePrettyJoinCode();

            try {
                // return newCall;
                // return await Call.create({ ...data, join_code });

                return await Call.create({
                    organization_id: data.organization_id,
                    direction: data.direction ?? "inbound", // ✅ fallback
                    join_code,
                });
            } catch (error) {
                console.error(
                    "[CallRepository.create] Error creating call:",
                    error
                );
                throw new Error("Failed to create call");
            }
        }
    }

    generatePrettyJoinCode() {
        const raw = nanoid(10).toLowerCase();
        return raw.match(/.{1,3}/g)?.join("-") || raw;
    }

    async findById(id: string) {
        const call = await Call.findByPk(id);
        if (!call) {
            return null;
        }
        return {
            id: call.id,
            organizationId: call.organization_id,
            joinCode: call.join_code,
            direction: call.direction,
            createdAt: call.created_at,
        };
    }
}
