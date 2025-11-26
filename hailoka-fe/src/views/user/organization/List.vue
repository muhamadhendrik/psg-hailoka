<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button"; // ✅ sesuai PrimeVue
import { Icon } from "@iconify/vue";
import MainLayout from "../../../layouts/MainLayout.vue";
import { useAuthStore } from "../../../stores/auth";
import { useOrganizationStore } from "../../../stores/organization";

// ====== Store & Router ======
const authStore = useAuthStore();
const orgStore = useOrganizationStore();
const router = useRouter();

// ====== State dari auth ======
const userName = computed(() => authStore.user?.name ?? "");

// ====== State dari organization store ======
const loading = computed(() => orgStore.loading);
const error = computed(() => orgStore.error);
const organizations = computed(() => orgStore.organizations);

// Error lokal halaman (init / logout)
const pageError = ref("");
const logoutError = ref("");

// ====== Logout ======
async function handleLogout() {
    try {
        logoutError.value = "";
        await authStore.logout();
        router.push({ name: "SignIn" });
    } catch (err: any) {
        console.log("Logout error raw:", err?.response?.data);
        logoutError.value =
            authStore.error ||
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Logout failed!";
    }
}

// ====== Lifecycle init ======
onMounted(async () => {
    try {
        pageError.value = "";

        // pastikan auth sudah di-init
        if (!authStore.initialized) {
            await authStore.fetchMe();
        }

        console.log("Auth user after fetchMe:", authStore.user);

        // kalau belum login → lempar ke SignIn
        if (!authStore.user) {
            router.push({ name: "SignIn" });
            return;
        }

        // fetch organizations sekali saja
        if (!orgStore.initialized) {
            await orgStore.fetchOrganizations();
        }
    } catch (err) {
        console.error(err);
        pageError.value = "Failed to initialize page.";
    }
});
</script>

<template>
    <MainLayout>
        <div
            class="w-1/2 h-full lg:block hidden bg-[url('/images/rectangle-blue.jpg')] bg-[1020px] rounded-s-2xl"></div>

        <div
            class="flex flex-col lg:p-8 p-0 lg:w-1/2 w-full items-center rounded-e-2xl lg:h-full h-screen relative lg:bg-white bg-gradient-to-t from-white from-20% via-white/40 to-transparent">
            <!-- Top bar: Logout -->
            <div class="flex w-full justify-end">
                <Button
                    severity="danger"
                    rounded
                    class="px-4!"
                    @click="handleLogout">
                    <Icon icon="bxs:log-out" width="24" height="24" />
                    <span>Logout</span>
                </Button>
            </div>

            <div
                class="w-lg mx-auto p-6 space-y-5 h-full flex flex-col justify-center">
                <!-- Header -->
                <div>
                    <h2 class="text-xl font-semibold text-gray-800">
                        Hi,
                        <span v-if="userName">{{ userName }}</span>
                        <span v-else>there</span>!
                    </h2>
                    <p class="text-gray-600 mt-1">
                        Select the organization you want to access.
                    </p>
                </div>

                <!-- Add Organization Link -->
                <div>
                    <RouterLink
                        to="/user-organizations/create"
                        class="text-sky-500 font-medium hover:underline">
                        + Submit New Organization
                    </RouterLink>
                </div>

                <!-- Loading / Error / List -->
                <div class="space-y-3 w-full flex flex-col gap-2">
                    <div v-if="loading" class="text-gray-500 text-center py-4">
                        Loading organizations...
                    </div>

                    <div
                        v-else-if="error"
                        class="text-red-500 text-center py-4">
                        {{ error }}
                    </div>

                    <RouterLink
                        v-else
                        v-for="org in organizations"
                        :key="org.id"
                        :to="{
                            name: 'DashboardUser',
                            params: { organizationId: org.id },
                        }">
                        <div
                            class="rounded-xl border border-gray-200 hover:shadow-sm transition cursor-pointer"
                            :class="
                                org.organizationStatusId === 1
                                    ? 'bg-gray-50'
                                    : 'bg-white'
                            ">
                            <div class="p-4 flex items-center gap-3">
                                <span class="text-gray-800 font-medium">
                                    {{ org.name }}
                                </span>
                                <span
                                    class="text-sm font-medium"
                                    :class="
                                        org.organizationStatusId === 2
                                            ? 'text-sky-500'
                                            : 'text-gray-500'
                                    ">
                                    {{
                                        org.organizationStatusId == 1
                                            ? "In Review"
                                            : ""
                                    }}
                                    {{
                                        org.organizationStatusId == 2
                                            ? "Live"
                                            : ""
                                    }}
                                    {{
                                        org.organizationStatusId == 3
                                            ? "Rejected"
                                            : ""
                                    }}
                                    {{
                                        org.organizationStatusId == 4
                                            ? "Suspended"
                                            : ""
                                    }}
                                </span>
                            </div>
                        </div>
                    </RouterLink>

                    <div
                        v-if="!loading && organizations.length === 0"
                        class="text-gray-400 text-center">
                        No organizations found.
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>
