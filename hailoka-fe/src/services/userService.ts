import api from "../utils/axios";

export interface User {
    id: string;
    name: string;
    email: string;
    is_verified_email: boolean;
    suspended_at: string | null;
    created_at: string;
    user_type: string;
}

export interface UserDetail extends User {
    organizations?: Array<{
        id: string;
        name: string;
        role: string;
    }>;
    last_active?: string;
}

export const userService = {
    getAllUsers: () =>
        api.get<User[]>("/super-admin/users", {
            withCredentials: true,
        }),
    getUserById: (userId: string) =>
        api.get<UserDetail>(`/super-admin/users/${userId}`, {
            withCredentials: true,
        }),
    suspendUser: (userId: string) =>
        api.put(`/super-admin/users/${userId}/suspend`, {}, {
            withCredentials: true,
        }),
    activateUser: (userId: string) =>
        api.put(`/super-admin/users/${userId}/activate`, {}, {
            withCredentials: true,
        }),
};

