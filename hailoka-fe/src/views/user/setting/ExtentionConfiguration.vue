<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import DashboardUserLayout from "../../../layouts/DashboardUserLayout.vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";
import { Icon } from "@iconify/vue";
import { useToast } from "primevue";
import Toast from "primevue/toast";

import { useOrganizationStore } from "../../../stores/organization";
import {
    extensionConfigurationService,
    type ExtensionConfiguration,
    type UpdateExtensionConfigurationPayload,
} from "../../../services/extensionConfigurationService";

const route = useRoute();
const router = useRouter();
const orgStore = useOrganizationStore();
const toast = useToast();

const organizationId = computed(() =>
    String(route.params.organizationId ?? "")
);

// data organisasi dari store
const organization = computed(() =>
    orgStore.getOrganizationById(organizationId.value)
);

const orgName = computed(() => organization.value?.name ?? "-");

// Form state
const form = ref<ExtensionConfiguration>({
    ring_timeout_seconds: 60,
    max_concurrent_calls: 1,
    is_record_a_call: false,
});

// Loading state
const loading = ref(false);
const saving = ref(false);
const error = ref("");

// Field errors
const fieldErrors = reactive<{
    ring_timeout_seconds: string;
    max_concurrent_calls: string;
}>({
    ring_timeout_seconds: "",
    max_concurrent_calls: "",
});

// Validators
function validateRingTimeout() {
    const value = Number(form.value.ring_timeout_seconds);
    if (!form.value.ring_timeout_seconds || isNaN(value)) {
        fieldErrors.ring_timeout_seconds = "Ring timeout is required";
    } else if (value < 1 || value > 300) {
        fieldErrors.ring_timeout_seconds =
            "Ring timeout must be between 1 and 300 seconds";
    } else {
        fieldErrors.ring_timeout_seconds = "";
    }
}

function validateMaxConcurrentCalls() {
    const value = Number(form.value.max_concurrent_calls);
    if (!form.value.max_concurrent_calls || isNaN(value)) {
        fieldErrors.max_concurrent_calls = "Max concurrent calls is required";
    } else if (value < 1 || value > 100) {
        fieldErrors.max_concurrent_calls =
            "Max concurrent calls must be between 1 and 100";
    } else {
        fieldErrors.max_concurrent_calls = "";
    }
}

function validateAll() {
    validateRingTimeout();
    validateMaxConcurrentCalls();
    return (
        !fieldErrors.ring_timeout_seconds && !fieldErrors.max_concurrent_calls
    );
}

// Fetch extension configuration
async function fetchExtensionConfiguration() {
    loading.value = true;
    error.value = "";

    try {
        const response =
            await extensionConfigurationService.getExtensionConfiguration(
                organizationId.value
            );

        // Handle both wrapped and unwrapped responses
        const raw: any = response.data;
        const config = (raw?.data || raw) as ExtensionConfiguration;

        form.value = {
            ring_timeout_seconds: config.ring_timeout_seconds || 60,
            max_concurrent_calls: config.max_concurrent_calls || 1,
            is_record_a_call: config.is_record_a_call || false,
        };
    } catch (err: any) {
        console.error("Error fetching extension configuration:", err);
        error.value =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to fetch extension configuration";

        // Use default values if error occurs
        form.value = {
            ring_timeout_seconds: 60,
            max_concurrent_calls: 1,
            is_record_a_call: false,
        };
    } finally {
        loading.value = false;
    }
}

// Save extension configuration
async function handleSave() {
    if (!validateAll() || saving.value) return;

    saving.value = true;
    error.value = "";

    try {
        const payload: UpdateExtensionConfigurationPayload = {
            ring_timeout_seconds: Number(form.value.ring_timeout_seconds),
            max_concurrent_calls: Number(form.value.max_concurrent_calls),
            is_record_a_call: form.value.is_record_a_call,
        };

        const response =
            await extensionConfigurationService.updateExtensionConfiguration(
                organizationId.value,
                payload
            );

        // Handle both wrapped and unwrapped responses
        const raw: any = response.data;
        const config = (raw?.data || raw) as ExtensionConfiguration;

        form.value = {
            ring_timeout_seconds: config.ring_timeout_seconds,
            max_concurrent_calls: config.max_concurrent_calls,
            is_record_a_call: config.is_record_a_call,
        };

        toast.add({
            severity: "success",
            summary: "Success",
            detail: "Extension configuration has been updated successfully",
            group: "custom",
            life: 5000,
        });
    } catch (err: any) {
        console.error("Error updating extension configuration:", err);
        error.value =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to update extension configuration";

        toast.add({
            severity: "error",
            summary: "Error",
            detail: error.value,
            group: "custom",
            life: 5000,
        });
    } finally {
        saving.value = false;
    }
}

function goBack() {
    router.back();
}

onMounted(async () => {
    if (!orgStore.initialized) {
        await orgStore.fetchOrganizations();
    }
    orgStore.setSelectedOrganization(organizationId.value);

    await fetchExtensionConfiguration();
});
</script>

<template>
    <DashboardUserLayout>
        <div class="w-full h-full">
            <!-- Card utama -->
            <section
                class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 lg:p-8 flex flex-col gap-6 h-full">
                <!-- PAGE HEADER -->
                <div
                    class="flex flex-col sm:flex-row justify-between sm:items-center py-5 border-b border-gray-300 gap-4 sm:gap-0">
                    <!-- Back Button with Title -->
                    <div class="flex items-center gap-4">
                        <Button
                            variant="link"
                            @click="goBack"
                            class="ps-0! text-black! flex items-center gap-2 text-xl font-semibold">
                            <Icon
                                icon="material-symbols:arrow-back-ios-rounded"
                                width="24"
                                height="24" />
                            <span>Extension Configuration</span>
                        </Button>
                    </div>

                    <!-- Save Button -->
                    <Button
                        label="Custom Icon"
                        :loading="saving"
                        :disabled="saving || loading"
                        @click="handleSave"
                        severity="secondary"
                        class="flex! rounded-3xl! justify-between!">
                        <Icon
                            icon="material-symbols:save-outline"
                            width="22"
                            height="22" />
                        <span class="me-2">Save</span>
                    </Button>
                </div>

                <!-- Organization Name -->
                <div class="space-y-1">
                    <h1 class="text-lg font-semibold text-gray-900">
                        {{ orgName }}
                    </h1>
                    <p class="text-sm text-gray-500">Setting</p>
                </div>

                <!-- Main Content -->
                <div class="space-y-6" v-if="!loading">
                    <!-- Ring Timeout -->
                    <div class="space-y-2">
                        <label
                            for="ring_timeout"
                            class="block text-sm font-medium text-gray-700">
                            Ring Timeout (in seconds)
                        </label>
                        <InputText
                            id="ring_timeout"
                            :value="String(form.ring_timeout_seconds)"
                            type="number"
                            min="1"
                            max="300"
                            @input="(e: any) => {
                                const val = e.target.value;
                                form.ring_timeout_seconds = val ? Number(val) : 0;
                            }"
                            @blur="validateRingTimeout"
                            class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                            :class="
                                fieldErrors.ring_timeout_seconds
                                    ? 'border-red-500!'
                                    : ''
                            "
                            required />
                        <p
                            v-if="fieldErrors.ring_timeout_seconds"
                            class="text-sm text-red-500">
                            {{ fieldErrors.ring_timeout_seconds }}
                        </p>
                        <p class="text-sm text-gray-500">
                            The maximum time in seconds a call will ring before
                            being redirected or dropped.
                        </p>
                    </div>

                    <!-- Max Concurrent Calls -->
                    <div class="space-y-2">
                        <label
                            for="max_concurrent"
                            class="block text-sm font-medium text-gray-700">
                            Max Concurrent Calls
                        </label>
                        <InputText
                            id="max_concurrent"
                            :value="String(form.max_concurrent_calls)"
                            type="number"
                            min="1"
                            max="100"
                            @input="(e: any) => {
                                const val = e.target.value;
                                form.max_concurrent_calls = val ? Number(val) : 0;
                            }"
                            @blur="validateMaxConcurrentCalls"
                            class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
                            :class="
                                fieldErrors.max_concurrent_calls
                                    ? 'border-red-500!'
                                    : ''
                            "
                            required />
                        <p
                            v-if="fieldErrors.max_concurrent_calls"
                            class="text-sm text-red-500">
                            {{ fieldErrors.max_concurrent_calls }}
                        </p>
                        <p class="text-sm text-gray-500">
                            Maximum number of calls this extension can handle at
                            the same time. Extra calls will be marked as Busy.
                        </p>
                    </div>

                    <!-- Call Recording -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">
                            Call Recording
                        </label>
                        <p class="text-sm text-gray-500">
                            Record all calls on this extension. Saved in Reports.
                        </p>
                        <div class="flex items-center gap-6 mt-3">
                            <div class="flex items-center gap-2">
                                <RadioButton
                                    inputId="record_no"
                                    name="call_recording"
                                    :value="false"
                                    v-model="form.is_record_a_call" />
                                <label
                                    for="record_no"
                                    class="text-sm text-gray-700 cursor-pointer">
                                    No
                                </label>
                            </div>
                            <div class="flex items-center gap-2">
                                <RadioButton
                                    inputId="record_yes"
                                    name="call_recording"
                                    :value="true"
                                    v-model="form.is_record_a_call" />
                                <label
                                    for="record_yes"
                                    class="text-sm text-gray-700 cursor-pointer">
                                    Yes
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Error Message -->
                    <p v-if="error" class="text-sm text-red-500 mt-4">
                        {{ error }}
                    </p>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex items-center justify-center py-10">
                    <p class="text-gray-500">Loading configuration...</p>
                </div>
            </section>
        </div>

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
