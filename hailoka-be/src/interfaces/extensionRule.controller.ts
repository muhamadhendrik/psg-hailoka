import { Request, Response } from "express";
import { CreateExtensionRuleUseCase } from "../app/use-cases/extension-rule/CreateExtensionRuleUseCase";
import { ExtensionRuleRepository } from "../infrastructure/repositories/extension-rule.repository";
import { GetAllExtensionRuleUseCase } from "../app/use-cases/extension-rule/GetAllExtensionRuleUseCase";
import { GetExtensionRuleByIdUseCase } from "../app/use-cases/extension-rule/GetExtensionRuleByIdUseCase";
import { UpdateExtensionRuleUseCase } from "../app/use-cases/extension-rule/UpdateExtensionRuleUseCase";
import { DeleteExtensionRuleUseCase } from "../app/use-cases/extension-rule/DeleteExtensionRuleUseCase";


const extRuleRepo = new ExtensionRuleRepository()

export class ExtensionRuleController {

    static async insert(req: Request, res: Response) {

      const extRuleUsecase = new CreateExtensionRuleUseCase(
          extRuleRepo,
      )

      // get owner id from auth middleware (stored on res.locals by authMiddleware)
      const userIdOwner = res.locals.user_id as string | undefined;

      if (!userIdOwner) {
        return res.status(401).json({ error: "Missing authentication" });
      }

      const dto = req.body;

      try {
        const result = await extRuleUsecase.execute(dto, userIdOwner );

        if (result?.success) {
          return res.status(201).json(result);
        } else {
          return res.status(400).json(result);
        }
      } catch (err: any) {
        return res.status(500).json({ success: false, error: err?.message ?? String(err) });
      }    
    }

    static async getAll(req: Request, res: Response) {
        
        const getAllUseCase = new GetAllExtensionRuleUseCase(extRuleRepo);

        const { orgId } = req.params;

        try {
            const result = await getAllUseCase.execute(orgId as string);

            return res.status(200).json(result);

        } catch (err: any) {

            return res.status(500).json({ success: false, error: err?.message ?? String(err) });

        }
    }

    static async getById(req: Request, res: Response) {
        const getByIdUseCase = new GetExtensionRuleByIdUseCase(extRuleRepo);
        const { id } = req.params;
        try {
            const result = await getByIdUseCase.execute(id as string);
            if (result) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ success: false, error: "Extension rule not found" });
            }
        } catch (err: any) {
            return res.status(500).json({ success: false, error: err?.message ?? String(err) });
        }
    }

    static async update(req: Request, res: Response) {
        const updateUseCase = new UpdateExtensionRuleUseCase(extRuleRepo);
        const { id } = req.params;
        const dto = req.body;
        try {
            const result = await updateUseCase.execute(id as string, dto);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ success: false, error: err?.message ?? String(err) });
        }
    }

    static async delete(req: Request, res: Response) {
        const deleteUseCase = new DeleteExtensionRuleUseCase(extRuleRepo);
        const { id } = req.params;
        const userId = res.locals.user_id as string | undefined;

        if (!userId) {
            return res.status(401).json({ error: "Missing authentication" });
        }

        try {
            const result = await deleteUseCase.execute(id as string, userId);
            return res.status(200).json(result);
        } catch (err: any) {
            return res.status(500).json({ success: false, error: err?.message ?? String(err) });
        }
    }


}