import api from "../utils/axios";

export interface Role {
    id: number;
    name: string;
}

export interface CreateRolePayload {
    name: string;
}

export interface UpdateRolePayload {
    name: string;
}

export const roleServices = {
    getAllRoles: () =>
        api.get<Role[]>("/roles", {
            withCredentials: true,
        }),
    getRoleById: (id: string) =>
        api.get<Role>(`/roles/${id}`, {
            withCredentials: true,
        }),
    createRole: (data: CreateRolePayload) =>
        api.post<Role>("/roles", data, { withCredentials: true }),
    updateRole: (id: string, data: UpdateRolePayload) =>
        api.put<Role>(`/roles/${id}`, data, { withCredentials: true }),
    deleteRole: (id: string) =>
        api.delete(`/roles/${id}`, { withCredentials: true }),
};

