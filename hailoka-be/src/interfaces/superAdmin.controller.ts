import { Request, Response } from "express";
import { OrganizationRepository } from "../infrastructure/repositories/organization.repository";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { NodemailerService } from "../infrastructure/mailer/nodemailer.service";
import { GetSuperAdminDashboardUseCase } from "../app/use-cases/super-admin/GetSuperAdminDashboardUseCase";
import { GetAllUsersUseCase } from "../app/use-cases/super-admin/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../app/use-cases/super-admin/GetUserByIdUseCase";
import { SuspendUserUseCase } from "../app/use-cases/super-admin/SuspendUserUseCase";
import { ActivateUserUseCase } from "../app/use-cases/super-admin/ActivateUserUseCase";
import { ApproveOrganizationUseCase } from "../app/use-cases/super-admin/ApproveOrganizationUseCase";
import { RejectOrganizationUseCase } from "../app/use-cases/super-admin/RejectOrganizationUseCase";
import { SuspendOrganizationUseCase } from "../app/use-cases/super-admin/SuspendOrganizationUseCase";
import { ActivateOrganizationUseCase } from "../app/use-cases/super-admin/ActivateOrganizationUseCase";
import { OrganizationStatusUpdateSchema } from "../app/dto/super-admin/organization-status-update.dto";

const orgRepo = new OrganizationRepository();
const userRepo = new UserRepository();
const emailService = new NodemailerService();

export class SuperAdminController {
    // Dashboard
    static async getDashboard(req: Request, res: Response) {
        try {
            const useCase = new GetSuperAdminDashboardUseCase(orgRepo, userRepo);
            const result = await useCase.execute();
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    // Users
    static async getAllUsers(req: Request, res: Response) {
        try {
            const useCase = new GetAllUsersUseCase(userRepo);
            const result = await useCase.execute();
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const useCase = new GetUserByIdUseCase(userRepo, orgRepo);
            const result = await useCase.execute(id);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async suspendUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const suspendedBy = res.locals.user_id;
            const useCase = new SuspendUserUseCase(userRepo, orgRepo);
            const result = await useCase.execute(id, suspendedBy);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async activateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "User ID is required" });
            }
            const activatedBy = res.locals.user_id;
            const useCase = new ActivateUserUseCase(userRepo, orgRepo);
            const result = await useCase.execute(id, activatedBy);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    // Organizations
    static async approveOrganization(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Organization ID is required" });
            }
            const approvedBy = res.locals.user_id;
            const dto = OrganizationStatusUpdateSchema.parse(req.body);
            const useCase = new ApproveOrganizationUseCase(
                orgRepo,
                userRepo,
                emailService
            );
            const result = await useCase.execute(id, approvedBy, dto);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async rejectOrganization(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Organization ID is required" });
            }
            const rejectedBy = res.locals.user_id;
            const dto = OrganizationStatusUpdateSchema.parse(req.body);
            const useCase = new RejectOrganizationUseCase(
                orgRepo,
                userRepo,
                emailService
            );
            const result = await useCase.execute(id, rejectedBy, dto);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async suspendOrganization(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Organization ID is required" });
            }
            const suspendedBy = res.locals.user_id;
            const dto = OrganizationStatusUpdateSchema.parse(req.body);
            const useCase = new SuspendOrganizationUseCase(orgRepo);
            const result = await useCase.execute(id, suspendedBy, dto);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }

    static async activateOrganization(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "Organization ID is required" });
            }
            const activatedBy = res.locals.user_id;
            const dto = OrganizationStatusUpdateSchema.parse(req.body);
            const useCase = new ActivateOrganizationUseCase(orgRepo);
            const result = await useCase.execute(id, activatedBy, dto);
            return res.json(result);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }
}

