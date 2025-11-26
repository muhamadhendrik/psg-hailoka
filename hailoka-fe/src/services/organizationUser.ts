import api from "../utils/axios";

export interface CreateOrganizationPayload {
    name: string;
    total_member: number;
    description: string;
    address: string;
    latitude: number | null; // ⬅️ tambahkan | null
    longitude: number | null; // ⬅️ tambahkan | null
    primary_contact_full_name: string;
    primary_contact_phone_number: string;
    internal_notes?: string | null;
}

export interface UpdateOrganizationStatusPayload {
    organization_status_id: number;
    reviewer_notes?: string | null;
    internal_notes?: string | null;
}

export interface OrganizationList {
    id: string;
    name: string;
    totalMember: number;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    organizationStatusId: number;
    primaryContactFullName: string;
    primaryContactPhoneNumber: string;
    internalNotes: string | null;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrganizationDetail {
    id: string;
    name: string;
    total_member: number;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    organization_status_id: number;
    primary_contact_full_name: string;
    primary_contact_phone_number: string;
    primary_did_number: string | null;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export const organizationUserService = {
    // createOrganization: (data: CreateOrganizationPayload, token: string) =>
    //     api.post("/organizations", data, {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // }),

    //getOrganizationUser: (token: string) =>
    //     api.get("/organizations", {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // }),

    createOrganization: (data: CreateOrganizationPayload) =>
        api.post("/organizations", data),
    getOrganizationUser: () => api.get("/organizations"),
    getAllOrganizations: () =>
        api.get<OrganizationList[]>("/organizations", {
            withCredentials: true,
        }),
    getOrganizationById: (organizationId: string) =>
        api.get<OrganizationDetail>(`/organizations/${organizationId}`, {
            withCredentials: true,
        }),
    updateOrganizationStatus: (
        organizationId: string,
        data: UpdateOrganizationStatusPayload
    ) =>
        api.put(`/organizations/${organizationId}/status`, data, {
            withCredentials: true,
        }),
};
