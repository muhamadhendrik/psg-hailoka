import { Extension } from "../database/models/extension.model";
import { ExtensionAssignedStaff } from "../database/models/extensionAssignedStaff.model";
import { Organization } from "../database/models/organization.model";
import { OrganizationUser } from "../database/models/organizationUser.model";
import { UserModel } from "../database/models/user.model";
import sequelize from "../database/sequelize";
import { Op } from "sequelize";

// Domain entity definitions (you can move them to /domain if you prefer)
export interface OrganizationEntity {
  id: string;
  name: string;
  totalMember: number;
  description?: string | null | undefined;
  address?: string | null | undefined;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  organizationStatusId: number;
  primaryContactFullName?: string | null | undefined;
  primaryContactPhoneNumber?: string | null | undefined;
  reviewerNotes?: string | null | undefined;
  internalNotes?: string | null | undefined;
  primaryDidNumber?: string | null | undefined;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationUserEntity {
  userId: string;
  organizationId: string;
  userEmail: string;
  roleId: number;
  status: "pending" | "rejected" | "active" | "suspended";
  addedBy: string;
  updatedBy: string;
  removedBy?: string | null;
  removedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class OrganizationRepository {


  async createOrganization( payload: Partial<OrganizationEntity>, tx?: any): Promise<OrganizationEntity> {

    const org = await Organization.create(payload as any, { transaction: tx });

    return {
      id: org.id,
      name: org.name,
      totalMember: org.total_member,
      description: org.description,
      address: org.address,
      latitude: org.latitude,
      longitude: org.longitude,
      organizationStatusId: org.organization_status_id,
      primaryContactFullName: org.primary_contact_full_name,
      primaryContactPhoneNumber: org.primary_contact_phone_number,
      reviewerNotes: org.reviewer_notes,
      internalNotes: org.internal_notes,
      primaryDidNumber: org.primary_did_number,
      createdBy: org.created_by,
      updatedBy: org.updated_by,
      createdAt: org.created_at,
      updatedAt: org.updated_at,
    };

  }

  async createOrganizationUser( payload: Partial<OrganizationUserEntity>, tx?: any ): Promise<OrganizationUserEntity> {

    // map domain/camelCase to DB/snake_case

    const dbPayload = {
      user_id: payload.userId ?? (payload as any).user_id,
      organization_id: payload.organizationId ?? (payload as any).organization_id,
      user_email: payload.userEmail ?? (payload as any).user_email,
      role_id: payload.roleId ?? (payload as any).role_id,
      status: payload.status ?? (payload as any).status,
      added_by: payload.addedBy ?? (payload as any).added_by,
      updated_by: payload.updatedBy ?? (payload as any).updated_by,
      removed_by: payload.removedBy ?? (payload as any).removed_by ?? null,
      removed_at: payload.removedAt ?? (payload as any).removed_at ?? null,
      created_at: payload.createdAt ?? (payload as any).created_at ?? new Date(),
      updated_at: payload.updatedAt ?? (payload as any).updated_at ?? new Date(),
    };

    // Basic safety check: ensure required fields are present before DB insert
    const required = [
      "user_id",
      "organization_id",
      "user_email",
      "role_id",
      "added_by",
      "updated_by",
    ];

    for (const key of required) {

      // @ts-ignore - dynamic access for validation
      if (!dbPayload[key]) {
        throw new Error(`createOrganizationUser: missing required field ${key}`);
      }

    }

    // Create using Sequelize model (with transaction if provided)
    const orgUser = await OrganizationUser.create(dbPayload as any, {
      transaction: tx,
    });

    // Map DB result back to domain/camelCase entity
    return {
      userId: orgUser.user_id,
      organizationId: orgUser.organization_id,
      userEmail: orgUser.user_email,
      roleId: orgUser.role_id,
      status: orgUser.status,
      addedBy: orgUser.added_by,
      updatedBy: orgUser.updated_by,
      removedBy: orgUser.removed_by,
      removedAt: orgUser.removed_at,
      createdAt: orgUser.created_at,
      updatedAt: orgUser.updated_at,
    };
  }

  /**
  Find organization by ID
   */
  async findById(id: string): Promise<OrganizationEntity | null> {

    const org = await Organization.findByPk(id);
    if (!org) return null;

    return {
      id: org.id,
      name: org.name,
      totalMember: org.total_member,
      description: org.description,
      address: org.address,
      latitude: org.latitude,
      longitude: org.longitude,
      organizationStatusId: org.organization_status_id,
      primaryContactFullName: org.primary_contact_full_name,
      primaryContactPhoneNumber: org.primary_contact_phone_number,
      reviewerNotes: org.reviewer_notes,
      internalNotes: org.internal_notes,
      primaryDidNumber: org.primary_did_number,
      createdBy: org.created_by,
      updatedBy: org.updated_by,
      createdAt: org.created_at,
      updatedAt: org.updated_at,
    };
  }

  /**
  Update organization status (example)
  */
  async updateStatus( id: string, organizationStatusId: number): Promise<void> {

    await Organization.update(
      { organization_status_id: organizationStatusId },
      { where: { id } }
    );

  }

  async findAll(): Promise<OrganizationEntity[]> {
    
    const orgs = await Organization.findAll();

    return orgs.map(org => ({
      id: org.id,
      name: org.name,
      totalMember: org.total_member,
      description: org.description,
      address: org.address,
      latitude: org.latitude,
      longitude: org.longitude,
      organizationStatusId: org.organization_status_id,
      primaryContactFullName: org.primary_contact_full_name,
      primaryContactPhoneNumber: org.primary_contact_phone_number,
      internalNotes: org.internal_notes,
      createdBy: org.created_by,
      updatedBy: org.updated_by,
      createdAt: org.created_at,
      updatedAt: org.updated_at,
    }));

  }

  async findOrganizationsByUserId(userId: string): Promise<OrganizationEntity[]> {

    const orgs = await Organization.findAll({
      include: [
        {
          model: OrganizationUser,
          as: "organizationUsers",
          where: { user_id: userId },
          required: true, // inner join
        },
      ],
    });

    return orgs.map(org => ({
      id: org.id,
      name: org.name,
      totalMember: org.total_member,
      description: org.description,
      address: org.address,
      latitude: org.latitude,
      longitude: org.longitude,
      organizationStatusId: org.organization_status_id,
      primaryContactFullName: org.primary_contact_full_name,
      primaryContactPhoneNumber: org.primary_contact_phone_number,
      reviewerNotes: org.reviewer_notes,
      internalNotes: org.internal_notes,
      primaryDidNumber: org.primary_did_number,
      createdBy: org.created_by,
      updatedBy: org.updated_by,
      createdAt: org.created_at,
      updatedAt: org.updated_at,
    }));
  }

  async updateOrganizationUserRole(payload: { userId: string; roleId: number; updatedBy: string }): Promise<void> {

    await OrganizationUser.update(
      { role_id: payload.roleId, updated_by: payload.updatedBy, updated_at: new Date() },
      { where: { user_id: payload.userId } }
    );

  }

  async getStaffsByOrganization(organizationId: string): Promise< Array<{ user_id: string; role: string; assignedExtension: string[]; }>> {

    const orgUsers = await OrganizationUser.findAll({
      where: {
        organization_id: organizationId,
        // role_id: 4,
        status: "active",
        removed_at: null,
      },
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: ExtensionAssignedStaff,
          as: "assignedExtensions",
          required: false,
          include: [
            {
              model: Extension,
              as: "extension",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    return orgUsers.map((orgUser: any) => ({
      user_id: orgUser.user_id,
      name: orgUser.user.name,
      role: orgUser.role_id == 4 ? 'staff':'owner',
      assignedExtension: orgUser.assignedExtensions
      ? orgUser.assignedExtensions.map((eas: any) => eas.extension?.name).filter(Boolean)
      : [],
    }));

  }

  async getStaffsByOrganizationStaffOnly(organizationId: string): Promise< Array<{ user_id: string; name: string }>> {

    const orgUsers = await OrganizationUser.findAll({
      where: {
        organization_id: organizationId,
        role_id: 4,
        status: "active",
        removed_at: null,
      },
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
    });

    // console.log("orgUsers >>> ", orgUsers);
    
    
    return orgUsers.map((orgUser: any) => ({
      user_id: orgUser.user_id,
      name: orgUser.user.name,
    }));

  }

  async updateOrganizationUserRemoved(userId: string, removedBy: string): Promise<void> {

    await OrganizationUser.update(
      {
        removed_by: removedBy,
        removed_at: new Date(),
        updated_at: new Date(),
      },
      { where: { user_id: userId } }
    );

  }

  async getOrganizationUserByUserId(organizationId: string, userId: string)  {

    const orgUser = await OrganizationUser.findOne({
      where: {
        user_id: userId,
        removed_at: null,
      },
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: ExtensionAssignedStaff,
          as: "assignedExtensions",
          required: false,
          include: [
            {
              model: Extension,
              as: "extension",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!orgUser) return null;

    return {
      user_id: orgUser.user_id,
      organization_id: orgUser.organization_id,
      user_name: orgUser.user?.name,
      user_email: orgUser.user?.email,
      role: orgUser.role_id == 4 ? "staff" : "owner",
      roleId: orgUser.role_id,
      status: orgUser.status,
      assignedExtensions:
        orgUser.assignedExtensions?.map((eas: any) => eas.extension?.name).filter(Boolean) || [],
    };
  }

  async updateOrganization(
    id: string,
    updates: {
      reviewer_notes?: string | null;
      internal_notes?: string | null;
      updated_by: string;
    },
    tx?: any
  ): Promise<void> {
    const updateData: any = {
      updated_by: updates.updated_by,
      updated_at: new Date(),
    };

    if (updates.reviewer_notes !== undefined) {
      updateData.reviewer_notes = updates.reviewer_notes;
    }

    if (updates.internal_notes !== undefined) {
      updateData.internal_notes = updates.internal_notes;
    }

    await Organization.update(updateData, {
      where: { id },
      transaction: tx,
    });
  }
}
