import api from "../utils/axios";

export const staffServices = {
    getStaffByOrg: (organizationId: string) =>
        api.get(`/organizations/${organizationId}/staffs`, {
            withCredentials: true,
        }),
    getStaffSelection: (organizationId: string) =>
        api.get(`/organizations/${organizationId}/staffs-selection`, {
            withCredentials: true,
        }),
    getStaffByUserId: (organizationId: string, userId: string) =>
        api.get(`/organizations/${organizationId}/staffs/${userId}`, {
            withCredentials: true,
        }),
    createStaff: (data: any) =>
        api.post(`/staff`, data, { withCredentials: true }),
    updateStaff: (data: any) =>
        api.put(`/staff`, data, { withCredentials: true }),
    deleteStaff: (userId: string) =>
        api.delete(`/staff/${userId}`, { withCredentials: true }),
};
