import { defineStore } from "pinia";
import api from "../utils/axios";

import { authService } from "../services/authService";
import type { LoginPayload, LoginResponseBody } from "../services/authService";

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    user_type: string | null;
};

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as AuthUser | null,
        loading: false,
        error: null as string | null,
        initialized: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user,
    },

    actions: {
        async fetchMe() {
            this.loading = true;
            this.error = null;

            try {
                const res = await api.get<AuthUser>("/users/me", {
                    withCredentials: true,
                });

                this.user = res.data;
            } catch (err: any) {
                this.user = null;

                if (err.response?.status && err.response.status !== 401) {
                    this.error =
                        err.response?.data?.error || "Failed to fetch user";
                }
            } finally {
                this.initialized = true;
                this.loading = false;
            }
        },

        // 🔹 LOGIN: pakai authService + return body JSON
        async login(payload: LoginPayload): Promise<LoginResponseBody> {
            this.loading = true;
            this.error = null;

            try {
                const res = await authService.login(payload);
                const data = res.data; // { message, user }

                if (data?.user) {
                    this.user = data.user;
                } else {
                    // fallback kalau suatu saat backend tidak kirim user
                    await this.fetchMe();
                }

                // ⚠ penting: return body ke caller (signin.vue)
                return data;
            } catch (err: any) {
                this.user = null;
                this.error =
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    "Login failed";

                throw err;
            } finally {
                this.loading = false;
            }
        },

        // 🔹 LOGOUT: pakai service
        async logout() {
            this.loading = true;
            this.error = null;

            try {
                const res = await authService.logout();
                console.log("Logout response:", res.data); // <- mestinya { message: "Logged out successfully" }
            } catch (err: any) {
                this.error =
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    "Logout failed (local session cleared)";
            } finally {
                this.user = null;
                this.loading = false;
            }
        },

        // 🔹 optional: login dengan Google kalau kamu pakai
        async loginWithGoogle(idToken: string) {
            this.loading = true;
            this.error = null;

            try {
                const res = await authService.loginWithGoogle(idToken);
                const data = res.data as LoginResponseBody | any;

                if (data?.user) {
                    this.user = data.user;
                } else {
                    await this.fetchMe();
                }

                return data;
            } catch (err: any) {
                this.user = null;
                this.error =
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    "Google login failed";

                throw err;
            } finally {
                this.loading = false;
            }
        },
    },
});
