<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import DashboardLayout from "../../../layouts/DashboardLayout.vue";
import OrganizationModalAction from "../../../components/dashboard/OrganizationModalAction.vue";
import Toast from "primevue/toast";
import { Column, DataTable, useToast } from "primevue";
import { Icon } from "@iconify/vue";
import { organizationUserService, type OrganizationList } from "../../../services/organizationUser";
const toast = useToast();

import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import { useMenuStore } from "../../../stores/menu";

const menuStore = useMenuStore();
menuStore.setActiveMenu("/admin/organizations");

const loading = ref(false);
const error = ref("");
const organizations = ref<OrganizationList[]>([]);

const selectedStatus = ref<number | null>(null);
const searchQuery = ref("");

const statuses = computed(() => {
    const counts = {
        1: 0, // In Review
        2: 0, // Approved
        3: 0, // Rejected
        4: 0, // Suspended
    };
    
    organizations.value.forEach(org => {
        if (org.organizationStatusId in counts) {
            counts[org.organizationStatusId as keyof typeof counts]++;
        }
    });

    return [
        { label: "In Review", value: 1, count: counts[1] },
        { label: "Approved", value: 2, count: counts[2] },
        { label: "Rejected", value: 3, count: counts[3] },
        { label: "Suspended", value: 4, count: counts[4] },
    ];
});

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getStatusLabel(statusId: number): string {
    switch (statusId) {
        case 1:
            return "In Review";
        case 2:
            return "Approved";
        case 3:
            return "Rejected";
        case 4:
            return "Suspended";
        default:
            return "Unknown";
    }
}

const filteredItems = computed(() => {
    let filtered = organizations.value.map((org) => ({
        id: org.id,
        name: org.name,
        address: org.address,
        contactPerson: org.primaryContactFullName,
        email: "N/A", // API doesn't provide email in list
        phoneNumber: org.primaryContactPhoneNumber,
        created: formatDate(org.createdAt),
        status: getStatusLabel(org.organizationStatusId),
        statusId: org.organizationStatusId,
        totalMembers: org.totalMember,
        totalExtensions: 0, // API doesn't provide this in list
    }));

    // Filter by status
    if (selectedStatus.value !== null) {
        filtered = filtered.filter(item => item.statusId === selectedStatus.value);
    }

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.address.toLowerCase().includes(query) ||
            item.contactPerson.toLowerCase().includes(query) ||
            item.phoneNumber.toLowerCase().includes(query)
        );
    }

    return filtered;
});

const items = computed(() => filteredItems.value);

async function fetchOrganizations() {
    try {
        loading.value = true;
        error.value = "";

        const response = await organizationUserService.getAllOrganizations();
        organizations.value = response.data;
    } catch (err: any) {
        console.error("Error fetching organizations:", err);
        error.value = err.response?.data?.message || "Failed to fetch organizations.";
        
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

const openDropdown = ref<number | null>(null);

// function toggleDropdown(id: number) {
//   openDropdown.value = openDropdown.value === id ? null : id;
// }

let prevTd: HTMLElement | null = null;

function toggleDropdown(e: MouseEvent, id: number) {
    e.stopPropagation();

    // find the <td> element (two levels above the button)
    const td = (e.currentTarget as HTMLElement).closest(
        "td"
    ) as HTMLElement | null;
    if (!td) return;

    // remove previous highlight if another td was open
    if (prevTd && prevTd !== td) {
        prevTd.style.zIndex = "";
        prevTd.classList.remove("relative", "z-[9999]");
    }

    if (openDropdown.value === id) {
        // close dropdown
        openDropdown.value = null;
        td.style.zIndex = "";
        td.classList.remove("relative", "z-[9999]");
        prevTd = null;
    } else {
        // open new one
        openDropdown.value = id;
        td.classList.add("relative", "z-[9999]");
        td.style.zIndex = "9999";
        prevTd = td;
    }
}

const isNextApprove = ref(false);
const isNextReject = ref(false);
const visibleApprove = ref(false);
const visibleReject = ref(false);
const updatingStatus = ref(false);

const approveNote = ref("");
const rejectNote = ref("");
const selectedOrganization = ref<OrganizationList | null>(null);

function approve(row: any) {
    const org = organizations.value.find(o => o.id === row.id);
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
            // Refresh organizations data
            await fetchOrganizations();
        }
    } catch (err: any) {
        console.error("Error approving organization:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: err.response?.data?.message || "Failed to approve organization.",
            group: "custom",
            life: 5000,
        });
    } finally {
        updatingStatus.value = false;
    }
}

function reject(row: any) {
    const org = organizations.value.find(o => o.id === row.id);
    if (org) {
        selectedOrganization.value = org;
        rejectNote.value = "";
        openDropdown.value = null;
        visibleReject.value = true;
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
            // Refresh organizations data
            await fetchOrganizations();
        }
    } catch (err: any) {
        console.error("Error rejecting organization:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: err.response?.data?.message || "Failed to reject organization.",
            group: "custom",
            life: 5000,
        });
    } finally {
        updatingStatus.value = false;
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

onMounted(fetchOrganizations);
</script>

<template>
    <DashboardLayout>
        <div class="bg-white px-4 py-8 rounded-xl shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Status Dropdown -->
                <div>
                    <label class="block font-medium text-gray-800 mb-1"
                        >Status</label
                    >
                    <Dropdown
                        v-model="selectedStatus"
                        :options="statuses"
                        optionLabel="label"
                        optionValue="value"
                        class="w-full rounded-full! py-1"
                        :placeholder="'Select Status'"
                        inputClass="!rounded-full">
                        <template #value="{ value }">
                            <span v-if="value !== null" class="flex items-center gap-2">
                                {{ statuses.find(s => s.value === value)?.label }} ({{ statuses.find(s => s.value === value)?.count }})
                            </span>
                            <span v-else>Select Status</span>
                        </template>
                        <template #option="{ option }">
                            <span>{{ option.label }} ({{ option.count }})</span>
                        </template>
                    </Dropdown>
                </div>

                <!-- Search Input -->
                <div>
                    <label class="block font-medium text-gray-800 mb-1">
                        What are you looking for?
                    </label>
                    <div class="relative">
                        <Icon
                            icon="solar:magnifer-linear"
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <InputText
                            v-model="searchQuery"
                            placeholder="Search"
                            class="w-full pl-10! !rounded-full py-3!" />
                    </div>
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

                    <Column field="address" header="Address" />

                    <Column field="contactPerson" header="Contact Peson" />

                    <Column field="email" header="Email" />

                    <Column
                        field="phoneNumber"
                        header="Phone Number"
                        class="flex items-center">
                        <template #body="{ data }">
                            <span class="ml-2">{{ data.phoneNumber }}</span>
                            <!-- <Icon icon="logos:whatsapp-icon" width="26" class="ms-3" /> -->
                        </template>
                    </Column>

                    <Column field="created" header="Requested At" />

                    <Column field="status" header="Status" />

                    <Column
                        field="totalMembers"
                        header="Total Members"
                        sortable />

                    <Column
                        field="totalExtensions"
                        header="Total Extensions"
                        sortable />

                    <Column
                        field="id"
                        header="Actions"
                        frozen
                        alignFrozen="right"
                        class="flex items-center">
                        <template #body="{ data }">
                            <div class="relative inline-block text-left">
                                <!-- Dropdown Button -->
                                <button
                                    @click="(e) => toggleDropdown(e, data.id)"
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
                                                :to="{ name: 'DetailOrganization', params: { id: data.id } }"
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
                contact: `${selectedOrganization.primaryContactFullName} / ${selectedOrganization.primaryContactPhoneNumber}`,
                email: 'N/A',
                requestedAt: formatDate(selectedOrganization.createdAt),
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
                contact: `${selectedOrganization.primaryContactFullName} / ${selectedOrganization.primaryContactPhoneNumber}`,
                email: 'N/A',
                requestedAt: formatDate(selectedOrganization.createdAt),
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
