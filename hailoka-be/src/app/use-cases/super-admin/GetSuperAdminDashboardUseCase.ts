import { OrganizationRepository } from "../../../infrastructure/repositories/organization.repository";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { Call } from "../../../infrastructure/database/models/call.model";
import { Organization } from "../../../infrastructure/database/models/organization.model";
import { UserModel } from "../../../infrastructure/database/models/user.model";
import { Op } from "sequelize";

export class GetSuperAdminDashboardUseCase {
    constructor(
        private orgRepo: OrganizationRepository,
        private userRepo: UserRepository
    ) {}

    async execute() {
        // Get total organizations by status
        const totalOrganizations = await Organization.count();
        const pendingOrganizations = await Organization.count({
            where: { organization_status_id: 1 }, // PENDING APPROVAL
        });
        const approvedOrganizations = await Organization.count({
            where: { organization_status_id: 2 }, // APPROVED
        });
        const rejectedOrganizations = await Organization.count({
            where: { organization_status_id: 3 }, // REJECTED
        });
        const suspendedOrganizations = await Organization.count({
            where: { organization_status_id: 4 }, // SUSPENDED
        });

        // Get total users
        const totalUsers = await UserModel.count({
            where: { user_type: "user" },
        });
        const suspendedUsers = await UserModel.count({
            where: {
                user_type: "user",
                suspended_at: { [Op.ne]: null },
            },
        });

        // Get total calls (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const totalCalls = await Call.count({
            where: {
                created_at: {
                    [Op.gte]: thirtyDaysAgo,
                },
            },
        });

        // Get recent organizations (last 5)
        const recentOrganizations = await Organization.findAll({
            limit: 5,
            order: [["created_at", "DESC"]],
            attributes: [
                "id",
                "name",
                "total_member",
                "organization_status_id",
                "primary_contact_full_name",
                "primary_contact_phone_number",
                "created_at",
            ],
        });

        return {
            organizations: {
                total: totalOrganizations,
                pending: pendingOrganizations,
                approved: approvedOrganizations,
                rejected: rejectedOrganizations,
                suspended: suspendedOrganizations,
            },
            users: {
                total: totalUsers,
                suspended: suspendedUsers,
            },
            calls: {
                total_last_30_days: totalCalls,
            },
            recent_organizations: recentOrganizations.map((org) => ({
                id: org.id,
                name: org.name,
                status_id: org.organization_status_id,
                total_member: org.total_member,
                primary_contact_full_name: org.primary_contact_full_name,
                primary_contact_phone_number: org.primary_contact_phone_number,
                created_at: org.created_at,
            })),
        };
    }
}

