import { CallFeedbackRepository } from "../../../infrastructure/repositories/callFeedback.repository";
import { CallRepository } from "../../../infrastructure/repositories/call.repository";
import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";

export class GetCallFeedbacksUseCase {
    constructor(
        private feedbackRepo: CallFeedbackRepository,
        private callRepo: CallRepository,
        private orgRepo: OrganizationRepository
    ) {}

    async execute(
        organizationId: string,
        userId: string,
        callId?: string,
        page: number = 1,
        limit: number = 50
    ) {
        // Check if organization exists
        const org = await this.orgRepo.findById(organizationId);
        if (!org) {
            throw new Error("Organization not found");
        }

        // Check if user has access to this organization
        const orgUser = await this.orgRepo.getOrganizationUserByUserId(
            organizationId,
            userId
        );

        if (!orgUser) {
            throw new Error("User does not have access to this organization");
        }

        // Calculate offset
        const offset = (page - 1) * limit;

        // Get feedbacks
        let feedbacks;
        if (callId) {
            // Verify call belongs to organization
            const call = await this.callRepo.findById(callId);
            if (!call) {
                throw new Error("Call not found");
            }

            if (call.organizationId !== organizationId) {
                throw new Error("Call does not belong to this organization");
            }

            feedbacks = await this.feedbackRepo.findByCallId(callId);
        } else {
            feedbacks = await this.feedbackRepo.findByOrganizationId(
                organizationId,
                limit,
                offset
            );
        }

        return feedbacks.map((feedback) => ({
            id: feedback.id,
            call_id: feedback.callId,
            kind: feedback.kind,
            ref_id: feedback.refId,
            score: feedback.score,
            feedback: feedback.feedback,
            created_at: feedback.createdAt,
            updated_at: feedback.updatedAt,
        }));
    }
}

