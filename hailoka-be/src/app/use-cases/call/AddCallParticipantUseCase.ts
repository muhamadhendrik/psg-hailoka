import { CallParticipantRepository } from "../../../infrastructure/repositories/callParticipant.repository";
import { CallRepository } from "../../../infrastructure/repositories/call.repository";
import { CallParticipantCreateDTO } from "../../dto/call/call-participant.dto";

export class AddCallParticipantUseCase {
    constructor(
        private participantRepo: CallParticipantRepository,
        private callRepo: CallRepository
    ) {}

    async execute(data: CallParticipantCreateDTO) {
        // Verify call exists
        const call = await this.callRepo.findById(data.call_id);
        if (!call) {
            throw new Error("Call not found");
        }

        // Create participant
        const participant = await this.participantRepo.create({
            call_id: data.call_id,
            role: data.role,
            kind: data.kind,
            ref_id: data.ref_id,
        });

        return {
            id: participant.id,
            call_id: participant.call_id,
            role: participant.role,
            kind: participant.kind,
            ref_id: participant.ref_id,
            created_at: participant.created_at,
        };
    }
}

