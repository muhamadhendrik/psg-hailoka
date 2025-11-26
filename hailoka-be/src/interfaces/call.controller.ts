import { Request, Response } from "express";
import { CreateCallUsecase } from "../app/use-cases/call/createCallRequest";
import { CallRepository } from "../infrastructure/repositories/call.repository";
import { CallStaffAvailibilityRepository } from "../infrastructure/repositories/callStaffAvailibility.repository";
import { CallParticipantRepository } from "../infrastructure/repositories/callParticipant.repository";
import { CallEventRepository } from "../infrastructure/repositories/callEvent.repository";
import { CallFeedbackRepository } from "../infrastructure/repositories/callFeedback.repository";
import { OrganizationRepository } from "../infrastructure/repositories/organization.repository";
import { CallFeedbackCreateSchema } from "../app/dto/call/call-feedback.dto";
import { CallParticipantCreateSchema } from "../app/dto/call/call-participant.dto";
import { CallEventCreateSchema } from "../app/dto/call/call-event.dto";
import { CreateCallFeedbackUseCase } from "../app/use-cases/call/CreateCallFeedbackUseCase";
import { GetCallFeedbacksUseCase } from "../app/use-cases/call/GetCallFeedbacksUseCase";
import { AddCallParticipantUseCase } from "../app/use-cases/call/AddCallParticipantUseCase";
import { AddCallEventUseCase } from "../app/use-cases/call/AddCallEventUseCase";

const callRepo = new CallRepository()
const callStaff = new CallStaffAvailibilityRepository()
const callParticipantRepo = new CallParticipantRepository()
const callEventRepo = new CallEventRepository()
const feedbackRepo = new CallFeedbackRepository()
const orgRepo = new OrganizationRepository()


export class CallController {

    static async insert(req: Request, res: Response) {

        const extUsecase = new CreateCallUsecase(callRepo, callStaff, callParticipantRepo, callEventRepo)

        const dto = req.body;

        const result = await extUsecase.execute(dto);

        // console.log("result >>> ", result);


        return res.status(201).json({
            msg: "test create call"
        });
        

    }

    static async createFeedback(req: Request, res: Response) {
        try {
            const parsed = CallFeedbackCreateSchema.parse(req.body);
            const useCase = new CreateCallFeedbackUseCase(feedbackRepo, callRepo);
            const result = await useCase.execute(parsed);

            return res.status(201).json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async getFeedbacks(req: Request, res: Response) {
        try {
            const { organizationId, callId } = req.params;
            const userId = res.locals.user_id;

            if (!organizationId) {
                return res.status(400).json({ error: "Organization ID is required" });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;

            const useCase = new GetCallFeedbacksUseCase(feedbackRepo, callRepo, orgRepo);
            const result = await useCase.execute(
                organizationId,
                userId,
                callId,
                page,
                limit
            );

            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async addParticipant(req: Request, res: Response) {
        try {
            const parsed = CallParticipantCreateSchema.parse(req.body);
            const useCase = new AddCallParticipantUseCase(callParticipantRepo, callRepo);
            const result = await useCase.execute(parsed);

            return res.status(201).json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async addEvent(req: Request, res: Response) {
        try {
            const parsed = CallEventCreateSchema.parse(req.body);
            const useCase = new AddCallEventUseCase(callEventRepo, callRepo, callParticipantRepo);
            const result = await useCase.execute(parsed);

            return res.status(201).json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

}