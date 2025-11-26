import { CallEventRepository } from "../../../infrastructure/repositories/callEvent.repository";
import { CallRepository } from "../../../infrastructure/repositories/call.repository";
import { CallParticipantRepository } from "../../../infrastructure/repositories/callParticipant.repository";
import { CallEventCreateDTO } from "../../dto/call/call-event.dto";

export class AddCallEventUseCase {
    constructor(
        private eventRepo: CallEventRepository,
        private callRepo: CallRepository,
        private participantRepo: CallParticipantRepository
    ) {}

    async execute(data: CallEventCreateDTO) {
        // Verify call exists
        const call = await this.callRepo.findById(data.call_id);
        if (!call) {
            throw new Error("Call not found");
        }

        // If call_participant_id is provided, verify it exists and belongs to the call
        if (data.call_participant_id !== null && data.call_participant_id !== undefined) {
            const participants = await this.participantRepo.getByCallId(data.call_id);
            const participant = participants.find(p => p.id === data.call_participant_id);
            if (!participant) {
                throw new Error("Call participant not found or does not belong to this call");
            }
        }

        // Create event
        const event = await this.eventRepo.create({
            call_id: data.call_id,
            call_participant_id: data.call_participant_id || null,
            attempt_count: data.attempt_count || 0,
            event_type: data.event_type,
            queue_count: data.queue_count || 0,
        });

        return {
            id: event.id,
            call_id: event.call_id,
            call_participant_id: event.call_participant_id,
            attempt_count: event.attempt_count,
            event_type: event.event_type,
            queue_count: event.queue_count,
            created_at: event.created_at,
        };
    }
}

