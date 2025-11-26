<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import MainLayout from "../../layouts/MainLayout.vue";
import { Icon } from "@iconify/vue";
import { authService } from "../../services/authService";

// ===== State =====
const showPassword = ref(false);
const isSuccessRegister = ref(false);
const isLoading = ref(false);

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const error = ref("");
const success = ref("");

// field-level errors
const fieldErrors = reactive<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
});

// ===== Validators =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName() {
    if (!name.value.trim()) fieldErrors.name = "Full name wajib diisi.";
    else if (name.value.trim().length < 3)
        fieldErrors.name = "Minimal 3 karakter.";
    else fieldErrors.name = "";
}

function validateEmail() {
    if (!email.value.trim()) fieldErrors.email = "Email wajib diisi.";
    else if (!emailRegex.test(email.value.trim()))
        fieldErrors.email = "Format email tidak valid.";
    else fieldErrors.email = "";
}

function validatePassword() {
    if (!password.value.trim()) fieldErrors.password = "Password wajib diisi.";
    else if (password.value.length < 6)
        fieldErrors.password = "Minimal 6 karakter.";
    else fieldErrors.password = "";
}

function validateConfirmPassword() {
    if (!confirmPassword.value.trim())
        fieldErrors.confirmPassword = "Konfirmasi password wajib diisi.";
    else if (confirmPassword.value !== password.value)
        fieldErrors.confirmPassword = "Password tidak sama.";
    else fieldErrors.confirmPassword = "";
}

function validateAll() {
    validateName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    return (
        !fieldErrors.name &&
        !fieldErrors.email &&
        !fieldErrors.password &&
        !fieldErrors.confirmPassword
    );
}

const isFormValid = computed(() => {
    return (
        name.value.trim() !== "" &&
        email.value.trim() !== "" &&
        password.value.trim() !== "" &&
        confirmPassword.value.trim() !== "" &&
        !fieldErrors.name &&
        !fieldErrors.email &&
        !fieldErrors.password &&
        !fieldErrors.confirmPassword
    );
});

// ===== Submit =====
async function handleRegister() {
    if (!validateAll() || isLoading.value) return;

    error.value = "";
    success.value = "";
    isLoading.value = true;

    try {
        await authService.register({
            name: name.value.trim(),
            email: email.value.trim(),
            password: password.value,
            confirmPassword: confirmPassword.value,
            userType: "user",
        });

        success.value = "Registration successful!";
        isSuccessRegister.value = true;

        // optional: reset form
        name.value = "";
        email.value = "";
        password.value = "";
        confirmPassword.value = "";
    } catch (err: any) {
        error.value = err?.response?.data?.error || "Registration failed!";
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <MainLayout>
        <!-- Wrapper responsif: mobile 1 kolom, tablet/desktop 2 kolom -->
        <section
            class="flex min-h-screen w-full flex-col items-stretch md:flex-row">
            <!-- Kolom kiri: hidden di mobile, tampil mulai md -->
            <div
                class="hidden h-full md:block md:w-1/2 lg:w-1/2 bg-[url('/images/rectangle-blue.jpg')] bg-cover bg-center md:rounded-s-2xl md:rounded-tr-none"></div>

            <!-- Kolom kanan -->
            <div
                class="flex h-full w-full flex-col items-center bg-white px-6 py-10 md:w-1/2 md:px-10 md:py-14 lg:w-1/2 lg:justify-between lg:px-28 lg:py-16 md:rounded-e-2xl">
                <!-- ilustrasi saat form -->
                <img
                    v-if="!isSuccessRegister"
                    src="/images/phone-cloud.png"
                    class="w-32 md:w-40 lg:w-48 mb-4 md:mb-6"
                    alt="Cloud VoIP Illustration" />

                <!-- FORM -->
                <div
                    v-if="!isSuccessRegister"
                    class="flex w-full flex-col gap-2 px-1 md:px-4">
                    <p class="text-xl font-semibold md:text-2xl">
                        Join Cloud VoIP
                    </p>
                    <p class="text-sm text-gray-600 md:text-base">
                        Fill in the details below to create your account.
                    </p>

                    <!-- alert global -->
                    <p
                        v-if="error"
                        class="mt-2 text-sm text-red-600"
                        role="alert">
                        {{ error }}
                    </p>
                    <p
                        v-if="success"
                        class="mt-2 text-sm text-green-600"
                        role="status">
                        {{ success }}
                    </p>

                    <form
                        class="mt-4"
                        @submit.prevent="handleRegister"
                        novalidate>
                        <!-- Name -->
                        <div class="mb-4">
                            <label
                                for="name"
                                class="mb-2 block text-sm font-medium text-gray-900">
                                Full Name <span class="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                autocomplete="off"
                                v-model.trim="name"
                                @blur="validateName"
                                :aria-invalid="!!fieldErrors.name"
                                :aria-describedby="
                                    fieldErrors.name ? 'name-error' : undefined
                                "
                                class="block w-full rounded-3xl border bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-cyan-500"
                                :class="
                                    fieldErrors.name
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-cyan-500'
                                "
                                required />
                            <small
                                v-if="fieldErrors.name"
                                id="name-error"
                                class="mt-1 block text-xs text-red-600">
                                {{ fieldErrors.name }}
                            </small>
                        </div>

                        <!-- Email -->
                        <div class="mb-4">
                            <label
                                for="email"
                                class="mb-2 block text-sm font-medium text-gray-900">
                                Email <span class="text-red-600">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                autocomplete="off"
                                v-model.trim="email"
                                @blur="validateEmail"
                                :aria-invalid="!!fieldErrors.email"
                                :aria-describedby="
                                    fieldErrors.email
                                        ? 'email-error'
                                        : undefined
                                "
                                class="block w-full rounded-3xl border bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-cyan-500"
                                :class="
                                    fieldErrors.email
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-cyan-500'
                                "
                                required />
                            <small
                                v-if="fieldErrors.email"
                                id="email-error"
                                class="mt-1 block text-xs text-red-600">
                                {{ fieldErrors.email }}
                            </small>
                        </div>

                        <!-- Password -->
                        <label
                            for="password"
                            class="mb-2 block text-sm font-medium text-gray-900">
                            Password <span class="text-red-600">*</span>
                        </label>
                        <div class="relative mb-4">
                            <input
                                id="password"
                                name="password"
                                v-model="password"
                                autocomplete="off"
                                @blur="validatePassword"
                                :type="showPassword ? 'text' : 'password'"
                                :aria-invalid="!!fieldErrors.password"
                                :aria-describedby="
                                    fieldErrors.password
                                        ? 'password-error'
                                        : undefined
                                "
                                class="block w-full rounded-3xl border bg-gray-50 p-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-cyan-500"
                                :class="
                                    fieldErrors.password
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-cyan-500'
                                " />
                            <!-- Toggle -->
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-500 hover:text-gray-700"
                                @click="showPassword = !showPassword"
                                aria-label="Toggle password visibility">
                                <Icon
                                    v-if="!showPassword"
                                    icon="mdi:eye"
                                    class="h-5 w-5" />
                                <Icon
                                    v-else
                                    icon="mdi:eye-off"
                                    class="h-5 w-5" />
                            </button>
                        </div>
                        <small
                            v-if="fieldErrors.password"
                            id="password-error"
                            class="mb-2 block text-xs text-red-600">
                            {{ fieldErrors.password }}
                        </small>

                        <!-- Confirm Password -->
                        <label
                            for="confirmPassword"
                            class="mb-2 mt-1 block text-sm font-medium text-gray-900">
                            Confirm Password <span class="text-red-600">*</span>
                        </label>
                        <div class="relative mb-4">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                v-model="confirmPassword"
                                autocomplete="off"
                                @blur="validateConfirmPassword"
                                :type="showPassword ? 'text' : 'password'"
                                :aria-invalid="!!fieldErrors.confirmPassword"
                                :aria-describedby="
                                    fieldErrors.confirmPassword
                                        ? 'confirm-password-error'
                                        : undefined
                                "
                                class="block w-full rounded-3xl border bg-gray-50 p-2.5 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-cyan-500"
                                :class="
                                    fieldErrors.confirmPassword
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-cyan-500'
                                " />
                            <!-- Toggle -->
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-500 hover:text-gray-700"
                                @click="showPassword = !showPassword"
                                aria-label="Toggle password visibility">
                                <Icon
                                    v-if="!showPassword"
                                    icon="mdi:eye"
                                    class="h-5 w-5" />
                                <Icon
                                    v-else
                                    icon="mdi:eye-off"
                                    class="h-5 w-5" />
                            </button>
                        </div>
                        <small
                            v-if="fieldErrors.confirmPassword"
                            id="confirm-password-error"
                            class="mb-2 block text-xs text-red-600">
                            {{ fieldErrors.confirmPassword }}
                        </small>

                        <!-- Submit -->
                        <button
                            type="submit"
                            :disabled="!isFormValid || isLoading"
                            class="mt-2 inline-flex w-full items-center justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 cursor-pointer">
                            <span v-if="!isLoading"> Register Now </span>
                            <span v-else class="inline-flex items-center gap-2">
                                <svg
                                    class="h-4 w-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Processing...
                            </span>
                        </button>
                    </form>

                    <p class="mt-4 text-center text-sm text-gray-700">
                        Already have account?
                        <RouterLink
                            to="/admin/signin"
                            class="font-medium text-cyan-500 hover:underline">
                            Login Now
                        </RouterLink>
                    </p>
                </div>

                <!-- SUCCESS STATE -->
                <div
                    v-if="isSuccessRegister"
                    class="flex h-full w-full flex-col justify-center gap-3 px-1 md:px-4">
                    <h1 class="flex items-center gap-2 text-xl font-semibold">
                        <Icon
                            icon="mdi:check-circle"
                            class="h-6 w-6 text-green-500" />
                        Registration Success
                    </h1>

                    <p class="text-sm text-gray-700 md:text-base">
                        Your account has been successfully registered. You can
                        now login to your dashboard.
                    </p>

                    <RouterLink
                        to="/admin/signin"
                        class="mt-4 inline-flex w-full items-center justify-center rounded-3xl bg-cyan-500 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 cursor-pointer">
                        Go to Login
                    </RouterLink>
                </div>
            </div>
        </section>
    </MainLayout>
</template>
