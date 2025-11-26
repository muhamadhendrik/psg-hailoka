<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
const toast = useToast();

import StatCard from "../../components/dashboard/StatCard.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import DashboardLayout from "../../layouts/DashboardLayout.vue";
// import Dialog from 'primevue/dialog';
// import Button from "primevue/button";

import OrganizationModalAction from "../../components/dashboard/OrganizationModalAction.vue";
import { useMenuStore } from "../../stores/menu";
import { dashboardService, type RecentOrganization } from "../../services/dashboardService";
import { organizationUserService } from "../../services/organizationUser";
// import OrganizationModalAction from '../../components/dashboard/OrganizationModalAction.vue';

const menuStore = useMenuStore();
menuStore.setActiveMenu("/admin");

const loading = ref(false);
const error = ref("");

const dashboardData = ref({
    organizations: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        suspended: 0,
    },
    users: {
        total: 0,
        suspended: 0,
    },
    calls: {
        total_last_30_days: 0,
    },
    recent_organizations: [] as RecentOrganization[],
});

const stats = computed(() => [
    {
        title: "Organizations Created",
        value: dashboardData.value.organizations.total,
        description: "",
        bg: "bg-green-50",
        icon: "mdi:office-building",
        iconBg: "bg-green-200 text-green-700",
    },
    {
        title: "Users Registered",
        value: dashboardData.value.users.total,
        description: "",
        bg: "bg-blue-50",
        icon: "mdi:account",
        iconBg: "bg-blue-200 text-blue-700",
    },
    {
        title: "Active Organizations",
        value: dashboardData.value.organizations.approved,
        description: "Currently running",
        bg: "bg-sky-100",
        icon: "mdi:check",
        iconBg: "bg-sky-200 text-sky-700",
    },
    {
        title: "Rejected Organizations",
        value: dashboardData.value.organizations.rejected,
        description: "All-time rejected",
        bg: "bg-red-100",
        icon: "mdi:close",
        iconBg: "bg-red-200 text-red-700",
    },
    {
        title: "Organization Pending Review",
        value: dashboardData.value.organizations.pending,
        description: "Need immediate action",
        bg: "bg-orange-100",
        icon: "mdi:clock-outline",
        iconBg: "bg-orange-200 text-orange-700",
    },
    {
        title: "Suspended Organizations",
        value: dashboardData.value.organizations.suspended,
        description: "Currently inactive by admin",
        bg: "bg-gray-100",
        icon: "mdi:power",
        iconBg: "bg-gray-200 text-gray-700",
    },
]);

const items = computed(() => {
    return dashboardData.value.recent_organizations.map((org) => ({
        id: org.id,
        name: org.name,
        total_member: org.total_member,
        contact_person: `${org.primary_contact_full_name} / ${org.primary_contact_phone_number}`,
        created: formatDate(org.created_at),
    }));
});

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

async function fetchDashboard() {
    try {
        loading.value = true;
        error.value = "";

        const response = await dashboardService.getDashboard();
        dashboardData.value = response.data;
    } catch (err: any) {
        console.error("Error fetching dashboard:", err);
        error.value = err.response?.data?.message || "Failed to fetch dashboard data.";
        
        toast.add({
            severity: "error",
            summary: "Error",
            detail: error.value,
            group: "custom",
            life: 5000,
        });
    } finally {
        loading.value = false;
    }
}

onMounted(fetchDashboard);

const openDropdown = ref<number | null>(null);

function toggleDropdown(id: number) {
    openDropdown.value = openDropdown.value === id ? null : id;
}

const isNextApprove = ref(false);
const isNextReject = ref(false);
const visibleApprove = ref(false);
const visibleReject = ref(false);

const approveNote = ref("");
const rejectNote = ref("");
const selectedOrganization = ref<RecentOrganization | null>(null);
const updatingStatus = ref(false);

function approve(row: any) {
    // Find the organization from dashboardData
    const org = dashboardData.value.recent_organizations.find(
        (o) => o.id === row.id
    );
    if (org) {
        selectedOrganization.value = org;
        approveNote.value = "";
        openDropdown.value = null;
        visibleApprove.value = true;
    }
}

async function confirmApprove() {
    if (!selectedOrganization.value) return;

    try {
        updatingStatus.value = true;
        const response = await organizationUserService.updateOrganizationStatus(
            selectedOrganization.value.id,
            {
                organization_status_id: 2, // Approved
                reviewer_notes: approveNote.value || null,
                internal_notes: null,
            }
        );

        if (response.data.success) {
            toast.add({
                severity: "success",
                summary: "Organization Approved",
                detail: `Organization "${selectedOrganization.value.name}" has been approved.`,
                group: "custom",
                life: 5000,
            });
            closeModalApprove();
            // Refresh dashboard data
            await fetchDashboard();
        }
    } catch (err: any) {
        console.error("Error approving organization:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail:
                err.response?.data?.message ||
                "Failed to approve organization.",
            group: "custom",
            life: 5000,
        });
    } finally {
        updatingStatus.value = false;
    }
}

async function confirmReject() {
    if (!selectedOrganization.value) return;

    try {
        updatingStatus.value = true;
        const response = await organizationUserService.updateOrganizationStatus(
            selectedOrganization.value.id,
            {
                organization_status_id: 3, // Rejected
                reviewer_notes: rejectNote.value || null,
                internal_notes: null,
            }
        );

        if (response.data.success) {
            toast.add({
                severity: "success",
                summary: "Organization Rejected",
                detail: `Organization "${selectedOrganization.value.name}" has been rejected.`,
                group: "custom",
                life: 5000,
            });
            closeModalReject();
            // Refresh dashboard data
            await fetchDashboard();
        }
    } catch (err: any) {
        console.error("Error rejecting organization:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail:
                err.response?.data?.message ||
                "Failed to reject organization.",
            group: "custom",
            life: 5000,
        });
    } finally {
        updatingStatus.value = false;
    }
}

function reject(row: any) {
    // Find the organization from dashboardData
    const org = dashboardData.value.recent_organizations.find(
        (o) => o.id === row.id
    );
    if (org) {
        selectedOrganization.value = org;
        rejectNote.value = "";
        openDropdown.value = null;
        visibleReject.value = true;
    }
}

function closeModalApprove() {
    isNextApprove.value = false;
    visibleApprove.value = false;
    approveNote.value = "";
    selectedOrganization.value = null;
}

function closeModalReject() {
    isNextReject.value = false;
    visibleReject.value = false;
    rejectNote.value = "";
    selectedOrganization.value = null;
}
</script>

<template>
    <DashboardLayout>
        <div class="bg-white border border-gray-200 rounded-md p-6 shadow">
            <h2 class="text-lg font-semibold mb-4">Dashboard</h2>
            <div class="flex flex-wrap">
                <div class="flex w-full gap-2">
                    <StatCard
                        v-for="(stat, i) in stats.slice(0, 2)"
                        :key="i"
                        :title="stat.title"
                        :value="stat.value"
                        :description="stat.description"
                        :bg="stat.bg"
                        :icon="stat.icon"
                        :iconBg="stat.iconBg"
                        :class-param="'w-full'" />
                </div>

                <div class="flex w-full gap-2 mt-4">
                    <StatCard
                        v-for="(stat, i) in stats.slice(2, 6)"
                        :key="i"
                        :title="stat.title"
                        :value="stat.value"
                        :description="stat.description"
                        :bg="stat.bg"
                        :icon="stat.icon"
                        :iconBg="stat.iconBg"
                        :class-param="'w-full'" />
                </div>
            </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-md p-6 shadow mt-4">
            <h2 class="text-lg font-semibold mb-4">Organizations To Review</h2>
            <p class="text-gray-400">
                These organizations are waiting for admin review before
                activation.
            </p>

            <div class="card space-y-4">
                <DataTable
                    :value="items"
                    :loading="loading"
                    scrollable
                    tableStyle="min-width: 800px; white-space: nowrap;"
                    sortMode="single"
                    paginator
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}">
                    <Column field="name" :frozen="true" sortable>
                        <template #sorticon="{ sortOrder }">
                            <div
                                class="flex justify-between items-center w-full">
                                <span class="font-semibold"
                                    >Organization Name</span
                                >

                                <span v-if="sortOrder === 1">
                                    <Icon
                                        icon="fluent:arrow-sort-up-lines-16-filled"
                                        width="24"
                                        height="24" />
                                </span>
                                <span v-else-if="sortOrder === -1">
                                    <Icon
                                        icon="fluent:arrow-sort-down-lines-16-filled"
                                        width="24"
                                        height="24" />
                                </span>
                                <span v-else>
                                    <Icon
                                        icon="solar:sort-outline"
                                        width="24"
                                        height="24" />
                                </span>
                            </div>
                        </template>
                    </Column>
                    <Column field="total_member" sortable header="Total Members">
                        <template #body="{ data }">
                            <span>{{ data.total_member }}</span>
                        </template>
                    </Column>

                    <Column
                        field="contact_person"
                        header="Contact Persons"
                        class="flex items-center">
                        <template #body="{ data }">
                            <span class="ml-2">{{ data.contact_person }}</span>
                            <Icon
                                icon="logos:whatsapp-icon"
                                width="26"
                                class="ms-3" />
                        </template>
                    </Column>

                    <Column field="created" header="Requested At" />

                    <Column
                        field="id"
                        header="Actions"
                        class="flex items-center">
                        <template #body="{ data }">
                            <div class="relative inline-block text-left">
                                <!-- Dropdown Button -->
                                <button
                                    @click="toggleDropdown(data.id)"
                                    type="button"
                                    class="inline-flex justify-center py-1.5 px-3 rounded border border-white hover:cursor-pointer focus:ring-gray-200 focus:border-gray-200">
                                    <Icon
                                        icon="ph:dots-three-bold"
                                        width="24"
                                        height="24" />
                                </button>

                                <!-- Dropdown Menu -->
                                <div
                                    v-if="openDropdown === data.id"
                                    class="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-md shadow-lg z-10">
                                    <ul class="py-1 text-sm text-gray-700">
                                        <li>
                                            <button
                                                @click="approve(data)"
                                                class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                                Approve
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                @click="reject(data)"
                                                class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                                Reject
                                            </button>
                                        </li>

                                        <li>
                                            <RouterLink
                                                :to="{
                                                    name: 'DetailOrganization',
                                                    params: { id: data.id },
                                                }"
                                                class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                                View Detail
                                            </RouterLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <template #empty>
                        <div
                            class="flex flex-col items-center justify-center py-10 text-gray-500 h-[500px]">
                            <i class="pi pi-inbox text-4xl mb-3"></i>
                            <p class="text-sm font-medium">No records found</p>
                            <p class="text-xs text-gray-400">
                                Try adjusting your filters or add new data
                            </p>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>

        <OrganizationModalAction
            v-if="selectedOrganization"
            v-model:visible="visibleApprove"
            :isNext="isNextApprove"
            v-model:note="approveNote"
            :orgInfo="{
                name: selectedOrganization.name,
                contact: `${selectedOrganization.primary_contact_full_name} / ${selectedOrganization.primary_contact_phone_number}`,
                email: 'N/A',
                requestedAt: formatDate(selectedOrganization.created_at),
            }"
            type="approve"
            :onClose="closeModalApprove"
            :onNext="(val) => (isNextApprove = val)"
            :onConfirm="confirmApprove" />

        <OrganizationModalAction
            v-if="selectedOrganization"
            v-model:visible="visibleReject"
            :isNext="isNextReject"
            v-model:note="rejectNote"
            :orgInfo="{
                name: selectedOrganization.name,
                contact: `${selectedOrganization.primary_contact_full_name} / ${selectedOrganization.primary_contact_phone_number}`,
                email: 'N/A',
                requestedAt: formatDate(selectedOrganization.created_at),
            }"
            type="reject"
            :onClose="closeModalReject"
            :onNext="(val) => (isNextReject = val)"
            :onConfirm="confirmReject" />

        <!-- <Toast /> -->

        <Toast position="top-right" group="custom">
            <template #message="{ message }">
                <div
                    class="flex items-center gap-3 text-gray-800 px-4 py-3 shadow-sm border border-sky-200">
                    <Icon icon="bi:check-circle" width="38" height="38" />
                    <div>
                        <p class="font-medium text-sm">{{ message.summary }}</p>
                        <p class="text-sm">{{ message.detail }}</p>
                    </div>
                </div>
            </template>
        </Toast>
    </DashboardLayout>
</template>

<!-- Custom template for the toast -->

<style>
.p-datatable-column-header-content > span {
    width: 100%;
}

.p-datatable-paginator-bottom {
    margin: 1rem 0 0 0;
    border-width: 0 !important;
}

.p-datatable-header-cell:first-child {
    padding: 0 4px 0 0;
}

.p-datatable-header-cell:not(:first-child) {
    padding: 0 4px;
}

.p-datatable-header-cell:last-child {
    padding: 0 0 0 4px;
}

.p-datatable-column-header-content {
    padding: 10px;
    background-color: #f3f4f6;
    width: 100%;
    border-radius: 5px;
}

.p-datatable .p-datatable-thead > tr > th {
    border-bottom: none !important;
}

.p-toast-message-content {
    padding: 0 !important;
}

.p-toast-message-content > div:nth-child(2) {
    position: absolute;
    padding: 18px;
    right: 0;
    top: 0;
}
</style>
