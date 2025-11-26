// src/services/qrService.ts
import api from "../utils/axios";

export interface GenerateOrgQrPayload {
    organization_id: string;
    data: {
        organization_id: string;
        name: string;
        address: string;
        description: string;
    };
}

export interface OrgQrData {
    organization_id: string;
    data_json: string;
    qr_url: string;
    created_at: string;
    expired_at: string | null;
}

// base URL backend QR (bisa kamu pindah ke .env)
const QR_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const qrService = {
    generateOrgQr: (payload: GenerateOrgQrPayload) =>
        api.post<{ success: boolean; data: OrgQrData }>(
            "/qr/generate",
            payload
        ),

    getQrCodeByOrganization: (organizationId: string) =>
        api.get<{ success: boolean; data: OrgQrData }>(
            `/qr/org/${organizationId}`
        ),

    // kalau suatu saat butuh blob image
    getQrCodeOrgImageBlob: (organizationId: string) =>
        api.get(`/qr/org/${organizationId}/image`, {
            responseType: "blob",
        }),

    // 🔹 helper: URL gambar QR untuk <img>
    getOrgQrImageUrl: (organizationId: string, version?: number) => {
        const v = version ?? 0;
        // tambahin query ?v= biar nggak kecache browser saat re-generate
        return `${QR_BASE_URL}/qr/org/${organizationId}/image?v=${v}`;
    },
};
