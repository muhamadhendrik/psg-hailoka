<script setup lang="ts">
// import { onMounted, ref } from 'vue';
import DashboardUserLayout from "../../../layouts/DashboardUserLayout.vue";
// import { dummyStaffs } from '../../../data/organization';
import {
    Button,
    Column,
    DataTable,
    IconField,
    InputText,
    useToast,
} from "primevue";
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";
import { useMenuStore } from "../../../stores/menu";
// import { staffServices } from '../../../services/staffService';
// import DialogConfirmDelete from '../../../components/dashboard/staff/DialogConfirmDelete.vue';
import Toast from "primevue/toast";
import { onMounted, ref } from "vue";
import { extensionServices } from "../../../services/extensionService";
import DialogExtConfirmDelete from "../../../components/dashboard/extension/DialogExtConfirmDelete.vue";
// import { extensionDummy } from '../../../data/extensions';

const toast = useToast();

const route = useRoute();
const organizationId = route.params.organizationId as string;

const router = useRouter();

const menuStore = useMenuStore();
menuStore.setActiveMenu(`/admin/${organizationId}/extenstions`);

const openDropdown = ref<string | null>(null);

let prevTd: HTMLElement | null = null;

let td: HTMLElement | null = null;

function toggleDropdown(e: MouseEvent, id: string) {
    e.stopPropagation();

    // find the <td> element (two levels above the button)
    td = (e.currentTarget as HTMLElement).closest("td") as HTMLElement | null;
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

const loading = ref(false);
const error = ref("");

interface ExtenstionsTabbleList {
    id: string;
    name: string;
    operationHours: string;
    staffAssigned: string;
}

const extensionList = ref<ExtenstionsTabbleList[]>([]);

async function fetchExtension() {
    try {
        loading.value = true;
        error.value = "";
        const response = await extensionServices.getExtensionByOrg(
            organizationId
        );

        console.log("Full response:", response);
        console.log("Response data:", response.data);

        // Handle both wrapped and unwrapped responses
        const raw = response.data;
        const data = Array.isArray(raw) ? raw : raw?.data || [];
        
        console.log("Processed data:", data);

        if (!Array.isArray(data)) {
            console.error("Data is not an array:", data);
            error.value = "Invalid data format received from server";
            extensionList.value = [];
            return;
        }

        const dayMap: Record<number, string> = {
            0: "Sun",
            1: "Mon",
            2: "Tue",
            3: "Wed",
            4: "Thu",
            5: "Fri",
            6: "Sat",
            7: "Sat", // Some systems use 7 for Saturday
        };

        extensionList.value = data.map((ext: any) => {
            // Handle operational hours display
            let operationHours = "";

            if (ext.operational && Array.isArray(ext.operational) && ext.operational.length > 0) {
                // Filter out invalid entries and sort
                const validOps = ext.operational.filter(
                    (op: any) => op && typeof op.day_of_week === "number"
                );
                
                if (validOps.length > 0) {
                    const sortedOps = validOps.sort(
                        (a: any, b: any) => a.day_of_week - b.day_of_week
                    );

                    if (sortedOps.length === 7 || sortedOps.length === 6 && sortedOps.every((op: any) => op.day_of_week <= 6)) {
                        // All week or almost all week
                        const firstOp = sortedOps[0];
                        const timeStr = firstOp.start_time && firstOp.end_time
                            ? `${firstOp.start_time.slice(0, 5)} - ${firstOp.end_time.slice(0, 5)}`
                            : "24/7";
                        operationHours = `Sun - Sat, ${timeStr}`;
                    } else if (sortedOps.length > 1) {
                        const firstDay = dayMap[sortedOps[0].day_of_week] || `Day ${sortedOps[0].day_of_week}`;
                        const lastDay = dayMap[sortedOps[sortedOps.length - 1].day_of_week] || `Day ${sortedOps[sortedOps.length - 1].day_of_week}`;
                        const firstOp = sortedOps[0];
                        const timeStr = firstOp.start_time && firstOp.end_time
                            ? `${firstOp.start_time.slice(0, 5)} - ${firstOp.end_time.slice(0, 5)}`
                            : "All day";
                        operationHours = `${firstDay} - ${lastDay}, ${timeStr}`;
                    } else {
                        const onlyDay = dayMap[sortedOps[0].day_of_week] || `Day ${sortedOps[0].day_of_week}`;
                        const firstOp = sortedOps[0];
                        const timeStr = firstOp.start_time && firstOp.end_time
                            ? `${firstOp.start_time.slice(0, 5)} - ${firstOp.end_time.slice(0, 5)}`
                            : "All day";
                        operationHours = `${onlyDay}, ${timeStr}`;
                    }
                } else {
                    operationHours = "-";
                }
            } else {
                operationHours = "-";
            }

            // Handle assigned staff names - filter out null values
            let staffAssigned = "-";
            if (ext.assignedStaffUserModel && Array.isArray(ext.assignedStaffUserModel)) {
                const validStaff = ext.assignedStaffUserModel
                    .filter((s: any) => s && s.name)
                    .map((s: any) => s.name);
                
                if (validStaff.length > 0) {
                    staffAssigned = validStaff.join(", ");
                }
            }

            return {
                id: ext.id,
                name: ext.name || "-",
                operationHours,
                staffAssigned,
            };
        });

        console.log("Mapped extension list:", extensionList.value);
    } catch (err: any) {
        console.error("Error fetching extensions:", err);
        error.value = err.response?.data?.message || "Failed to fetch extensions.";
        extensionList.value = [];
        
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

onMounted(fetchExtension);

const showDialog = ref(false);

const extIdSelected = ref("");
const extNameSelected = ref("");

function confirmDelete(extId: string, extName: string) {
    // close dropdown
    openDropdown.value = null;
    if (td) {
        td.style.zIndex = "";
        td.classList.remove("relative", "z-[9999]");
    }
    prevTd = null;

    extIdSelected.value = extId;
    extNameSelected.value = extName;
    showDialog.value = true;
}

async function handleDelete() {
    const res = await extensionServices.deleteExtension(extIdSelected.value);

    if (res.status == 200) {
        toast.add({
            severity: "info",
            summary: "Success",
            detail: "Extension has been successdully deleted",
            group: "custom",
            life: 100000,
        });

        fetchExtension();

        setTimeout(() => fetchExtension(), 2000);
    }

    loading.value = false;
    showDialog.value = false;
}
</script>
<template>
    <DashboardUserLayout>
        <!-- TOP BAR: Search + Button -->
        <div
            class="mt-4 flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
            <!-- Search -->
            <IconField class="relative w-full sm:flex-1">
                <Icon
                    icon="material-symbols:search"
                    width="20"
                    height="20"
                    class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <InputText
                    placeholder="Search Extension"
                    class="w-full rounded-full pl-10" />
            </IconField>

            <!-- Button -->
            <div class="w-full sm:w-auto sm:flex sm:justify-end">
                <RouterLink
                    :to="{
                        name: 'FormAddExtension',
                        params: { organizationId },
                    }"
                    class="block w-full sm:w-auto">
                    <Button
                        label="Custom Icon"
                        severity="info"
                        class="!flex !w-full sm:!w-auto !items-center !justify-center sm:!justify-between !gap-2 !rounded-3xl">
                        <Icon icon="ic:baseline-plus" width="20" height="20" />
                        <span class="me-2">Add New</span>
                    </Button>
                </RouterLink>
            </div>
        </div>

        <!-- TABLE WRAPPER: horizontal scroll di mobile -->
        <div
            class="mt-4 overflow-x-auto rounded-md border border-gray-200 bg-white p-4 shadow">
            <div class="card space-y-4 min-w-full">
                <DataTable
                    :value="extensionList"
                    scrollable
                    tableStyle="min-width: 800px; white-space: nowrap;"
                    sortMode="single"
                    paginator
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}">
                    <Column field="name" header="Name" />

                    <Column field="operationHours" header="Operation Hours" />

                    <Column field="staffAssigned" header="Staff Assigned" />

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
                                    class="inline-flex items-center justify-center rounded border border-white px-2 py-1.5 hover:cursor-pointer hover:bg-gray-50 focus:border-gray-200 focus:ring-gray-200">
                                    <Icon
                                        icon="ph:dots-three-bold"
                                        width="20"
                                        height="20" />
                                </button>

                                <!-- Dropdown Menu -->
                                <div
                                    v-if="openDropdown === data.id"
                                    class="absolute right-0 z-10 mt-2 w-40 rounded-md border border-gray-100 bg-white shadow-lg">
                                    <ul class="py-1 text-sm text-gray-700">
                                        <li>
                                            <button
                                                @click="
                                                    router.push({
                                                        name: 'FormEditExtension',
                                                        params: {
                                                            organizationId:
                                                                organizationId,
                                                            extId: data.id,
                                                        },
                                                    })
                                                "
                                                class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                                Edit
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                @click="
                                                    confirmDelete(
                                                        data.id,
                                                        data.name
                                                    )
                                                "
                                                class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <template #empty>
                        <div
                            class="flex h-72 flex-col items-center justify-center py-10 text-gray-500">
                            <i class="pi pi-inbox mb-3 text-4xl"></i>
                            <p class="text-sm font-medium">No records found</p>
                            <p class="text-xs text-gray-400">
                                Try adjusting your filters or add new data
                            </p>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>

        <DialogExtConfirmDelete
            v-model:visible="showDialog"
            :extName="extNameSelected"
            @confirmDelete="handleDelete" />

        <Toast position="top-right" group="custom">
            <template #message="{ message }">
                <div
                    class="flex items-center gap-3 border px-4 py-3 text-gray-800 shadow-sm"
                    :class="
                        message.severity === 'error'
                            ? 'border-red-200 bg-red-50'
                            : 'border-sky-200'
                    ">
                    <Icon
                        :icon="
                            message.severity === 'error'
                                ? 'bi:x-circle'
                                : 'bi:check-circle'
                        "
                        width="38"
                        height="38"
                        :class="message.severity === 'error' ? 'text-red-500' : ''" />
                    <div>
                        <p class="text-sm font-medium">{{ message.summary }}</p>
                        <p class="text-sm">{{ message.detail }}</p>
                    </div>
                </div>
            </template>
        </Toast>
    </DashboardUserLayout>
</template>

<style>
/* Biar dropdown tetap kelihatan tapi table bisa scroll horizontal */
.p-datatable-table-container {
    overflow-x: auto !important;
    overflow-y: visible !important;
}
</style>
