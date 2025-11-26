<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DashboardUserLayout from '../../../layouts/DashboardUserLayout.vue';
import { Button, InputText, useToast } from 'primevue';
import Dropdown from "primevue/dropdown";
import { Icon } from '@iconify/vue';
import { useMenuStore } from '../../../stores/menu';
import { useRoute, useRouter } from 'vue-router';
import { staffServices } from '../../../services/staffService';
import Toast from "primevue/toast";


const menuStore = useMenuStore();
menuStore.setActiveMenu('/admin/staffs');

const route = useRoute()
const organizationId = route.params.organizationId
const userId = route.params.userId

const form = ref({
  userId: userId,
  name: '',
  email: '',
  organizationId: organizationId,
  roleId: null,
  extensions: []
})

const roles = [
  {
    label: 'Owner',
    value: 2,
    description: 'Full access, can manage everything.'
  },
  {
    label: 'Staff',
    value: 4,
    description: 'Can take actions only on assigned extensions.'
  },
  {
    label: 'Inspector',
    value: 3,
    description: 'Read-only, can view but not edit.'
  }
]

const router = useRouter();
const toast = useToast();

const loading = ref(false)
const error = ref("")

async function fetchStaffs() {
  try {
    loading.value = true;
    error.value = "";

    const response = await staffServices.getStaffByUserId(organizationId as string, userId as string )

    console.log("response >>> ", response.data);

    // staffList.value = response.data.staffs

    form.value.name = response.data.staff.user_name
    form.value.email = response.data.staff.user_email
    form.value.roleId = response.data.staff.roleId


  } catch (err: any) {

    console.error("Error fetching staff:", err);
    error.value = err.response?.data?.message || "Failed to fetch staff.";

  } finally {

    loading.value = false;

  }
}

onMounted(fetchStaffs)


// const loading = ref(false)

const handleSubmit = async () => {

  loading.value = true

  console.log("form.value >>> ", form.value);
  

  const res = await staffServices.updateStaff(form.value)

  if (res.status == 200) {

    toast.add({
        severity: "info",
        summary: "Success",
        detail: 'Staff has been successdully updated',
        group: "custom",
        life: 100000,
    });
    
    setTimeout(() =>  router.push({ name: "ListStaffs", params: { organizationId } }), 3000);
  }
  
  loading.value = false
}

</script>


<template>
    <DashboardUserLayout>

        <div class="bg-white rounded-2xl shadow-sm p-6 w-full mx-auto space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">

            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-3">
                <Icon icon="weui:back-filled" width="12" height="24" />
                <span>Edit Staff</span>
            </h2>

            <Button label="Custom Icon" @click="handleSubmit" severity="secondary" class="flex! rounded-3xl! justify-between!">
                <Icon icon="material-symbols:save-outline" width="22" height="22" />
                <span class="me-2">Save</span>
            </Button>
            </div>

            <hr class="border-gray-400" />

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Name -->
                <div>
                    <label for="name" class="block text-gray-700 font-medium mb-2">
                        Name <span class="text-red-500">*</span>
                    </label>
                    <InputText
                        id="name"
                        v-model="form.name"
                        class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                        placeholder="Enter name"
                        required
                    />
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-gray-700 font-medium mb-2">
                    Email <span class="text-red-500">*</span>
                    </label>
                    <InputText
                        id="email"
                        v-model="form.email"
                        type="email"
                        class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                        placeholder="Enter email"
                        required
                    />
                </div>

                <!-- Role -->
                <div>
                    <label for="role" class="block text-gray-700 font-medium mb-2">
                        Role <span class="text-red-500">*</span>
                    </label>
                    <Dropdown
                        id="role"
                        v-model="form.roleId"
                        :options="roles"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select a role"
                        class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                    >
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-gray-800">{{ slotProps.option.label }}</span>
                                <span class="text-sm text-cyan-600">{{ slotProps.option.description }}</span>
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </form>
        </div>

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
       
    </DashboardUserLayout>
</template>