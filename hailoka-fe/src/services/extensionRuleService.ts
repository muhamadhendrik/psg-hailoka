import api from "../utils/axios";

export const extensionRuleServices = {
    createNewExtensionRule: (data: any) =>
        api.post(`/extensions-rule`, data, { withCredentials: true }),
    updateExtensionRule: (data: any, id: string) =>
        api.put(`/extensions-rule/${id}`, data, { withCredentials: true }),
    getExtensionSelectByOrg: (id: string) =>
        api.get(`/extensions/${id}/select`, { withCredentials: true }),
    getExtensionRuleByOrg: (id: string) =>
        api.get(`/extensions-rule/${id}`, { withCredentials: true }),
    getExtensionRuleByExtId: (id: string) =>
        api.get(`/extensions-rule/${id}/detail`, { withCredentials: true }),
    deleteExtensionRule: (id: string) =>
        api.delete(`/extensions-rule/${id}`, { withCredentials: true }),
};
