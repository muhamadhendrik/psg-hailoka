<script setup lang="ts">
import { onMounted, ref } from "vue";
import DashboardUserLayout from "../../../layouts/DashboardUserLayout.vue";
import { Button, InputText, useToast } from "primevue";
import { Icon } from "@iconify/vue";
import { useMenuStore } from "../../../stores/menu";
import { useRoute, useRouter } from "vue-router";
import { roleServices } from "../../../services/roleService";
import Toast from "primevue/toast";

const menuStore = useMenuStore();
menuStore.setActiveMenu("/admin/roles");

const route = useRoute();
const organizationId = route.params.organizationId;
const roleId = route.params.roleId;

const form = ref({
    name: "",
});

const router = useRouter();
const toast = useToast();

const loading = ref(false);
const error = ref("");

async function fetchRole() {
    try {
        loading.value = true;
        error.value = "";

        const response = await roleServices.getRoleById(roleId as string);

        form.value.name = response.data.name;
    } catch (err: any) {
        console.error("Error fetching role:", err);
        error.value = err.response?.data?.message || "Failed to fetch role.";
        toast.add({
            severity: "error",
            summary: "Error",
            detail: error.value,
            group: "custom",
            life: 100000,
        });
    } finally {
        loading.value = false;
    }
}

onMounted(fetchRole);

const handleSubmit = async () => {
    loading.value = true;

    try {
        const res = await roleServices.updateRole(roleId as string, form.value);

        if (res.status == 200) {
            toast.add({
                severity: "info",
                summary: "Success",
                detail: "Role has been successfully updated",
                group: "custom",
                life: 100000,
            });

            setTimeout(
                () =>
                    router.push({
                        name: "RoleManagement",
                        params: { organizationId },
                    }),
                3000
            );
        }
    } catch (err: any) {
        console.error("Error updating role:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail:
                err.response?.data?.message || "Failed to update role.",
            group: "custom",
            life: 100000,
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <DashboardUserLayout>
        <div
            class="bg-white rounded-2xl shadow-sm p-6 w-full mx-auto space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <h2
                    class="text-lg font-semibold text-gray-800 flex items-center gap-3">
                    <Icon icon="weui:back-filled" width="12" height="24" />
                    <span>Edit Role</span>
                </h2>

                <Button
                    label="Custom Icon"
                    @click="handleSubmit"
                    :loading="loading"
                    severity="secondary"
                    class="flex! rounded-3xl! justify-between!">
                    <Icon
                        icon="material-symbols:save-outline"
                        width="22"
                        height="22" />
                    <span class="me-2">Save</span>
                </Button>
            </div>

            <hr class="border-gray-400" />

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Name -->
                <div>
                    <label
                        for="name"
                        class="block text-gray-700 font-medium mb-2">
                        Name <span class="text-red-500">*</span>
                    </label>
                    <InputText
                        id="name"
                        v-model="form.name"
                        class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                        placeholder="Enter role name"
                        required />
                </div>
            </form>
        </div>

        <Toast position="top-right" group="custom">
            <template #message="{ message }">
                <div
                    class="flex items-center gap-3 text-gray-800 px-4 py-3 shadow-sm border border-sky-200">
                    <Icon
                        :icon="
                            message.severity === 'error'
                                ? 'bi:x-circle'
                                : 'bi:check-circle'
                        "
                        width="38"
                        height="38" />
                    <div>
                        <p class="font-medium text-sm">{{ message.summary }}</p>
                        <p class="text-sm">{{ message.detail }}</p>
                    </div>
                </div>
            </template>
        </Toast>
    </DashboardUserLayout>
</template>

