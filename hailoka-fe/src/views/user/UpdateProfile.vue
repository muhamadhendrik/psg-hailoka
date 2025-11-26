<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import DashboardUserLayout from "../../layouts/DashboardUserLayout.vue";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

import { Icon } from "@iconify/vue";
import { useMenuStore } from "../../stores/menu";
import { useAuthStore } from "../../stores/auth";
import {
    authService,
    type UpdateProfilePayload,
    type ChangePasswordPayload,
} from "../../services/authService";

// ====== Store & router ======
const menuStore = useMenuStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

// profile page → tidak perlu highlight menu admin tertentu
menuStore.setActiveMenu("");

// ====== State profile ======
const loading = ref(false);
const pageError = ref("");

const form = ref({
    name: "",
    email: "",
});

const lastUpdated = ref<string | null>(null);

const formattedLastUpdated = computed(() => {
    if (!lastUpdated.value) return "Not updated yet";
    const d = new Date(lastUpdated.value);
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ];
    const monthName = months[d.getMonth()];
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");

    return `${monthName} ${day}, ${year} - ${hh}:${mm}:${ss}`;
});

// ====== INIT ======
async function initProfile() {
    try {
        pageError.value = "";

        if (!authStore.initialized) {
            await authStore.fetchMe();
        }

        if (!authStore.user) {
            router.push({ name: "SignIn" });
            return;
        }

        form.value.name = authStore.user.name;
        form.value.email = authStore.user.email;

        const anyUser = authStore.user as any;
        lastUpdated.value = anyUser.updated_at || anyUser.updatedAt || null;
    } catch (err: any) {
        console.error("Init profile error:", err);
        pageError.value =
            err?.response?.data?.message || "Failed to load profile info.";
    }
}

// ====== UPDATE PROFILE ======
async function handleSubmit() {
    try {
        loading.value = true;
        pageError.value = "";

        const payload: UpdateProfilePayload = {
            name: form.value.name,
        };

        await authService.updateProfile(payload);
        await authStore.fetchMe();

        const anyUser = authStore.user as any;
        lastUpdated.value =
            anyUser?.updated_at || anyUser?.updatedAt || lastUpdated.value;

        toast.add({
            severity: "info",
            summary: "Success",
            detail: "Profile has been successfully updated.",
            group: "custom",
            life: 5000,
        });
    } catch (err: any) {
        console.error("Update profile error:", err);
        const msg = err?.response?.data?.message || "Failed to update profile.";
        pageError.value = msg;
        toast.add({
            severity: "error",
            summary: "Error",
            detail: msg,
            life: 5000,
        });
    } finally {
        loading.value = false;
    }
}

/* ============================================
CHANGE PASSWORD MODAL
   ============================================ */
const cpVisible = ref(false);
const cpLoading = ref(false);
const cpError = ref("");

const cpForm = ref({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
});

// show / hide password
const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const isCpValid = computed(() => {
    return (
        cpForm.value.currentPassword.trim().length > 0 &&
        cpForm.value.newPassword.trim().length >= 8 &&
        cpForm.value.confirmPassword.trim().length >= 8 &&
        cpForm.value.newPassword === cpForm.value.confirmPassword
    );
});

function openChangePassword() {
    cpVisible.value = true;
    cpError.value = "";
    cpForm.value = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
    showCurrent.value = false;
    showNew.value = false;
    showConfirm.value = false;
}

function closeChangePassword() {
    if (cpLoading.value) return;
    cpVisible.value = false;
}

async function submitChangePassword() {
    if (!isCpValid.value) return;

    cpLoading.value = true;
    cpError.value = "";

    try {
        const payload: ChangePasswordPayload = {
            currentPassword: cpForm.value.currentPassword,
            newPassword: cpForm.value.newPassword,
            confirmNewPassword: cpForm.value.confirmPassword, // mapping ke BE
        };

        await authService.changePassword(payload);

        toast.add({
            severity: "success",
            summary: "Change Password",
            detail: "Password has been successfully changed.",
            group: "custom", // ✅ WAJIB sama dengan Toast
            life: 5000,
        });

        cpVisible.value = false;
    } catch (err: any) {
        console.error("Change password error:", err?.response?.data || err);

        const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to change password.";

        cpError.value = msg;

        toast.add({
            severity: "error",
            summary: "Change Password Failed",
            detail: msg,
            group: "custom", // ✅ pakai group yang sama
            life: 5000,
        });
    } finally {
        cpLoading.value = false;
    }
}

onMounted(() => {
    initProfile();
});
</script>

<template>
    <DashboardUserLayout>
        <div
            class="bg-white rounded-2xl shadow-sm p-6 w-full max-w-2xl mx-auto space-y-6">
            <!-- Header -->
            <div class="flex justify-between items-center">
                <p class="text-gray-400 text-xs sm:text-sm">
                    Last update - {{ formattedLastUpdated }}
                </p>

                <Button
                    :loading="loading"
                    severity="secondary"
                    class="flex! rounded-3xl! justify-between!"
                    @click="handleSubmit">
                    <Icon
                        icon="material-symbols:save-outline"
                        width="22"
                        height="22" />
                    <span class="me-2">Save</span>
                </Button>
            </div>

            <h2 class="font-semibold text-lg">Profile Info</h2>
            <hr class="border-gray-300" />

            <p v-if="pageError" class="text-sm text-red-500 mb-2">
                {{ pageError }}
            </p>

            <!-- Form -->
            <form class="space-y-5" @submit.prevent="handleSubmit">
                <!-- Name -->
                <div>
                    <label
                        for="name"
                        class="block text-gray-700 font-medium mb-2">
                        Full Name <span class="text-red-500">*</span>
                    </label>
                    <InputText
                        id="name"
                        v-model="form.name"
                        class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                        placeholder="Enter full name"
                        required />
                </div>

                <!-- Account Info -->
                <div class="space-y-3 pt-4">
                    <h2 class="font-semibold text-lg">Account Info</h2>
                    <hr class="border-gray-300" />
                    <p class="text-gray-700 text-sm max-w-xl">
                        {{ form.email || "email@example.com" }}
                    </p>

                    <!-- BUTTON CHANGE PASSWORD (dengan icon kunci) -->
                    <Button
                        type="button"
                        outlined
                        class="!rounded-full !px-5 !py-2 !text-sky-500 !border-sky-300 hover:!bg-sky-50 flex items-center gap-2"
                        @click="openChangePassword">
                        <Icon icon="mdi:lock-outline" width="18" height="18" />
                        <span>Change Password</span>
                    </Button>
                </div>
            </form>
        </div>

        <!-- Toast -->
        <Toast position="top-right" group="custom">
            <template #message="{ message }">
                <div
                    class="flex items-center gap-3 text-gray-800 px-4 py-3 shadow-sm border border-sky-200 bg-white rounded-md">
                    <Icon icon="bi:check-circle" width="38" height="38" />
                    <div>
                        <p class="font-medium text-sm">
                            {{ message.summary }}
                        </p>
                        <p class="text-sm">{{ message.detail }}</p>
                    </div>
                </div>
            </template>
        </Toast>

        <!-- ======================================
             CHANGE PASSWORD MODAL (Figma-style)
             ====================================== -->
        <Dialog
            v-model:visible="cpVisible"
            modal
            :closable="false"
            :draggable="false"
            :style="{ width: '520px', maxWidth: '95vw' }"
            contentClass="p-0">
            <!-- Overlay sudah otomatis oleh Dialog -->
            <div
                class="rounded-2xl border border-sky-300 bg-white shadow-lg overflow-hidden">
                <!-- Header -->
                <div
                    class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                    <h3 class="font-semibold text-base">Change Password</h3>
                    <button
                        type="button"
                        class="text-gray-500 hover:text-gray-700"
                        @click="closeChangePassword">
                        <Icon icon="mdi:close" class="w-5 h-5" />
                    </button>
                </div>

                <!-- Body -->
                <div class="px-5 py-4 space-y-4">
                    <!-- Current password -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1">
                            Current Password <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <InputText
                                v-model="cpForm.currentPassword"
                                :type="showCurrent ? 'text' : 'password'"
                                class="w-full pr-10 rounded-full!"
                                placeholder="Input current password" />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                @click="showCurrent = !showCurrent">
                                <Icon
                                    :icon="
                                        showCurrent
                                            ? 'mdi:eye-off-outline'
                                            : 'mdi:eye-outline'
                                    "
                                    class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <!-- New password -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1">
                            New Password <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <InputText
                                v-model="cpForm.newPassword"
                                :type="showNew ? 'text' : 'password'"
                                class="w-full pr-10 rounded-full!"
                                placeholder="Input new password" />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                @click="showNew = !showNew">
                                <Icon
                                    :icon="
                                        showNew
                                            ? 'mdi:eye-off-outline'
                                            : 'mdi:eye-outline'
                                    "
                                    class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <!-- Confirm password -->
                    <div>
                        <label
                            class="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                            <span class="text-red-500">*</span>
                        </label>
                        <div class="relative">
                            <InputText
                                v-model="cpForm.confirmPassword"
                                :type="showConfirm ? 'text' : 'password'"
                                class="w-full pr-10 rounded-full!"
                                placeholder="Input confirm new password" />
                            <button
                                type="button"
                                class="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                @click="showConfirm = !showConfirm">
                                <Icon
                                    :icon="
                                        showConfirm
                                            ? 'mdi:eye-off-outline'
                                            : 'mdi:eye-outline'
                                    "
                                    class="w-5 h-5" />
                            </button>
                        </div>
                        <p
                            v-if="
                                cpForm.confirmPassword &&
                                cpForm.confirmPassword !== cpForm.newPassword
                            "
                            class="text-xs text-red-500 mt-1">
                            Password confirmation does not match.
                        </p>
                    </div>

                    <p v-if="cpError" class="text-xs text-red-500">
                        {{ cpError }}
                    </p>
                </div>

                <!-- Footer -->
                <div
                    class="px-5 py-4 border-t border-gray-200 flex justify-end">
                    <Button
                        :disabled="!isCpValid || cpLoading"
                        :loading="cpLoading"
                        class="!rounded-full !px-6 flex items-center gap-2 bg-sky-500 border-sky-500 hover:!bg-sky-600"
                        @click="submitChangePassword">
                        <Icon icon="mdi:lock-outline" class="w-4 h-4" />
                        <span>Change Password</span>
                    </Button>
                </div>
            </div>
        </Dialog>
        <Toast position="top-right" group="custom">
            <template #message="{ message }">
                <div
                    class="flex items-center gap-3 px-4 py-3 rounded-md shadow-sm border bg-white"
                    :class="
                        message.severity === 'error'
                            ? 'border-red-200'
                            : 'border-sky-200'
                    ">
                    <Icon
                        :icon="
                            message.severity === 'error'
                                ? 'mdi:alert-circle-outline'
                                : 'bi:check-circle'
                        "
                        class="w-7 h-7"
                        :class="
                            message.severity === 'error'
                                ? 'text-red-500'
                                : 'text-sky-500'
                        " />
                    <div class="flex flex-col">
                        <p class="font-medium text-sm text-gray-900">
                            {{ message.summary }}
                        </p>
                        <p class="text-sm text-gray-700">
                            {{ message.detail }}
                        </p>
                    </div>
                </div>
            </template>
        </Toast>
    </DashboardUserLayout>
</template>
