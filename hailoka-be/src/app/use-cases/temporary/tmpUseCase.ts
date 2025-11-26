import { CallDashboardRepository } from "../../../infrastructure/repositories/callDashboard.repository";



export class TemporaryTestPostData {
    constructor(private repo: CallDashboardRepository) {}
    
      async execute(orgId: string) {
        const data = await this.repo.getCurrentCallOverview(orgId)

        // console.log("result >>>> ", data);
        

        return { data };
      }
}