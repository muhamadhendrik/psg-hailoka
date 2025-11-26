// src/services/authService.ts
import api from "../utils/axios";

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    userType: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    newPassword: string;
    token: string;
}

export interface GuestRegisterPayload {
    name: string;
}

// optional: tipe response login
export interface LoginResponseBody {
    message: string;
    user: {
        id: string;
        name: string;
        email: string;
        user_type: string | null;
    };
}

// ⭐ NEW: update profile payload
export interface UpdateProfilePayload {
    name: string;
}

// ⭐ NEW: change password payload (in-app)
export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export const authService = {
    register: (data: RegisterPayload) => api.post("/users/registration", data),

    login: (data: LoginPayload) =>
        api.post<LoginResponseBody>("/users/login", data),

    forgotPassword: (data: ForgotPasswordPayload) =>
        api.post("/forgot-password", data),

    resetPassword: (data: ResetPasswordPayload) =>
        api.post("/reset-password", data),

    guestRegister: (data: GuestRegisterPayload) =>
        api.post("/guest/register", data),

    logout: () =>
        api.post("/users/logout", undefined, { withCredentials: true }),

    // optional kalau pakai Google login
    loginWithGoogle: (token: string) => api.post("/auth/google", { token }),

    // ⭐ NEW: get current user (kalau mau dipakai di authStore.fetchMe)
    me: () => api.get<LoginResponseBody>("/users/me"),

    // ⭐ NEW: update profile (nama, dll)
    // ⛔ NOTE: sesuaikan path & field dengan backend kamu kalau beda
    updateProfile: (data: UpdateProfilePayload) =>
        api.put("/users/me/profile", data),

    // ⭐ NEW: change password di dalam aplikasi (bukan forgot-password)
    changePassword: (data: ChangePasswordPayload) =>
        api.put("/users/me/password", data),
};
