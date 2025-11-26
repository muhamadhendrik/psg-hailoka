import api from "../utils/axios";

export const guestScanQrService = {
    scanUrl: (urlId: string) => api.get("/qr/url/" + urlId),
};
