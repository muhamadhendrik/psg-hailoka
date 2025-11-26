import { OrganizationChangeLog } from "../database/models/organizationChangeLog.model";
import { Organization } from "../database/models/organization.model";
import { UserModel } from "../database/models/user.model";

export interface OrganizationChangeLogEntity {
  id: number;
  organizationId: string;
  oldDataJson: string | null;
  newDataJson: string;
  userId: string;
  createdAt: Date;
}

export class OrganizationChangeLogRepository {
  async create(
    payload: Partial<OrganizationChangeLogEntity>
  ): Promise<OrganizationChangeLogEntity> {
    const log = await OrganizationChangeLog.create({
      organization_id: payload.organizationId!,
      old_data_json: payload.oldDataJson || null,
      new_data_json: payload.newDataJson!,
      user_id: payload.userId!,
    } as any);

    return this.toEntity(log.toJSON());
  }

  async findByOrganizationId(
    organizationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<OrganizationChangeLogEntity[]> {
    const logs = await OrganizationChangeLog.findAll({
      where: {
        organization_id: organizationId,
      },
      include: [
        {
          model: Organization,
          as: "organization",
          attributes: ["id", "name"],
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return logs.map((log) => this.toEntity(log.toJSON()));
  }

  async findById(id: number): Promise<OrganizationChangeLogEntity | null> {
    const log = await OrganizationChangeLog.findByPk(id, {
      include: [
        {
          model: Organization,
          as: "organization",
          attributes: ["id", "name"],
        },
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return log ? this.toEntity(log.toJSON()) : null;
  }

  private toEntity(raw: any): OrganizationChangeLogEntity {
    return {
      id: raw.id,
      organizationId: raw.organization_id,
      oldDataJson: raw.old_data_json,
      newDataJson: raw.new_data_json,
      userId: raw.user_id,
      createdAt: raw.created_at,
    };
  }
}

