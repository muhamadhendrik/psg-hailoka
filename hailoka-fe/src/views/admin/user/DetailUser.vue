<script setup lang="ts">
import { Button, Divider } from "primevue";
import DashboardLayout from "../../../layouts/DashboardLayout.vue";
import { useMenuStore } from "../../../stores/menu";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { userService, type UserDetail } from "../../../services/userService";
import UserStatusDialog from "../../../components/dashboard/UserStatusDialog.vue";

const toast = useToast();
const route = useRoute();
const router = useRouter();

const menuStore = useMenuStore();
menuStore.setActiveMenu("/admin/user");

const userId = computed(() => route.params.id as string);

const loading = ref(false);
const error = ref("");
const user = ref<UserDetail | null>(null);

const showDialog = ref(false);
const updatingStatus = ref(false);

const statusLabel = computed(() => {
    if (!user.value) return "Unknown";
    return user.value.suspended_at ? "Suspended" : "Active";
});

const statusColor = computed(() => {
    if (!user.value) return "text-gray-500";
    return user.value.suspended_at ? "text-red-500" : "text-green-600";
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

async function fetchUser() {
    try {
        loading.value = true;
        error.value = "";

        const response = await userService.getUserById(userId.value);
        user.value = response.data;
    } catch (err: any) {
        console.error("Error fetching user:", err);
        error.value = err.response?.data?.message || "Failed to fetch user data.";
        
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

async function handleSuspend() {
    if (!user.value) return;

    try {
        updatingStatus.value = true;
        const response = await userService.suspendUser(user.value.id);

        if (response.status === 200 || response.status === 201) {
            toast.add({
                severity: "success",
                summary: "User Suspended",
                detail: `User "${user.value.name}" has been suspended.`,
                group: "custom",
                life: 5000,
            });
            showDialog.value = false;
            // Refresh user data
            await fetchUser();
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

async function handleActivate() {
    if (!user.value) return;

    try {
        updatingStatus.value = true;
        const response = await userService.activateUser(user.value.id);

        if (response.status === 200 || response.status === 201) {
            toast.add({
                severity: "success",
                summary: "User Activated",
                detail: `User "${user.value.name}" has been activated.`,
                group: "custom",
                life: 5000,
            });
            // Refresh user data
            await fetchUser();
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

function suspense() {
    showDialog.value = true;
}

const goBack = () => {
    router.back();
};

onMounted(fetchUser);
</script>

<template>
    <DashboardLayout>
        <div
            class="pt-1 pb-4 px-6 bg-white rounded-md shadow-sm border border-gray-100">
            <!-- Header -->
            <div
                class="flex justify-between border-b border-gray-500 items-center py-5">
                <Button
                    variant="link"
                    @click="goBack"
                    class="text-2xl! text-black! font-semibold! flex! items-center! ps-0!">
                    <Icon
                        icon="material-symbols:arrow-back-ios-rounded"
                        width="24"
                        height="24" />
                    <span v-if="user">Detail - {{ user.name }}</span>
                    <span v-else>Loading...</span>
                </Button>

                <Button
                    v-if="user && !user.suspended_at"
                    severity="danger"
                    rounded
                    @click="suspense"
                    class="pe-4!">
                    <Icon icon="clarity:power-solid" width="32" height="32" />
                    Suspend
                </Button>

                <Button
                    v-else-if="user && user.suspended_at"
                    severity="success"
                    rounded
                    @click="handleActivate"
                    class="pe-4!">
                    <Icon icon="lets-icons:check-fill" width="32" height="32" />
                    Activate
                </Button>
            </div>

            <!-- <Divider /> -->

            <!-- Profile Info -->

            <div v-if="loading" class="flex justify-center items-center py-10">
                <p class="text-gray-500">Loading user data...</p>
            </div>

            <div v-else-if="error" class="flex justify-center items-center py-10">
                <p class="text-red-500">{{ error }}</p>
            </div>

            <div v-else-if="user" class="space-y-6">
                <section>
                    <h3
                        class="text-gray-800 font-semibold mb-2 text-lg border-b py-4">
                        Profile Info
                    </h3>

                    <div class="space-y-6">
                        <div>
                            <p class="text-gray-500 font-medium">Name</p>
                            <p class="text-gray-900">{{ user.name }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 font-medium">Email</p>
                            <p class="text-gray-900">{{ user.email }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 font-medium">User Type</p>
                            <p class="text-gray-900 capitalize">{{ user.user_type }}</p>
                        </div>
                        <div>
                            <p class="text-gray-500 font-medium">Email Verified</p>
                            <p class="text-gray-900">{{ user.is_verified_email ? "Yes" : "No" }}</p>
                        </div>
                    </div>
                </section>

                <!-- Access Info -->
                <section v-if="user.organizations && user.organizations.length > 0">
                    <h3
                        class="text-gray-800 font-semibold mb-2 text-lg border-b pb-3">
                        Access Info
                    </h3>

                    <p class="text-gray-500 font-medium my-3">
                        Registered in Organization ({{
                            user.organizations.length
                        }})
                    </p>

                    <div
                        class="border border-gray-200 rounded-lg p-3 bg-gray-50 space-y-1">
                        <div
                            v-for="(org, index) in user.organizations"
                            :key="index"
                            class="text-gray-800 text-sm">
                            {{ org.name }} <span>({{ org.role }})</span>
                        </div>
                    </div>
                </section>

                <Divider />

                <!-- Status Info -->
                <section class="space-y-1">
                    <div>
                        <p class="text-sm text-gray-500 font-medium">Status</p>
                        <p
                            class="font-medium"
                            :class="statusColor">
                            {{ statusLabel }}
                        </p>
                    </div>

                    <div>
                        <p class="text-sm text-gray-500 font-medium">
                            Created At
                        </p>
                        <p class="text-gray-700">{{ formatDate(user.created_at) }}</p>
                    </div>

                    <div v-if="user.suspended_at">
                        <p class="text-sm text-gray-500 font-medium">
                            Suspended At
                        </p>
                        <p class="text-gray-700">{{ formatDate(user.suspended_at) }}</p>
                    </div>
                </section>
            </div>
        </div>

        <UserStatusDialog
            v-if="user"
            :visible="showDialog"
            :user="{
                name: user.name,
                email: user.email,
                totalOrganizations: user.organizations?.length || 0
            }"
            :isSuspend="true"
            @close="showDialog = false"
            @confirm="handleSuspend" />

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
