import { CallParticipant, Call, UserModel, Extension } from "../database/models";
import { Op } from "sequelize";

export type CreateCallParticipantDTO = {
    call_id: string;
    role: "host" | "caller" | "recipient";
    kind: "user" | "guest" | "extension";
    ref_id: string;
};

export class CallParticipantRepository {

    /**
   * Create a new call participant record
   */
  async create(data: CreateCallParticipantDTO) {
    try {
      const participant = await CallParticipant.create({
        call_id: data.call_id,
        role: data.role,
        kind: data.kind,
        ref_id: data.ref_id,
      });

      return participant;
    } catch (error) {
      console.error("[CallParticipantRepository.create] Error:", error);
      throw new Error("Failed to create call participant");
    }
  }

  /**
   * Get all CallParticipants by organization_id
   * Includes userName (from UserModel) and extName (from Extension)
    */
    async getByOrganizationId(organization_id: string) {
        try {
        const participants = await CallParticipant.findAll({
            include: [
            {
                model: Call,
                where: { organization_id },
                attributes: ["id", "organization_id", "join_code"],
            },
            {
                model: UserModel,
                as: "user",
                required: false,
                attributes: [["name", "userName"]],
            },
            {
                model: Extension,
                as: "extension",
                required: false,
                attributes: [["name", "extName"]],
            },
            ],
        });

        return participants;
        } catch (error) {
        console.error("[CallParticipantRepository.getByOrganizationId] Error:", error);
        throw new Error("Failed to fetch call participants by organization");
        }
    }

    /**
     * Get CallParticipants by call_id
     * Includes userName (from UserModel) and extName (from Extension)
   */
    async getByCallId(call_id: string) {
        try {
        const participants = await CallParticipant.findAll({
            where: { call_id },
            include: [
            {
                model: UserModel,
                as: "user",
                required: false,
                attributes: [["name", "userName"]],
            },
            {
                model: Extension,
                as: "extension",
                required: false,
                attributes: [["name", "extName"]],
            },
            ],
        });

        return participants;
        } catch (error) {
        console.error("[CallParticipantRepository.getByCallId] Error:", error);
        throw new Error("Failed to fetch call participants by call_id");
        }
    }

}