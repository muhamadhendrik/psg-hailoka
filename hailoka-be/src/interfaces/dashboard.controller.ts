import { Request, Response } from "express";
import { CallRepository } from "../infrastructure/repositories/call.repository";
import { CallParticipantRepository } from "../infrastructure/repositories/callParticipant.repository";
import { CallEventRepository } from "../infrastructure/repositories/callEvent.repository";
import { OrganizationRepository } from "../infrastructure/repositories/organization.repository";
import { GetIncomingCallsUseCase } from "../app/use-cases/dashboard/GetIncomingCallsUseCase";

const callRepo = new CallRepository();
const callParticipantRepo = new CallParticipantRepository();
const callEventRepo = new CallEventRepository();
const orgRepo = new OrganizationRepository();

export class DashboardController {
    static async getIncomingCalls(req: Request, res: Response) {
        try {
            const { organizationId } = req.params;
            const userId = res.locals.user_id;

            if (!organizationId) {
                return res.status(400).json({ error: "Organization ID is required" });
            }

            const useCase = new GetIncomingCallsUseCase(
                callRepo,
                callParticipantRepo,
                callEventRepo,
                orgRepo
            );
            const result = await useCase.execute(organizationId, userId);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }
}

