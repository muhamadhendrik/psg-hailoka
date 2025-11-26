import { CallRepository } from "../../../infrastructure/repositories/call.repository";
import { CallParticipantRepository } from "../../../infrastructure/repositories/callParticipant.repository";
import { CallEventRepository } from "../../../infrastructure/repositories/callEvent.repository";
import { Call } from "../../../infrastructure/database/models/call.model";
import { CallParticipant } from "../../../infrastructure/database/models/callParticipant.model";
import { CallEvent } from "../../../infrastructure/database/models/callEvent.model";
import { Extension } from "../../../infrastructure/database/models/extension.model";
import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";

export class GetIncomingCallsUseCase {
    constructor(
        private callRepo: CallRepository,
        private callParticipantRepo: CallParticipantRepository,
        private callEventRepo: CallEventRepository,
        private orgRepo: OrganizationRepository
    ) {}

    async execute(organizationId: string, userId: string) {
        // Get user's assigned extensions
        const userOrgs = await this.orgRepo.getOrganizationUserByUserId(
            organizationId,
            userId
        );

        if (!userOrgs) {
            throw new Error("User not found in organization");
        }

        // Get all calls for this organization that are inbound
        const calls = await Call.findAll({
            where: {
                organization_id: organizationId,
                direction: "inbound",
            },
            include: [
                {
                    model: CallParticipant,
                    as: "participants",
                    include: [
                        {
                            model: Extension,
                            as: "extension",
                            attributes: ["id", "name"],
                            required: false,
                        },
                    ],
                },
                {
                    model: CallEvent,
                    as: "events",
                    attributes: ["id", "event_type", "created_at"],
                    separate: true,
                    order: [["created_at", "ASC"]],
                },
            ],
            order: [["created_at", "DESC"]],
            limit: 50, // Get last 50 calls
        });

        // Filter calls where user has access to the extension
        // For now, return all calls - filtering by extension access can be added later
        return calls.map((call) => ({
            id: call.id,
            organization_id: call.organization_id,
            join_code: call.join_code,
            direction: call.direction,
            created_at: call.created_at,
            participants: call.participants?.map((p: any) => ({
                id: p.id,
                role: p.role,
                kind: p.kind,
                ref_id: p.ref_id,
                extension: p.extension
                    ? {
                          id: p.extension.id,
                          name: p.extension.name,
                      }
                    : null,
            })),
            events: call.events?.map((e) => ({
                id: e.id,
                event_type: e.event_type,
                created_at: e.created_at,
            })),
        }));
    }
}

