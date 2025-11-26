<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import MainLayout from "../../../layouts/MainLayout.vue";
import { Icon } from "@iconify/vue";

import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";

import { organizationUserService } from "../../../services/organizationUser";
import { useAuthStore } from "../../../stores/auth";

// ====== Store & Router ======
const authStore = useAuthStore();
const router = useRouter();

// ====== Form state ======
const form = ref({
    fullName: "",
    whatsapp: "",
    orgName: "",
    totalMember: "",
    description: "",
    address: "",
    location: "",
});

const fieldErrors = reactive<{
    fullName: string;
    whatsapp: string;
    orgName: string;
    totalMember: string;
    description: string;
    address: string;
    location: string;
}>({
    fullName: "",
    whatsapp: "",
    orgName: "",
    totalMember: "",
    description: "",
    address: "",
    location: "",
});

const visible = ref(false);
const loading = ref(false);

// ---------- Validators ----------
function validateFullName() {
    const v = form.value.fullName.trim();
    fieldErrors.fullName = !v
        ? "Full name wajib diisi."
        : v.length < 3
        ? "Minimal 3 karakter."
        : "";
}

function validateWhatsapp() {
    const v = form.value.whatsapp.replace(/\D/g, ""); // digits only
    fieldErrors.whatsapp = !v
        ? "Nomor WhatsApp wajib diisi."
        : v.length < 9 || v.length > 15
        ? "Masukkan 9–15 digit angka."
        : "";
}

function validateOrgName() {
    fieldErrors.orgName = form.value.orgName.trim()
        ? ""
        : "Organization name wajib diisi.";
}

function validateTotalMember() {
    const n = Number(form.value.totalMember);
    fieldErrors.totalMember = !form.value.totalMember.trim()
        ? "Total member wajib diisi."
        : !Number.isInteger(n) || n < 1
        ? "Harus bilangan bulat ≥ 1."
        : "";
}

function validateDescription() {
    fieldErrors.description = form.value.description.trim()
        ? ""
        : "Description wajib diisi.";
}

function validateAddress() {
    fieldErrors.address = form.value.address.trim()
        ? ""
        : "Address wajib diisi.";
}

function validateLocation() {
    const v = form.value.location.trim();
    if (!v) {
        // optional field
        fieldErrors.location = "";
        return;
    }

    const parts = v.split(",").map((s) => s.trim());
    const lat = parseFloat(parts[0] ?? "");
    const lng = parseFloat(parts[1] ?? "");

    fieldErrors.location =
        parts.length !== 2 || Number.isNaN(lat) || Number.isNaN(lng)
            ? "Gunakan format: -6.2, 106.8"
            : "";
}

function validateAll() {
    validateFullName();
    validateWhatsapp();
    validateOrgName();
    validateTotalMember();
    validateDescription();
    validateAddress();
    validateLocation();
    return Object.values(fieldErrors).every((e) => !e);
}

const isFormValid = computed(() => {
    return (
        form.value.fullName.trim() &&
        form.value.whatsapp.trim() &&
        form.value.orgName.trim() &&
        form.value.totalMember.trim() &&
        form.value.description.trim() &&
        form.value.address.trim() &&
        !fieldErrors.fullName &&
        !fieldErrors.whatsapp &&
        !fieldErrors.orgName &&
        !fieldErrors.totalMember &&
        !fieldErrors.description &&
        !fieldErrors.address &&
        !fieldErrors.location
    );
});

// ---------- Logout ----------
async function handleLogout() {
    try {
        await authStore.logout();
        router.push({ name: "SignIn" });
    } catch (error: any) {
        console.error("Logout error:", error?.response?.data);
        alert(
            authStore.error ||
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Logout failed!"
        );
    }
}

// ---------- Submit ----------
async function handleSubmit() {
    if (!validateAll()) return;

    loading.value = true;

    try {
        // ✅ Tidak perlu token localStorage karena withCredentials sudah di service
        // Normalize WhatsApp -> +62-xxxxxxxx
        const onlyDigits = form.value.whatsapp.replace(/\D/g, "");
        let waNormalized: string;

        if (onlyDigits.startsWith("62")) {
            waNormalized = `+${onlyDigits.slice(0, 2)}-${onlyDigits.slice(2)}`;
        } else if (onlyDigits.startsWith("0")) {
            waNormalized = `+62-${onlyDigits.slice(1)}`;
        } else {
            waNormalized = `+62-${onlyDigits}`;
        }

        let latitude: number | null = null;
        let longitude: number | null = null;

        if (form.value.location.trim()) {
            const [latStr, lngStr] = form.value.location
                .split(",")
                .map((s) => s.trim());
            latitude = parseFloat(latStr || "");
            longitude = parseFloat(lngStr || "");
        }

        const payload = {
            name: form.value.orgName.trim(),
            total_member: Number(form.value.totalMember),
            description: form.value.description.trim(),
            address: form.value.address.trim(),
            latitude,
            longitude,
            primary_contact_full_name: form.value.fullName.trim(),
            primary_contact_phone_number: waNormalized,
            internal_notes: null,
        };

        const response = await organizationUserService.createOrganization(
            payload
        );
        console.log("✅ Organization created successfully:", response.data);

        visible.value = true;
    } catch (error: any) {
        console.error("❌ Error creating organization:", error);
        alert(
            error?.response?.data?.message || "Failed to create organization"
        );
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <MainLayout>
        <!-- Wrapper: mobile = 1 kolom, tablet/desktop = 2 kolom -->
        <section
            class="flex flex-col md:flex-row items-stretch min-h-screen w-full">
            <!-- Kiri: hidden di mobile, tampil mulai md -->
            <div
                class="hidden md:block md:w-1/2 lg:w-1/2 h-full bg-[url('/images/rectangle-blue.jpg')] bg-center bg-cover rounded-t-2xl md:rounded-s-2xl md:rounded-tr-none"></div>

            <!-- Kanan -->
            <div
                class="w-full md:w-1/2 lg:w-1/2 flex flex-col items-center lg:justify-between min-h-[100dvh] md:min-h-screen lg:h-full rounded-2xl md:rounded-e-2xl md:rounded-s-none relative lg:bg-white bg-gradient-to-t from-white from-20% via-white/40 to-transparent px-4 md:px-8 lg:px-8 py-4 md:py-8 lg:py-8">
                <!-- Top action (Logout) -->
                <div class="flex w-full justify-end">
                    <Button
                        severity="danger"
                        rounded
                        class="px-3! md:px-4! h-10 md:h-11"
                        @click="handleLogout">
                        <Icon
                            icon="bxs:log-out"
                            width="20"
                            height="20"
                            class="md:hidden" />
                        <Icon
                            icon="bxs:log-out"
                            width="24"
                            height="24"
                            class="hidden md:inline-block" />
                        <span class="hidden sm:inline ml-2">Logout</span>
                    </Button>
                </div>

                <!-- Content container -->
                <div
                    class="w-full max-w-2xl mx-auto md:p-4 lg:p-6 space-y-5 flex-1 flex">
                    <div class="flex flex-col justify-center w-full gap-2">
                        <RouterLink
                            to="/user-organizations"
                            class="font-semibold flex items-center gap-3 px-2 md:px-4">
                            <Icon
                                icon="icon-park-outline:left"
                                width="24"
                                height="24" />
                            Submit New Organization
                        </RouterLink>

                        <div class="p-2 md:p-4">
                            <!-- Contact Info -->
                            <div>
                                <h2
                                    class="text-sky-500 font-semibold mb-2 px-2 md:px-0">
                                    Contact Info
                                </h2>
                                <hr class="border-t-2 border-sky-200 mb-4" />

                                <div class="mb-4">
                                    <label
                                        class="block font-medium text-gray-700 mb-1 px-2 md:px-0">
                                        Full Name
                                        <span class="text-red-500">*</span>
                                    </label>
                                    <InputText
                                        v-model="form.fullName"
                                        @blur="validateFullName"
                                        :class="[
                                            'w-full',
                                            fieldErrors.fullName
                                                ? 'border-red-500!'
                                                : '',
                                        ]"
                                        placeholder="Input full name"
                                        class="rounded-full!" />
                                    <small
                                        v-if="fieldErrors.fullName"
                                        class="text-red-600 block mt-1 px-2 md:px-0">
                                        {{ fieldErrors.fullName }}
                                    </small>
                                </div>

                                <div class="mb-6">
                                    <label
                                        class="block font-medium text-gray-700 mb-1 px-2 md:px-0">
                                        Whatsapp Number
                                        <span class="text-red-500">*</span>
                                    </label>
                                    <InputGroup>
                                        <InputGroupAddon
                                            class="rounded-s-full!">
                                            +62
                                        </InputGroupAddon>
                                        <InputText
                                            v-model="form.whatsapp"
                                            @blur="validateWhatsapp"
                                            inputmode="numeric"
                                            placeholder="Phone number"
                                            :class="[
                                                fieldErrors.whatsapp
                                                    ? 'border-red-500!'
                                                    : '',
                                            ]"
                                            class="flex-1 border-0 rounded-e-full!" />
                                    </InputGroup>
                                    <small
                                        v-if="fieldErrors.whatsapp"
                                        class="text-red-600 block mt-1 px-2 md:px-0">
                                        {{ fieldErrors.whatsapp }}
                                    </small>
                                </div>
                            </div>

                            <!-- Organization Info -->
                            <div>
                                <h2
                                    class="text-sky-500 font-semibold mb-2 px-2 md:px-0">
                                    Organization Info
                                </h2>
                                <hr class="border-t-2 border-sky-200 mb-4" />

                                <div class="space-y-4">
                                    <div>
                                        <label
                                            class="block font-medium text-gray-700 mb-1 px-2 md:px-0">
                                            Organization Name
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <InputText
                                            v-model="form.orgName"
                                            @blur="validateOrgName"
                                            :class="[
                                                fieldErrors.orgName
                                                    ? 'border-red-500!'
                                                    : '',
                                            ]"
                                            placeholder="Input organization name"
                                            class="w-full rounded-full!" />
                                        <small
                                            v-if="fieldErrors.orgName"
                                            class="text-red-600 block mt-1 px-2 md:px-0">
                                            {{ fieldErrors.orgName }}
                                        </small>
                                    </div>

                                    <div>
                                        <label
                                            class="block font-medium text-gray-700 mb-1 px-2 md:px-0">
                                            Total Member
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <InputText
                                            v-model="form.totalMember"
                                            @blur="validateTotalMember"
                                            inputmode="numeric"
                                            :class="[
                                                fieldErrors.totalMember
                                                    ? 'border-red-500!'
                                                    : '',
                                            ]"
                                            placeholder="Input member"
                                            class="w-full rounded-full!" />
                                        <small
                                            v-if="fieldErrors.totalMember"
                                            class="text-red-600 block mt-1 px-2 md:px-0">
                                            {{ fieldErrors.totalMember }}
                                        </small>
                                    </div>

                                    <div>
                                        <label
                                            class="block font-medium text-gray-700 mb-1 px-2 md:px-0">
                                            Organization Description
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <InputText
                                            v-model="form.description"
                                            @blur="validateDescription"
                                            :class="[
                                                fieldErrors.description
                                                    ? 'border-red-500!'
                                                    : '',
                                            ]"
                                            placeholder="Input description"
                                            class="w-full rounded-full!" />
                                        <small
                                            v-if="fieldErrors.description"
                                            class="text-red-600 block mt-1 px-2 md:px-0">
                                            {{ fieldErrors.description }}
                                        </small>
                                    </div>

                                    <div>
                                        <label
                                            class="block font-medium text-gray-700 mb-1 px-2 md:px-0">
                                            Address
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <InputText
                                            v-model="form.address"
                                            @blur="validateAddress"
                                            :class="[
                                                fieldErrors.address
                                                    ? 'border-red-500!'
                                                    : '',
                                            ]"
                                            placeholder="Input address"
                                            class="w-full rounded-full!" />
                                        <small
                                            v-if="fieldErrors.address"
                                            class="text-red-600 block mt-1 px-2 md:px-0">
                                            {{ fieldErrors.address }}
                                        </small>
                                    </div>

                                    <div>
                                        <label
                                            class="block font-medium text-gray-700 mb-1 px-2 md:px-0">
                                            Location
                                        </label>
                                        <InputText
                                            v-model="form.location"
                                            @blur="validateLocation"
                                            :class="[
                                                fieldErrors.location
                                                    ? 'border-red-500!'
                                                    : '',
                                            ]"
                                            placeholder="Find location on Map (e.g., -6.2, 106.8)"
                                            class="w-full rounded-full!" />
                                        <small
                                            v-if="fieldErrors.location"
                                            class="text-red-600 block mt-1 px-2 md:px-0">
                                            {{ fieldErrors.location }}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <!-- Submit -->
                            <div class="mt-8">
                                <Button
                                    :disabled="loading || !isFormValid"
                                    class="w-full rounded-full! bg-gray-100! text-gray-600! border-0! hover:bg-gray-200! flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    @click="handleSubmit">
                                    <template v-if="loading">
                                        <Icon
                                            icon="line-md:loading-twotone-loop"
                                            class="text-xl animate-spin" />
                                        <span>Submitting...</span>
                                    </template>
                                    <template v-else>
                                        <span>Submit Organization</span>
                                    </template>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Dialog -->
        <Dialog
            v-model:visible="visible"
            modal
            :closable="true"
            class="rounded-2xl"
            :style="{ width: 'clamp(18rem, 80vw, 30rem)' }">
            <template #header>
                <div class="flex items-center gap-2 w-full">
                    <span class="text-lg font-semibold text-gray-800">
                        🎉 Organization Submitted Successfully
                    </span>
                </div>
            </template>

            <div
                class="border-t border-gray-200 pt-4 text-gray-700 leading-relaxed">
                Thank you for your submission. Our team will reach out to you
                shortly via email or WhatsApp.
            </div>

            <template #footer>
                <div class="w-full flex justify-end">
                    <Button
                        label="Got It"
                        class="bg-cyan-500! hover:bg-cyan-600! text-white font-medium rounded-full! px-6 py-2 shadow-none border-none"
                        @click="
                            router.push({ name: 'ListOrganizationUser' })
                        " />
                </div>
            </template>
        </Dialog>
    </MainLayout>
</template>
