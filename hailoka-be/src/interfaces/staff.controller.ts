import { Request, Response } from "express";
import { OrganizationRepository } from "../infrastructure/repositories/organization.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { CreateStaffUsecase } from "../app/use-cases/staff/createStaffUsecase";
import { CreateStaffSchema } from "../app/dto/staff/createStaffRequest.dto";
import { EditStaffUsecase } from "../app/use-cases/staff/editStaffUsecase";
import { EditStaffSchema } from "../app/dto/staff/editStaffRequest.dto";
import { GetStaffByOrganizationUsecase } from "../app/use-cases/staff/getStaffByOrganization";
import { DeleteStaffUsecase } from "../app/use-cases/staff/deleteStaffUsecase";
import { GetStaffByUserIdUsecase } from "../app/use-cases/staff/getStaffByUserId";
import { GetStaffSelectionUseCase } from "../app/use-cases/staff/getStaffSelectionUseCase";
import { CallStaffAvailibilityRepository } from "../infrastructure/repositories/callStaffAvailibility.repository";

const orgRepo = new OrganizationRepository();
const userRepo = new UserRepository();
const callStaffAvail = new CallStaffAvailibilityRepository

export class StaffController {

    static async create(req: Request, res: Response) {

        const staffUseCase = new CreateStaffUsecase(userRepo, orgRepo, callStaffAvail);

        try {
            const dto           = CreateStaffSchema.parse(req.body);
            const userIdOwner   = res.locals.user_id;
            const result        = await staffUseCase.execute(dto, userIdOwner);
            res.status(201).json(result);

        } catch (err: any) {

            // console.log("StaffController.create >>> ", err);
            res.status(400).json({ error: err.message });
        }
    }

    
    static async edit(req: Request, res: Response) {

        const staffUseCase = new EditStaffUsecase(userRepo, orgRepo);

        try {

            const dto           = EditStaffSchema.parse(req.body);
            const userIdOwner   = res.locals.user_id;
            const result        = await staffUseCase.execute(dto, userIdOwner);
            res.status(200).json(result);

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getStaffsByOrganization(req: Request, res: Response) {
        const orgRepo = new OrganizationRepository();
        const usecase = new GetStaffByOrganizationUsecase(orgRepo);

        try {

            const organizationId    = req.params.organizationId || "";
            const result            = await usecase.execute(organizationId);
            res.json(result);

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
    
    static async getStaffsSelection(req: Request, res: Response) {
        const orgRepo = new OrganizationRepository();
        const usecase = new GetStaffSelectionUseCase(orgRepo);

        try {

            const organizationId    = req.params.organizationId || "";
            const result            = await usecase.execute(organizationId);
            res.json(result);

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async getStaffsByOrganizationByUserId(req: Request, res: Response) {

        const orgRepo = new OrganizationRepository();
        const usecase = new GetStaffByUserIdUsecase(orgRepo);

        try {

            const organizationId = req.params.organizationId || "";
            const userId         = req.params.userId || "";
            const result         = await usecase.execute(organizationId, userId);

            res.json(result);
    
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async delete(req: Request, res: Response) {
        const orgRepo = new OrganizationRepository();
        const usecase = new DeleteStaffUsecase(orgRepo);

        try {

            const userId    = req.params.userId || "";
            const removedBy = res.locals.user_id;
            await usecase.execute(userId, removedBy);
            res.status(200).json({ success: true });

        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}