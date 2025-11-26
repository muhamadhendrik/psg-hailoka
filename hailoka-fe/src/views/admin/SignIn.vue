<script lang="ts" setup>
declare const google: any;

import { ref, computed } from "vue";
import MainLayout from "../../layouts/MainLayout.vue";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

type GoogleCredentialResponse = {
    credential: string;
};

// =====================
// State
// =====================

const showPassword = ref(false);
const email = ref("");
const password = ref("");

const error = ref("");
const success = ref("");

// pattern "touched" untuk kontrol kapan error ditampilkan
const emailTouched = ref(false);
const passwordTouched = ref(false);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const router = useRouter();
const authStore = useAuthStore();

// =====================
// Computed derived state
// =====================

// trimming supaya tidak ngulang .trim()
const trimmedEmail = computed(() => email.value.trim());
const trimmedPassword = computed(() => password.value.trim());

// validasi berbasis computed (tanpa side effect)
const emailError = computed(() => {
    const value = trimmedEmail.value;

    if (!value) return "Email wajib diisi.";
    if (!emailRegex.test(value)) return "Format email tidak valid.";
    return "";
});

const passwordError = computed(() => {
    const value = trimmedPassword.value;

    if (!value) return "Password wajib diisi.";
    if (value.length < 6) return "Minimal 6 karakter.";
    return "";
});

// error yang ditampilkan (dikontrol dengan touched)
const showEmailError = computed(() => emailTouched.value && !!emailError.value);
const showPasswordError = computed(
    () => passwordTouched.value && !!passwordError.value
);

// form valid kalau tidak ada error + field terisi
const isFormValid = computed(
    () =>
        !!trimmedEmail.value &&
        !!trimmedPassword.value &&
        !emailError.value &&
        !passwordError.value
);

// loading dari store
const isSubmitting = computed(() => authStore.loading);

// Google helpers
const googleReady = computed(
    () => typeof google !== "undefined" && !!google?.accounts?.id
);

const googleClientId = computed(
    () => import.meta.env.VITE_GOOGLE_CLIENT_ID as string
);

// =====================
// Normal login
// =====================

async function handleLogin() {
    emailTouched.value = true;
    passwordTouched.value = true;

    if (!isFormValid.value) {
        error.value = "Mohon periksa kembali form login Anda.";
        return;
    }

    error.value = "";
    success.value = "";

    try {
        const response = await authStore.login({
            email: trimmedEmail.value,
            password: trimmedPassword.value,
        });

        // 🟢 DI SINI response = body JSON backend, contoh:
        // { message: "Login successful", user: {...} }

        console.log("Login response body:", response);
        console.log("Message:", response.message);
        console.log("User:", response.user);

        success.value = response.message;
        router.push({ name: "ListOrganizationUser" });
    } catch (err: any) {
        console.log("Login error raw:", err?.response?.data);
        error.value =
            authStore.error ||
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Login failed!";
    }
}

// =====================
// Google login
// =====================

const handleGoogleLogin = () => {
    if (!googleReady.value) {
        error.value = "Google SDK belum siap. Silakan coba lagi.";
        return;
    }

    error.value = "";
    success.value = "";

    google.accounts.id.initialize({
        client_id: googleClientId.value,
        callback: handleGoogleCredentialResponse,
    });

    google.accounts.id.prompt();
};

const handleGoogleCredentialResponse = async (
    response: GoogleCredentialResponse
) => {
    const idToken = response.credential;

    try {
        await authStore.loginWithGoogle(idToken);
        success.value = "Login with Google successful!";
        router.push({ name: "ListOrganizationUser" });
    } catch (err) {
        console.error("Google login failed:", err);
        error.value =
            authStore.error || "Google login failed. Please try again.";
    }
};
</script>

<template>
    <MainLayout>
        <!-- Left illustration (desktop only) -->
        <div
            class="hidden lg:block w-1/2 h-full bg-[url('/images/rectangle-blue.jpg')] bg-[length:1020px] bg-center rounded-s-2xl"></div>

        <!-- Right content -->
        <div
            class="flex flex-col justify-between items-center lg:items-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-16 py-8 sm:py-10 lg:py-16 rounded-e-2xl min-h-full lg:h-full bg-gradient-to-t from-white from-20% via-white/40 to-transparent lg:bg-white">
            <!-- Heading -->
            <div
                class="flex flex-col mx-auto justify-center items-center text-center max-w-md w-full">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                    Get Started
                </h1>
                <p class="mt-3 text-sm sm:text-base text-gray-700">
                    Connect your team and customers with enterprise-grade voice
                    solutions.
                </p>
            </div>

            <!-- Illustration -->
            <img
                src="/images/phone-cloud.png"
                alt="Phone Cloud"
                class="w-32 sm:w-40 lg:w-48 mt-8 lg:mt-0 mx-auto" />

            <!-- Form -->
            <div
                class="w-full max-w-md mt-8 lg:mt-12 pb-6 flex flex-col gap-2">
                <p class="font-semibold text-gray-800">Welcome back!</p>
                <p class="text-sm text-gray-600">
                    Please login using your already registered account.
                </p>

                <!-- alert global -->
                <p
                    v-if="error"
                    class="text-xs lg:text-sm text-red-600 mt-1"
                    role="alert">
                    {{ error }}
                </p>
                <p
                    v-if="success"
                    class="text-xs lg:text-sm text-green-600 mt-1"
                    role="status">
                    {{ success }}
                </p>

                <form
                    @submit.prevent="handleLogin"
                    novalidate
                    class="mt-2 space-y-2.5">
                    <!-- email -->
                    <div>
                        <label
                            for="email"
                            class="block mb-1 text-xs lg:text-sm font-medium text-gray-900">
                            Email
                            <span class="text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            autocomplete="on"
                            v-model.trim="email"
                            @blur="emailTouched = true"
                            :aria-invalid="!!emailError"
                            :aria-describedby="
                                showEmailError
                                    ? 'email-error'
                                    : undefined
                            "
                            class="bg-gray-50 border text-gray-900 text-xs lg:text-sm rounded-3xl focus:ring-cyan-500 focus:outline-none block w-full px-3 py-2"
                            :class="
                                showEmailError
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-cyan-500'
                            "
                            placeholder="name@domain.com" />
                        <small
                            v-if="showEmailError"
                            id="email-error"
                            class="mt-1 block text-[11px] text-red-600">
                            {{ emailError }}
                        </small>
                    </div>

                    <!-- password -->
                    <div>
                        <label
                            for="password"
                            class="block mb-1 text-xs lg:text-sm font-medium text-gray-900">
                            Password
                            <span class="text-red-600">*</span>
                        </label>

                        <div class="relative">
                            <input
                                id="password"
                                name="passs"
                                v-model="password"
                                autocomplete="on"
                                @blur="passwordTouched = true"
                                :type="
                                    showPassword ? 'text' : 'password'
                                "
                                :aria-invalid="!!passwordError"
                                :aria-describedby="
                                    showPasswordError
                                        ? 'password-error'
                                        : undefined
                                "
                                class="bg-gray-50 border text-gray-900 text-xs lg:text-sm rounded-3xl focus:ring-cyan-500 focus:outline-none block w-full px-3 py-2 pr-9"
                                :class="
                                    showPasswordError
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-cyan-500'
                                " />
                            <!-- Toggle button -->
                            <button
                                type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                @click="showPassword = !showPassword"
                                aria-label="Toggle password visibility">
                                <Icon
                                    v-if="!showPassword"
                                    icon="mdi:eye"
                                    class="w-4 h-4" />
                                <Icon
                                    v-else
                                    icon="mdi:eye-off"
                                    class="w-4 h-4" />
                            </button>
                        </div>
                        <small
                            v-if="showPasswordError"
                            id="password-error"
                            class="mt-1 block text-[11px] text-red-600">
                            {{ passwordError }}
                        </small>
                    </div>

                    <div class="flex items-start justify-end">
                        <RouterLink
                            to="/admin/forgot-password"
                            class="text-xs lg:text-sm text-cyan-500 font-semibold">
                            Forgot Password?
                        </RouterLink>
                    </div>

                    <button
                        type="submit"
                        :disabled="!isFormValid || isSubmitting"
                        class="py-2.5 px-4 w-full text-center text-sm font-medium rounded-3xl bg-gray-200 text-gray-700 hover:bg-cyan-500 hover:text-white cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 ease-out">
                        <span v-if="!isSubmitting">Login</span>
                        <span
                            v-else
                            class="inline-flex items-center justify-center gap-2">
                            <Icon
                                icon="mdi:loading"
                                class="w-4 h-4 animate-spin" />
                            Logging in...
                        </span>
                    </button>
                </form>

                <button
                    type="button"
                    @click="handleGoogleLogin"
                    class="py-2 px-3 mt-2 rounded-3xl flex gap-2 justify-center items-center bg-white shadow-md border border-gray-100 text-xs lg:text-sm text-gray-600">
                    <Icon
                        icon="material-icon-theme:google"
                        class="w-6 h-6" />
                    <span>Sign in with Google</span>
                </button>

                <p class="text-center mt-2 text-xs lg:text-sm">
                    Don't have account?
                    <RouterLink
                        to="/admin/registration"
                        class="text-cyan-500">
                        Register Now
                    </RouterLink>
                </p>
            </div>
        </div>
    </MainLayout>
</template>
