import { Op } from "sequelize";
import { Extension, ExtensionRule } from "../database/models";

export type CreateExtensionRuleDTO = {
  organization_id: string;
  extension_id: string;
  extension_destination: string;
  timescope: "any" | "work_hours" | "off_hours";
  condition: "always" | "busy" | "no_answer" | "unreachable";
  created_by: string;
};

export class ExtensionRuleRepository {

  // ✅ Create new ExtensionRule
  async create(data: CreateExtensionRuleDTO) {

      return await ExtensionRule.create({
          ...data,
          updated_by: data.created_by, // 👈 fix TypeScript error
      });
  }

  // ✅ Get all ExtensionRules (include Extension.name + Extension.id)
  async getAllExtensionRule(orgId: string) {

    return await ExtensionRule.findAll({
      where: {
        deleted_at: { [Op.is]: null },
        organization_id: orgId,
      },
      include: [
        {
          model: Extension,
          as: "extension",
          attributes: ["id", "name"],
        },
        {
          model: Extension,
          as: "destination",
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
  }

  // ✅ Get a single ExtensionRule by ID
  async getExtensionRuleById(id: string) {
    
    return await ExtensionRule.findOne({
      where: {
        id,
        deleted_at: { [Op.is]: null },
      },
      include: [
        {
          model: Extension,
          as: "extension",
          attributes: ["id", "name"],
        },
        {
          model: Extension,
          as: "destination",
          attributes: ["id", "name"],
        },
      ],
    });
  }

  // ✅ Update ExtensionRule
  async update(id: string, data: Partial<ExtensionRule>) {
    await ExtensionRule.update(
      {
        ...data,
        updated_at: new Date(),
      },
      {
        where: { id },
      }
    );
    return this.getExtensionRuleById(id);
  }

  // ✅ Soft Delete (update deleted_by & deleted_at)
  async delete(id: string, deletedBy: string) {
    return await ExtensionRule.update(
      {
        deleted_by: deletedBy,
        deleted_at: new Date(),
      },
      {
        where: { id },
      }
    );
  }
}
