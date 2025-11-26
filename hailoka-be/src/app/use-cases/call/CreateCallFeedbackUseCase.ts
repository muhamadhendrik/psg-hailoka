import { CallFeedbackRepository } from "../../../infrastructure/repositories/callFeedback.repository";
import { CallRepository } from "../../../infrastructure/repositories/call.repository";
import { CallFeedbackCreateDTO } from "../../dto/call/call-feedback.dto";

export class CreateCallFeedbackUseCase {
    constructor(
        private feedbackRepo: CallFeedbackRepository,
        private callRepo: CallRepository
    ) {}

    async execute(data: CallFeedbackCreateDTO, userId?: string) {
        // Verify call exists
        const call = await this.callRepo.findById(data.call_id);
        if (!call) {
            throw new Error("Call not found");
        }

        // Create feedback
        const feedback = await this.feedbackRepo.create({
            callId: data.call_id,
            kind: data.kind,
            refId: data.ref_id,
            score: data.score,
            feedback: data.feedback || null,
        });

        return {
            id: feedback.id,
            call_id: feedback.callId,
            kind: feedback.kind,
            ref_id: feedback.refId,
            score: feedback.score,
            feedback: feedback.feedback,
            created_at: feedback.createdAt,
            updated_at: feedback.updatedAt,
        };
    }
}

