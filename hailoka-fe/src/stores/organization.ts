// src/stores/organization.ts
import { defineStore } from "pinia";
import {
    organizationUserService,
    type CreateOrganizationPayload,
} from "../services/organizationUser";

export interface Organization {
    id: string | number;
    name: string;
    // tambahkan field lain kalau mau lebih ketat tipenya
    [key: string]: any;
}

type State = {
    organizations: Organization[];
    selectedOrganization: Organization | null;
    loading: boolean;
    error: string | null;
    initialized: boolean;
};

export const useOrganizationStore = defineStore("organization", {
    state: (): State => ({
        organizations: [],
        selectedOrganization: null,
        loading: false,
        error: null,
        initialized: false,
    }),

    getters: {
        hasOrganizations: (state) => state.organizations.length > 0,
        getOrganizationById:
            (state) =>
            (id: string | number): Organization | null =>
                state.organizations.find(
                    (org) => String(org.id) === String(id)
                ) ?? null,
    },

    actions: {
        resetError() {
            this.error = null;
        },

        setSelectedOrganization(id: string | number) {
            const found = this.organizations.find(
                (org) => String(org.id) === String(id)
            );
            this.selectedOrganization = found ?? null;
        },

        async fetchOrganizations() {
            this.loading = true;
            this.error = null;

            try {
                const res = await organizationUserService.getOrganizationUser();

                // tergantung struktur API-mu: res.data atau res.data.data
                const raw = res.data;
                const list: Organization[] = Array.isArray(raw)
                    ? raw
                    : raw.data;

                this.organizations = list;
                this.initialized = true;
            } catch (err: any) {
                this.organizations = [];
                this.error =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to fetch organizations";
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async fetchOrganizationOnce(id: string | number) {
            // helper kalau kamu mau pastikan data sudah di-fetch
            if (!this.initialized) {
                await this.fetchOrganizations();
            }
            const org = this.organizations.find(
                (o) => String(o.id) === String(id)
            );
            this.selectedOrganization = org ?? null;
            return org ?? null;
        },

        async createOrganization(payload: CreateOrganizationPayload) {
            this.loading = true;
            this.error = null;

            try {
                const res = await organizationUserService.createOrganization(
                    payload
                );

                // tergantung API-mu, kalau responsenya langsung object:
                const created: Organization = res.data?.data ?? res.data;

                // update list lokal biar UI langsung ke-refresh
                if (created && created.id) {
                    this.organizations.push(created);
                }

                return created;
            } catch (err: any) {
                this.error =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to create organization";
                throw err;
            } finally {
                this.loading = false;
            }
        },
    },
});
