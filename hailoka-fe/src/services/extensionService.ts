import api from "../utils/axios";

export const extensionServices = {
    createNewExtension: (data: any) =>
        api.post(`/extensions`, data, { withCredentials: true }),
    updateExtension: (data: any, id: string) =>
        api.put(`/extensions/${id}`, data, { withCredentials: true }),
    getExtensionByOrg: (id: string) =>
        api.get(`/extensions/${id}`, { withCredentials: true }),
    getExtensionByExtId: (id: string) =>
        api.get(`/extensionsById/${id}`, { withCredentials: true }),
    deleteExtension: (id: string) =>
        api.delete(`/extensions/${id}`, { withCredentials: true }),
};
