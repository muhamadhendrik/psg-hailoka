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
// import DialogConfirmDelete from '../../../components/dashboard/staff/DialogConfirmDelete.vue';
import Toast from "primevue/toast";
import { onMounted, ref } from "vue";
// import { extensionServices } from '../../../services/extensionService';
// import DialogExtConfirmDelete from '../../../components/dashboard/extension/DialogExtConfirmDelete.vue';
// import { extensionDummy } from '../../../data/extensions';
// import { extension_rules } from '../../../data/rules';
import ConfirmDeleteRule from "../../../components/dashboard/rule/ConfirmDeleteRule.vue";
import { extensionRuleServices } from "../../../services/extensionRuleService";

const toast = useToast();

const route = useRoute();
const organizationId = route.params.organizationId as string;

const router = useRouter();

const menuStore = useMenuStore();
menuStore.setActiveMenu(`/admin/${organizationId}/rules`);

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

// Create label mapping using dynamic object keys
const conditionLabels: Record<string, string> = {};
conditionLabels["always"] = "Always";
conditionLabels["busy"] = "When Busy";
conditionLabels["no_answer"] = "When No Answer";
conditionLabels["unreachable"] = "When Unreachable";

const timescopeLabels: Record<string, string> = {};
timescopeLabels["any"] = "Any Time";
timescopeLabels["work_hours"] = "Work Hours";
timescopeLabels["off_hours"] = "Off Hours";

interface Extention {
    id: string;
    name: string;
}

interface ExtensionRule {
    id: string;
    organization_id: string;
    extension: Extention;
    destination: Extention;
    timescope: "any" | "work_hours" | "off_hours"; // Defined as a union type based on ENUM options
    condition: "always" | "busy" | "no_answer" | "unreachable"; // Defined as a union type based on ENUM options
    created_by: string;
    created_at: string; // Assuming standard ISO date/time string
    updated_by: string | null;
    updated_at: string | null;
    deleted_by: string | null;
    deleted_at: string | null;
}

const extensionList = ref<ExtensionRule[]>([]);

async function fetchExtensionRule() {
    try {
        loading.value = true;
        error.value = "";
        const response = await extensionRuleServices.getExtensionRuleByOrg(
            organizationId
        );

        // const data = response.data.data;
        console.log("response >>> ", response.data.data);

        extensionList.value = response.data.data;
    } catch (err: any) {
        console.error("Error fetching staff:", err);
        // error.value = err.response?.data?.message || "Failed to fetch staff.";
    } finally {
        loading.value = false;
    }
}

onMounted(fetchExtensionRule);

const showDialog = ref(false);

const extIdSelected = ref("");
const extNameSelected = ref("");
const extDestination = ref("");
const rule = ref("");

function confirmDelete(
    extId: string,
    extName: string,
    extDestinationParam: string,
    ruleType: string
) {
    // close dropdown
    openDropdown.value = null;
    if (td) {
        td.style.zIndex = "";
        td.classList.remove("relative", "z-[9999]");
    }
    prevTd = null;

    extIdSelected.value = extId;
    extNameSelected.value = extName;
    extDestination.value = extDestinationParam;
    rule.value = ruleType;
    showDialog.value = true;
}

async function handleDelete() {
    const res = await extensionRuleServices.deleteExtensionRule(
        extIdSelected.value
    );

    if (res.status == 200) {
        toast.add({
            severity: "info",
            summary: "Success",
            detail: "Extension rule has been successdully deleted",
            group: "custom",
            life: 100000,
        });

        // fetchExtension()

        setTimeout(() => fetchExtensionRule(), 2000);
    }

    loading.value = false;
    showDialog.value = false;
}
</script>

<template>
    <DashboardUserLayout>
        <!-- TOP BAR: search + button -->
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
                    placeholder="Search Rule"
                    class="w-full rounded-full pl-10" />
            </IconField>

            <!-- Button -->
            <div class="w-full sm:w-auto sm:flex sm:justify-end">
                <RouterLink
                    :to="{
                        name: 'AddRulesExtension',
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

        <!-- TABLE WRAPPER: kasih horizontal scroll di mobile -->
        <div
            class="mt-4 rounded-md border border-gray-200 bg-white p-4 shadow overflow-x-auto">
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
                    <Column field="extension.name" header="Extention"></Column>

                    <Column field="condition" header="Rule Type">
                        <template #body="{ data }">
                            {{ conditionLabels[data.condition] }}
                        </template>
                    </Column>

                    <Column field="destination.name" header="Destination" />

                    <Column field="condition" header="Time Rule">
                        <template #body="{ data }">
                            {{ timescopeLabels[data.timescope] }}
                        </template>
                    </Column>

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
                                                        name: 'EditRulesExtension',
                                                        params: {
                                                            organizationId:
                                                                organizationId,
                                                            extRuleId: data.id,
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
                                                        data.extension.name,
                                                        data.destination.name,
                                                        timescopeLabels[
                                                            data.timescope
                                                        ] as string
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

        <ConfirmDeleteRule
            v-model:visible="showDialog"
            :extName="extNameSelected"
            :extDestination="extDestination"
            :rule="rule"
            @confirmDelete="handleDelete" />

        <Toast position="top-right" group="custom">
            <template #message="{ message }">
                <div
                    class="flex items-center gap-3 border border-sky-200 px-4 py-3 text-gray-800 shadow-sm">
                    <Icon icon="bi:check-circle" width="38" height="38" />
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
