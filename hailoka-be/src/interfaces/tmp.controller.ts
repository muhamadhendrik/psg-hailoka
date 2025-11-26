import { Request, Response } from "express";
import { TemporaryTestPostData } from "../app/use-cases/temporary/tmpUseCase";
import { CallDashboardRepository } from "../infrastructure/repositories/callDashboard.repository";

const repo = new CallDashboardRepository()
const tmpUsecase = new TemporaryTestPostData(repo)

export class TmpController {

    static async PostTmp(req: Request, res: Response) {

        try {

            const orgId = req.params.organizationId || "";
                    
            const result = await tmpUsecase.execute(orgId);


            res.status(201).json(result);

        } catch (err: any) {

            // console.log("StaffController.create >>> ", err);
            res.status(400).json({ error: err.message });
        }

    }

}