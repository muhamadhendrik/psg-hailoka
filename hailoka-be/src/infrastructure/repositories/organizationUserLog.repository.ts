import { OrganizationUserLog } from "../database/models/organizationUserLog.model";
import { Extension } from "../database/models/extension.model";
import { UserModel } from "../database/models/user.model";

export interface OrganizationUserLogEntity {
  id: number;
  extensionId: string | null;
  userId: string;
  oldDataJson: string;
  newDataJson: string;
  createdBy: string;
  createdAt: Date;
}

export class OrganizationUserLogRepository {
  async create(
    payload: Partial<OrganizationUserLogEntity>
  ): Promise<OrganizationUserLogEntity> {
    const log = await OrganizationUserLog.create({
      extension_id: payload.extensionId || null,
      user_id: payload.userId!,
      old_data_json: payload.oldDataJson!,
      new_data_json: payload.newDataJson!,
      created_by: payload.createdBy!,
    } as any);

    return this.toEntity(log.toJSON());
  }

  async findByUserId(
    userId: string,
    organizationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<OrganizationUserLogEntity[]> {
    const logs = await OrganizationUserLog.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Extension,
          as: "extension",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: UserModel,
          as: "createdByUser",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return logs.map((log) => this.toEntity(log.toJSON()));
  }

  async findByOrganizationId(
    organizationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<OrganizationUserLogEntity[]> {
    // Get all users in the organization first
    const { OrganizationUser } = require("../database/models/organizationUser.model");
    const orgUsers = await OrganizationUser.findAll({
      where: {
        organization_id: organizationId,
      },
      attributes: ["user_id"],
    });

    const userIds = orgUsers.map((ou: any) => ou.user_id);

    if (userIds.length === 0) {
      return [];
    }

    const logs = await OrganizationUserLog.findAll({
      where: {
        user_id: userIds,
      },
      include: [
        {
          model: Extension,
          as: "extension",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: UserModel,
          as: "createdByUser",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return logs.map((log) => this.toEntity(log.toJSON()));
  }

  async findById(id: number): Promise<OrganizationUserLogEntity | null> {
    const log = await OrganizationUserLog.findByPk(id, {
      include: [
        {
          model: Extension,
          as: "extension",
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: UserModel,
          as: "createdByUser",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return log ? this.toEntity(log.toJSON()) : null;
  }

  private toEntity(raw: any): OrganizationUserLogEntity {
    return {
      id: raw.id,
      extensionId: raw.extension_id,
      userId: raw.user_id,
      oldDataJson: raw.old_data_json,
      newDataJson: raw.new_data_json,
      createdBy: raw.created_by,
      createdAt: raw.created_at,
    };
  }
}

