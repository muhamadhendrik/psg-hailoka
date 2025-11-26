import { InsertExtensionUsecase } from "../app/use-cases/extension/insertExtensionUsecase";
import { ExtensionRepository } from "../infrastructure/repositories/extension.repository";
import { ExtensionOperationalRepository } from "../infrastructure/repositories/extension-operational.repository";
import { ExtensionStaffRepository } from "../infrastructure/repositories/extension-staff.repository";
import { Request, Response } from "express";
import { UpdateExtensionUsecase } from "../app/use-cases/extension/updateExtensionUsecase";
import { DeleteExtensionUsecase } from "../app/use-cases/extension/deleteExtensionUsecase";
import { GetExtensionByOrganization } from "../app/use-cases/extension/getExtensionByOrganization";
import { GetExtensionByExtId } from "../app/use-cases/extension/getExtensionByExtId";
import { GetSelectExtensionByOrg } from "../app/use-cases/extension/getSelectExtensionByOrg";
import { GetExtensionConfigurationUseCase } from "../app/use-cases/extension/GetExtensionConfigurationUseCase";
import { UpdateExtensionConfigurationUseCase } from "../app/use-cases/extension/UpdateExtensionConfigurationUseCase";
import { ExtensionConfigurationUpdateSchema } from "../app/dto/extension/extension-configuration-update.dto";
import { OrganizationRepository } from "../infrastructure/repositories/organization.repository";

const extRepo = new ExtensionRepository()
const extOperationalRepo = new ExtensionOperationalRepository()
const extStaffRepo = new ExtensionStaffRepository()
const orgRepo = new OrganizationRepository()

export class ExtensionController {

    static async insert(req: Request, res: Response) {

      const extUsecase = new InsertExtensionUsecase(
          extRepo,
          extOperationalRepo,
          extStaffRepo
      )

      // get owner id from auth middleware (stored on res.locals by authMiddleware)
      const userIdOwner = res.locals.user_id as string | undefined;

      console.log("userIdOwner >>> ", userIdOwner);
      

      if (!userIdOwner) {
        return res.status(401).json({ error: "Missing authentication" });
      }

      const dto = req.body;

      try {
        const result = await extUsecase.execute(dto, userIdOwner);
        if (result?.success) {
          return res.status(201).json(result);
        } else {
          return res.status(400).json(result);
        }
      } catch (err: any) {
        return res.status(500).json({ success: false, error: err?.message ?? String(err) });
      }    
  }

  static async update(req: Request, res: Response) {

      const extUsecase = new UpdateExtensionUsecase(
          extRepo,
          extOperationalRepo,
          extStaffRepo
      )

      // get owner id from auth middleware (stored on res.locals by authMiddleware)
      const userIdOwner = res.locals.user_id as string | undefined;      

      if (!userIdOwner) {
        return res.status(401).json({ error: "Missing authentication" });
      }

      const dto = req.body;

      const extId    = req.params.extId || "";

      try {
        const result = await extUsecase.execute(dto, userIdOwner, extId);

        if (result?.success) {

          return res.status(201).json(result);

        } else {

          return res.status(400).json(result);

        }
      } catch (err: any) {

        return res.status(500).json({ success: false, error: err?.message ?? String(err) });

      }    
  }

  static async delete(req: Request, res: Response) {

      const extUsecase = new DeleteExtensionUsecase(
          extRepo,
          extOperationalRepo,
          extStaffRepo
      )

      // get owner id from auth middleware (stored on res.locals by authMiddleware)
      const userIdOwner = res.locals.user_id as string | undefined;      

      if (!userIdOwner) {
        return res.status(401).json({ error: "Missing authentication" });
      }

      // const dto = req.body;

      const extId    = req.params.extId || "";

      try {
        const result = await extUsecase.execute(extId);

        if (result?.success) {

          return res.status(200).json(result);

        } else {

          return res.status(400).json(result);

        }
      } catch (err: any) {

        return res.status(500).json({ success: false, error: err?.message ?? String(err) });
        
      }    
  }

  static async getByOrgId(req: Request, res: Response) {

          // const orgRepo = new OrganizationRepository();
          // const usecase = new GetStaffByOrganizationUsecase(orgRepo);

          const extUsecase = new GetExtensionByOrganization(extRepo          )
  
          try {
  
              const organizationId    = req.params.organizationId || "";
              const result            = await extUsecase.execute(organizationId);
              res.json(result);
  
          } catch (err: any) {
              res.status(400).json({ error: err.message });
          }
  }

  static async getSelectByOrgId(req: Request, res: Response) {

    const extUsecase = new GetSelectExtensionByOrg(extRepo)

    try {
        const organizationId    = req.params.organizationId || "";
        const result            = await extUsecase.execute(organizationId);
        res.json(result);

    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
  }

  static async getByExtId(req: Request, res: Response) {

          // const orgRepo = new OrganizationRepository();
          // const usecase = new GetStaffByOrganizationUsecase(orgRepo);

          const extUsecase = new GetExtensionByExtId(extRepo)
  
          try {
  
              const extId    = req.params.extId || "";
              const result            = await extUsecase.execute(extId);
              res.json(result);
  
          } catch (err: any) {
              res.status(400).json({ error: err.message });
          }
  }

  static async getExtensionConfiguration(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const userId = res.locals.user_id as string | undefined;

      if (!userId) {
        return res.status(401).json({ error: "Missing authentication" });
      }

      if (!organizationId) {
        return res.status(400).json({ error: "Organization ID is required" });
      }

      const useCase = new GetExtensionConfigurationUseCase(orgRepo);
      const result = await useCase.execute(organizationId, userId);
      
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  static async updateExtensionConfiguration(req: Request, res: Response) {
    try {
      const { organizationId } = req.params;
      const userId = res.locals.user_id as string | undefined;

      if (!userId) {
        return res.status(401).json({ error: "Missing authentication" });
      }

      if (!organizationId) {
        return res.status(400).json({ error: "Organization ID is required" });
      }

      const parsed = ExtensionConfigurationUpdateSchema.parse(req.body);
      const useCase = new UpdateExtensionConfigurationUseCase(orgRepo);
      const result = await useCase.execute(organizationId, userId, parsed);
      
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}