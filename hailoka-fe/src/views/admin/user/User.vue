<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { ref, onMounted, computed } from "vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import DashboardLayout from '../../../layouts/DashboardLayout.vue';

import { IconField, InputText } from 'primevue';
import { useMenuStore } from '../../../stores/menu';
import { userService, type User } from '../../../services/userService';
import UserStatusDialog from '../../../components/dashboard/UserStatusDialog.vue';

const toast = useToast();
const menuStore = useMenuStore();
menuStore.setActiveMenu('/admin/user');

const loading = ref(false);
const error = ref("");
const users = ref<User[]>([]);

const items = computed(() => {
    return users.value.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        totalOrganization: 0, // API doesn't provide this
        status: user.suspended_at ? 0 : 1, // 1 = Active, 0 = Suspended
        lastActive: formatDate(user.created_at),
        suspended_at: user.suspended_at,
    }));
});

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

async function fetchUsers() {
    try {
        loading.value = true;
        error.value = "";

        const response = await userService.getAllUsers();
        users.value = response.data;
    } catch (err: any) {
        console.error("Error fetching users:", err);
        error.value = err.response?.data?.message || "Failed to fetch users.";
        
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

const openDropdown = ref<string | null>(null);

function toggleDropdown(id: string) {
  openDropdown.value = openDropdown.value === id ? null : id;
}

const showDialog = ref(false);
const selectedUser = ref<User | null>(null);
const updatingStatus = ref(false);

function suspense(row: any) {
  const user = users.value.find(u => u.id === row.id);
  if (user) {
    selectedUser.value = user;
    showDialog.value = true;
  }
}

async function handleSuspend() {
  if (!selectedUser.value) return;

  try {
    updatingStatus.value = true;
    const response = await userService.suspendUser(selectedUser.value.id);

    if (response.status === 200 || response.status === 201) {
      toast.add({
        severity: "success",
        summary: "User Suspended",
        detail: `User "${selectedUser.value.name}" has been suspended.`,
        group: "custom",
        life: 5000,
      });
      showDialog.value = false;
      selectedUser.value = null;
      // Refresh users data
      await fetchUsers();
    }
  } catch (err: any) {
    console.error("Error suspending user:", err);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.response?.data?.message || "Failed to suspend user.",
      group: "custom",
      life: 5000,
    });
  } finally {
    updatingStatus.value = false;
  }
}

async function activateUser(row: any) {
  const user = users.value.find(u => u.id === row.id);
  if (!user) return;

  try {
    updatingStatus.value = true;
    const response = await userService.activateUser(user.id);

    if (response.status === 200 || response.status === 201) {
      toast.add({
        severity: "success",
        summary: "User Activated",
        detail: `User "${user.name}" has been activated.`,
        group: "custom",
        life: 5000,
      });
      // Refresh users data
      await fetchUsers();
    }
  } catch (err: any) {
    console.error("Error activating user:", err);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.response?.data?.message || "Failed to activate user.",
      group: "custom",
      life: 5000,
    });
  } finally {
    updatingStatus.value = false;
  }
}

onMounted(fetchUsers);


</script>

<template>
  <DashboardLayout>

    <div class="bg-white border border-gray-200 rounded-md p-6 shadow mt-4">

        <IconField>
            <Icon icon="material-symbols:search" width="24" height="24" class="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <InputText placeholder="Search" class="w-full rounded-full!" />
        </IconField>

    </div>

    <div class="bg-white border border-gray-200 rounded-md p-6 shadow mt-4">
        <!-- <h2 class="text-lg font-semibold mb-4">Organizations To Review</h2>
        <p class="text-gray-400">These organizations are waiting for admin review before activation.</p> -->

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
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
          >

            <Column field="name" :frozen="true" sortable>

              <template #sorticon="{ sortOrder }">
                <div class="flex justify-between items-center w-full">
                  <span class="font-semibold">Name</span>

                  <span v-if="sortOrder === 1">
                    <Icon icon="fluent:arrow-sort-up-lines-16-filled" width="24" height="24" />
                  </span>
                  <span v-else-if="sortOrder === -1">
                      <Icon icon="fluent:arrow-sort-down-lines-16-filled" width="24" height="24" />
                  </span>
                  <span v-else>
                    <Icon icon="solar:sort-outline" width="24" height="24" />
                  </span>
                </div>
              </template>
            
            </Column>

            <Column field="email" header="Email"/>
            <Column field="totalOrganization" header="Total Organization"/>

            <Column field="status" header="Status" class="flex items-center">
              <template #body="{ data }">
                <span v-if="data.status == 1" class="ml-2 text-blue-500">Active</span>
                <span v-else class="ml-2 text-red-500">Suspended</span>
              </template>
            </Column>

            <Column field="lastActive" header="Last Active"/>
            <Column field="id" header="Actions" class="flex items-center">

              <template #body="{ data }">
                <div class="relative inline-block text-left">
                    <button 
                        @click="toggleDropdown(data.id)"
                        type="button" 
                        class="inline-flex justify-center py-1.5 px-3 rounded border border-white hover:cursor-pointer focus:ring-gray-200 focus:border-gray-200"
                    >
                        <Icon icon="ph:dots-three-bold" width="24" height="24" />
                    </button>

                    <div v-if="openDropdown === data.id" class="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-md shadow-lg z-10">
                        <ul class="py-1 text-sm text-gray-700">
                            <li v-if="data.status == 1">
                                <button @click="suspense(data)" class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                    Suspend
                                </button>
                            </li>
                            <li v-else>
                                <button @click="activateUser(data)" class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                    Activate
                                </button>
                            </li>
                            <li>
                                <RouterLink :to="{ name: 'DetailUser', params: { id: data.id } }" class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                    View Detail
                                </RouterLink>
                            </li>
                        </ul>
                    </div>

                </div>
              </template>
            </Column>

            <template #empty>
              <div class="flex flex-col items-center justify-center py-10 text-gray-500 h-[500px]">
                <i class="pi pi-inbox text-4xl mb-3"></i>
                <p class="text-sm font-medium">No records found</p>
                <p class="text-xs text-gray-400">Try adjusting your filters or add new data</p>
              </div>
            </template>

          </DataTable>               
        </div>

    </div>

    <UserStatusDialog
        v-if="selectedUser"
        :visible="showDialog"
        :user="{
            name: selectedUser.name,
            email: selectedUser.email,
            totalOrganizations: 0
        }"
        :isSuspend="true"
        @close="() => { showDialog = false; selectedUser = null; }"
        @confirm="handleSuspend"
        />

    <!-- <Toast /> -->

    <Toast position="top-right" group="custom">
      <template #message="{ message }">
        <div class="flex items-center gap-3 text-gray-800 px-4 py-3 shadow-sm border border-sky-200">
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

.p-datatable-header-cell:first-child{
  padding: 0 4px 0 0;
}

.p-datatable-header-cell:not(:first-child) {
  padding: 0 4px;
}

.p-datatable-header-cell:last-child{
  padding: 0 0 0 4px;
}

.p-datatable-column-header-content {
    padding: 10px;
    background-color: #F3F4F6;
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
