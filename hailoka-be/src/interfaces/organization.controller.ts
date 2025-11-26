import { Request, Response } from "express";
import { OrganizationRepository } from "../infrastructure/repositories/organization.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { OrganizationChangeLogRepository } from "../infrastructure/repositories/organizationChangeLog.repository";
import { OrganizationUserLogRepository } from "../infrastructure/repositories/organizationUserLog.repository";
import { OrganizationCreateSchema } from "../app/dto/organization/organization-create.dto";
import { OrganizationUpdateSchema } from "../app/dto/organization/organization-update.dto";
import { OrganizationStatusUpdateSchema } from "../app/dto/organization/organization-status-update.dto";
import { CreateOrganizationUseCase } from "../app/use-cases/organization/CreateOrganizationUseCase";
import { GetOrganizationSettingsUseCase } from "../app/use-cases/organization/GetOrganizationSettingsUseCase";
import { GetOrganizationByIdUseCase } from "../app/use-cases/organization/GetOrganizationByIdUseCase";
import { UpdateOrganizationSettingsUseCase } from "../app/use-cases/organization/UpdateOrganizationSettingsUseCase";
import { UpdateOrganizationStatusUseCase } from "../app/use-cases/organization/UpdateOrganizationStatusUseCase";
import { GetOrganizationChangeLogsUseCase } from "../app/use-cases/organization/GetOrganizationChangeLogsUseCase";
import { GetOrganizationUserLogsUseCase } from "../app/use-cases/organization/GetOrganizationUserLogsUseCase";
import { NodemailerService } from "../infrastructure/mailer/nodemailer.service";
// import { GetStaffByOrganizationUsecase } from "../app/use-cases/staff/getStaffByOrganization";

const orgRepo = new OrganizationRepository();
const userRepo = new UserRepository();
const emailService = new NodemailerService();
const changeLogRepo = new OrganizationChangeLogRepository();
const userLogRepo = new OrganizationUserLogRepository();

export class OrganizationController {
    static async create(req: Request, res: Response) {
        try {
            const submittingUserId = res.locals.user_id;

            if (!submittingUserId)
                return res.status(401).json({ error: "Unauthorized" });

            const parsed = OrganizationCreateSchema.parse(req.body);
            const useCase = new CreateOrganizationUseCase(
                userRepo,
                orgRepo,
                emailService
            );
            const result = await useCase.execute(parsed, submittingUserId);

            return res.status(201).json({
                id: result.id,
                name: result.name,
                status_id: result.organizationStatusId,
            });
        } catch (err: any) {
            // console.log("err OrganizationController.create >>> ", err);
            return res.status(400).json({ error: err.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const userType = res.locals.user_type;
            const userId = res.locals.user_id;

            if (userType == "superadmin") {
                const orgs = await orgRepo.findAll();
                return res.json(orgs);
            }

            if (userType == "user") {
                const orgs = await orgRepo.findOrganizationsByUserId(userId);
                return res.json(orgs);
            }

            return res.status(403).json({ error: "Forbidden" });
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { organizationId } = req.params;
            const userId = res.locals.user_id;
            const userType = res.locals.user_type;

            if (!organizationId) {
                return res.status(400).json({ error: "Organization ID is required" });
            }

            const useCase = new GetOrganizationByIdUseCase(orgRepo);
            const result = await useCase.execute(organizationId, userId, userType);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async getSettings(req: Request, res: Response) {
        try {
            const { organizationId } = req.params;
            const userId = res.locals.user_id;

            if (!organizationId) {
                return res.status(400).json({ error: "Organization ID is required" });
            }

            const useCase = new GetOrganizationSettingsUseCase(orgRepo);
            const result = await useCase.execute(organizationId, userId);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async updateSettings(req: Request, res: Response) {
        try {
            const { organizationId } = req.params;
            const userId = res.locals.user_id;

            if (!organizationId) {
                return res.status(400).json({ error: "Organization ID is required" });
            }

            const dto = OrganizationUpdateSchema.parse(req.body);
            const useCase = new UpdateOrganizationSettingsUseCase(orgRepo);
            const result = await useCase.execute(organizationId, userId, dto);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async getChangeLogs(req: Request, res: Response) {
        try {
            const { organizationId } = req.params;
            const userId = res.locals.user_id;

            if (!organizationId) {
                return res.status(400).json({ error: "Organization ID is required" });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;

            const useCase = new GetOrganizationChangeLogsUseCase(changeLogRepo, orgRepo);
            const result = await useCase.execute(organizationId, userId, page, limit);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async getUserLogs(req: Request, res: Response) {
        try {
            const { organizationId, userId: targetUserId } = req.params;
            const userId = res.locals.user_id;

            if (!organizationId) {
                return res.status(400).json({ error: "Organization ID is required" });
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;

            const useCase = new GetOrganizationUserLogsUseCase(userLogRepo, orgRepo);
            const result = await useCase.execute(
                organizationId,
                userId,
                targetUserId,
                page,
                limit
            );
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const { organizationId } = req.params;
            const userId = res.locals.user_id;

            if (!organizationId) {
                return res.status(400).json({ error: "Organization ID is required" });
            }

            const dto = OrganizationStatusUpdateSchema.parse(req.body);
            const useCase = new UpdateOrganizationStatusUseCase(orgRepo);
            const result = await useCase.execute(organizationId, userId, dto);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }
}
