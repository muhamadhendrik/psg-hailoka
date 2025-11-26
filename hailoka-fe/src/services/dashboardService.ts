import api from "../utils/axios";

export interface DashboardOrganizations {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
}

export interface DashboardUsers {
    total: number;
    suspended: number;
}

export interface DashboardCalls {
    total_last_30_days: number;
}

export interface RecentOrganization {
    id: string;
    name: string;
    status_id: number;
    total_member: number;
    primary_contact_full_name: string;
    primary_contact_phone_number: string;
    created_at: string;
}

export interface DashboardResponse {
    organizations: DashboardOrganizations;
    users: DashboardUsers;
    calls: DashboardCalls;
    recent_organizations: RecentOrganization[];
}

export const dashboardService = {
    getDashboard: () =>
        api.get<DashboardResponse>("/super-admin/dashboard", {
            withCredentials: true,
        }),
};

