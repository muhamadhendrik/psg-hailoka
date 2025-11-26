
// import { Extension } from "../database/models/extension.model";
// import { ExtensionOperationalHour } from "../database/models/extensionOperationalHour.model";
// import { ExtensionAssignedStaff } from "../database/models/extensionAssignedStaff.model";
// import { UserModel } from "../database/models/user.model";


import {
  Extension,
  ExtensionOperationalHour,
  ExtensionAssignedStaff,
  UserModel,
} from "../database/models";
// import "../database/models/associations";


export type CreateExtensionDTO = {
  organization_id: string;
  name: string;
  icon: string;
  status_id: number;
  added_by: string;
  updated_by?: string; // optional, will default to added_by if not provided
};

export type UpdateExtensionDTO = Partial<{
  organization_id: string;
  name: string;
  icon: string;
  status_id: number;
  updated_by: string;
}>;

export class ExtensionRepository {

    /**
   * Create a new extension row and return the inserted id.
   */
  async create(data: CreateExtensionDTO): Promise<string> {
    const payload = {
      ...data,
      updated_by: data.updated_by ?? data.added_by,
    };

    const created = await Extension.create(payload as any);
    return created.id;
  }

  /**
   * Update an existing extension by id.
   * Returns true if a row was updated, false otherwise.
   */
  async update(id: string, updates: UpdateExtensionDTO): Promise<boolean> {
    const [affected] = await Extension.update(updates, {
      where: { id },
    });

    return affected > 0;
  }

  /**
   * Optional helper: fetch by id
   */
  async findById(id: string) {
    return Extension.findByPk(id);
  }

  async deleteById(id: string) {
    return Extension.destroy({
      where:{ id }
    });
  }

 /**
   * 1) Get all Extensions for an organization with:
   *    - Extension: id, organization_id, name
   *    - ExtensionOperationalHour: day_of_week, start_time, end_time
   *    - ExtensionAssignedStaff: user_id plus nested UserModel.name
   */
  async getExtensionsByOrgId(orgId: string): Promise<any[]> {
    const extensions = await Extension.findAll({
      where: { organization_id: orgId },
      attributes: ["id", "organization_id", "name", "icon"],
      include: [
        {
          model: ExtensionOperationalHour,
          as: "operational",
          attributes: ["day_of_week", "start_time", "end_time"],
          required: false,
        },
        {
          model: ExtensionAssignedStaff,
          as: "assignedStaff",
          required: false,
          include: [
            {
              model: UserModel,
              attributes: ["id", "name"],
              required: false,
            },
          ],
        },
      ],
    });

    // 🔄 Transform the nested result into compact format
    return extensions.map((ext: any) => ({
      id: ext.id,
      organization_id: ext.organization_id,
      name: ext.name,
      icon: ext.icon,
      operational: ext.operational,
      assignedStaffUserModel: ext.assignedStaff?.map(
        (staff: any) => staff.UserModel
      ),
    }));
  }

  /**
   * 1) Get all Extensions for an organization for select form:
   *    - Extension: id, organization_id, name
   *    - ExtensionOperationalHour: day_of_week, start_time, end_time
   *    - ExtensionAssignedStaff: user_id plus nested UserModel.name
   */
  async getSelectExtensionsByOrgId(orgId: string): Promise<any[]> {
    // const extensions = await Extension.findAll({
    //   where: { organization_id: orgId },
    //   attributes: ["id", "name"],

    // });

    return await Extension.findAll({
      where: { organization_id: orgId },
      attributes: ["id", "name"],

    });

    // 🔄 Transform the nested result into compact format
    // return extensions.map((ext: any) => ({
    //   id: ext.id,
    //   name: ext.name,
    // }));
  }

  /**
   * 2) Get single Extension by id with the same joins/fields as above
   */
  async getExtensionsByExtId(id: string): Promise<any | null> {
    const ext = await Extension.findOne({
      where: { id },
      attributes: ["id", "organization_id", "name", "icon"],
      include: [
        {
          model: ExtensionOperationalHour,
          as: "operational",
          attributes: ["day_of_week", "start_time", "end_time"],
          required: false,
        },
        {
          model: ExtensionAssignedStaff,
          as: "assignedStaff",
          required: false,
          include: [
            {
              model: UserModel,
              attributes: ["id", "name"],
              required: false,
            },
          ],
        },
      ],
    });

    if (!ext) return null;

    return {
      id: ext.id,
      organization_id: ext.organization_id,
      name: ext.name,
      icon: ext.icon,
      operational: ext.operational,
      assignedStaffUserModel: ext.assignedStaff?.map(
        (staff: any) => staff.UserModel
      ),
    };
  }

}