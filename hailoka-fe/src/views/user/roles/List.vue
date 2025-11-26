<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import DashboardUserLayout from "../../../layouts/DashboardUserLayout.vue";
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
import { roleServices } from "../../../services/roleService";
import ConfirmDeleteRole from "../../../components/dashboard/role/ConfirmDeleteRole.vue";
import Toast from "primevue/toast";

const toast = useToast();

const route = useRoute();
const organizationId = route.params.organizationId;

const router = useRouter();

const menuStore = useMenuStore();
menuStore.setActiveMenu(`/admin/${organizationId}/roles`);

const openDropdown = ref<string | null>(null);

let prevTd: HTMLElement | null = null;

function toggleDropdown(e: MouseEvent, id: string) {
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

const loading = ref(false);
const error = ref("");

interface Role {
    id: number;
    name: string;
}

const roleList = ref<Role[]>([]);
const searchQuery = ref("");

async function fetchRoles() {
    try {
        loading.value = true;
        error.value = "";

        const response = await roleServices.getAllRoles();

        // Handle both wrapped and unwrapped responses
        const raw: any = response.data;
        roleList.value = Array.isArray(raw) ? raw : raw?.data || raw?.roles || [];
    } catch (err: any) {
        console.error("Error fetching roles:", err);
        error.value = err.response?.data?.message || "Failed to fetch roles.";
    } finally {
        loading.value = false;
    }
}

onMounted(fetchRoles);

const showDialog = ref(false);

const roleId = ref("");
const roleName = ref("");

function confirmDelete(idSelected: string, nameSelected: string) {
    roleId.value = idSelected;
    roleName.value = nameSelected;
    showDialog.value = true;
}

async function handleDelete() {
    loading.value = true;

    const res = await roleServices.deleteRole(roleId.value);

    if (res.status == 200) {
        toast.add({
            severity: "info",
            summary: "Success",
            detail: "Role has been successfully deleted",
            group: "custom",
            life: 100000,
        });

        setTimeout(() => fetchRoles(), 3000);
    }

    loading.value = false;
    showDialog.value = false;
}

const filteredRoles = computed(() => {
    if (!searchQuery.value.trim()) {
        return roleList.value;
    }
    const query = searchQuery.value.toLowerCase();
    return roleList.value.filter(
        (role) => role.name.toLowerCase().includes(query)
    );
});
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
                    v-model="searchQuery"
                    placeholder="Search"
                    class="w-full rounded-full pl-10" />
            </IconField>

            <!-- Button -->
            <div class="w-full sm:w-auto sm:flex sm:justify-end">
                <RouterLink
                    :to="{ name: 'FormAddRole', params: { organizationId } }"
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
                    :value="filteredRoles"
                    scrollable
                    tableStyle="min-width: 800px; white-space: nowrap;"
                    sortMode="single"
                    paginator
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}">
                    <!-- Name column -->
                    <Column field="name" :frozen="true" sortable>
                        <template #sorticon="{ sortOrder }">
                            <div
                                class="flex w-full items-center justify-between">
                                <span class="font-semibold">Name</span>

                                <span v-if="sortOrder === 1">
                                    <Icon
                                        icon="fluent:arrow-sort-up-lines-16-filled"
                                        width="20"
                                        height="20" />
                                </span>
                                <span v-else-if="sortOrder === -1">
                                    <Icon
                                        icon="fluent:arrow-sort-down-lines-16-filled"
                                        width="20"
                                        height="20" />
                                </span>
                                <span v-else>
                                    <Icon
                                        icon="solar:sort-outline"
                                        width="20"
                                        height="20" />
                                </span>
                            </div>
                        </template>
                    </Column>

                    <!-- Actions -->
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
                                    @click="
                                        (e) => toggleDropdown(e, String(data.id))
                                    "
                                    type="button"
                                    class="inline-flex items-center justify-center rounded border border-white px-2 py-1.5 hover:cursor-pointer hover:bg-gray-50 focus:border-gray-200 focus:ring-gray-200">
                                    <Icon
                                        icon="ph:dots-three-bold"
                                        width="20"
                                        height="20" />
                                </button>

                                <!-- Dropdown Menu -->
                                <div
                                    v-if="openDropdown === String(data.id)"
                                    class="absolute right-0 z-10 mt-2 w-40 rounded-md border border-gray-100 bg-white shadow-lg">
                                    <ul class="py-1 text-sm text-gray-700">
                                        <li>
                                            <button
                                                @click="
                                                    router.push({
                                                        name: 'FormEditRole',
                                                        params: {
                                                            organizationId:
                                                                organizationId,
                                                            roleId: data.id,
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
                                                        String(data.id),
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

        <ConfirmDeleteRole
            v-model:visible="showDialog"
            :roleName="roleName"
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

