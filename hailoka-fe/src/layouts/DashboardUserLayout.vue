<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PanelMenu from "primevue/panelmenu";
import Button from "primevue/button"; // ⬅️ tambahkan ini
import { Icon } from "@iconify/vue";

import { useMenuStore } from "../stores/menu";
import { useAuthStore } from "../stores/auth";
import { useOrganizationStore } from "../stores/organization";

const menuStore = useMenuStore();
const authStore = useAuthStore();
const orgStore = useOrganizationStore();
const route = useRoute();
const router = useRouter();

// ====== Organization ID dari route ======
const organizationId = computed(() =>
    String(route.params.organizationId ?? "")
);

// ====== Sidebar menu items (pakai organizationId) ======
const menuItems = computed(() => [
    {
        label: "Home",
        icon: "mdi:home",
        to: `/admin/${organizationId.value}`,
    },
    {
        label: "Extenstions",
        icon: "fa7-solid:users",
        to: `/admin/${organizationId.value}/extenstions`,
    },
    {
        label: "Rules",
        icon: "fluent:slide-text-edit-16-filled",
        to: `/admin/${organizationId.value}/rules`,
    },
    {
        label: "Staffs",
        icon: "ri:building-fill",
        to: `/admin/${organizationId.value}/staffs`,
    },
    {
        label: "Report",
        icon: "mdi:file-document-outline",
        to: `/admin/${organizationId.value}/reports`,
    },
    {
        label: "Setting",
        icon: "ri:building-fill",
        to: `/admin/${organizationId.value}/settings`,
    },
]);

// ====== State untuk header dashboard (dari store) ======
const orgName = computed(
    () =>
        orgStore.getOrganizationById(organizationId.value)?.name ??
        "Organization"
);
const loadingOrg = computed(() => orgStore.loading);
const orgError = computed(() => orgStore.error);

// header subtitle sesuai menu aktif
const headerSubtitle = computed(() => {
    const currentPath = route.path;
    const found = menuItems.value.find((item) => item.to === currentPath);
    return found?.label ?? "";
});

// user login dari authStore
const userEmail = computed(() => authStore.user?.email ?? "");

// ====== Header date ======
const headerDate = ref("");

function formatHeaderDate() {
    const now = new Date();

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
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

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const day = String(now.getDate()).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${dayName}, ${monthName} ${day} ${year} - ${hours}:${minutes}`;
}

// ====== Logout di sidebar ======
async function handleLogout() {
    try {
        await authStore.logout();
        router.push({ name: "SignIn" });
    } catch (err: any) {
        console.error("Logout error:", err?.response?.data);
    }
}

// ⭐ NEW: ke halaman profile (ubah profile / password)
function goToProfile() {
    router.push({ name: "updateProfile" });
}

// ====== Sidebar mobile ======
const isSidebarOpen = ref(false);
function openSidebar() {
    isSidebarOpen.value = true;
}
function closeSidebar() {
    isSidebarOpen.value = false;
}

// ====== Lifecycle ======
onMounted(async () => {
    headerDate.value = formatHeaderDate();
    setInterval(() => {
        headerDate.value = formatHeaderDate();
    }, 60 * 1000);

    // pastikan organization sudah ke-fetch
    if (!orgStore.initialized) {
        await orgStore.fetchOrganizations();
    }
    orgStore.setSelectedOrganization(organizationId.value);

    // sync activeMenu awal sesuai URL
    menuStore.setActiveMenu(route.path);
});

// kalau organizationId di URL berubah (pindah org), update selected org & active menu
watch(
    () => route.params.organizationId,
    (newId) => {
        if (!newId) return;
        orgStore.setSelectedOrganization(String(newId));
        menuStore.setActiveMenu(route.path);
    }
);
</script>

<template>
    <div class="flex min-h-screen bg-slate-50">
        <!-- Sidebar desktop -->
        <aside class="hidden md:flex w-64 bg-[#00A1C3] flex-col">
            <div class="flex-1 flex flex-col">
                <div class="p-4 text-xl font-bold text-white text-center items-center justify-center">Cloud VoIP</div>

                <PanelMenu :model="menuItems" class="mt-6 flex-1">
                    <template #item="{ item }">
                        <router-link
                            :to="item.to"
                            class="flex items-center px-4 py-3 cursor-pointer"
                            :class="{
                                'bg-[#33C1DE] border-s-4 text-white':
                                    menuStore.activeMenu === item.to,
                                'text-white': menuStore.activeMenu !== item.to,
                            }"
                            @click="menuStore.setActiveMenu(item.to)">
                            <Icon
                                :icon="item.icon || ''"
                                class="w-5 h-5 mr-2 text-primary" />
                            <span>{{ item.label }}</span>
                        </router-link>
                    </template>
                </PanelMenu>
            </div>

            <!-- Bottom: Logout -->
            <button
                type="button"
                class="mt-auto w-full flex items-center gap-3 px-5 py-4 text-white border-t border-white/20 hover:bg-[#33C1DE] transition-colors"
                @click="handleLogout">
                <Icon icon="bxs:log-out" class="w-5 h-5" />
                <span class="font-medium">Logout</span>
            </button>
        </aside>

        <!-- Sidebar mobile (drawer) -->
        <transition name="fade">
            <div
                v-if="isSidebarOpen"
                class="fixed inset-0 z-40 bg-black/40 md:hidden"
                @click="closeSidebar" />
        </transition>

        <transition name="slide-left">
            <aside
                v-if="isSidebarOpen"
                class="fixed inset-y-0 left-0 z-50 w-64 bg-[#00A1C3] flex flex-col md:hidden">
                <div class="flex items-center justify-between px-4 py-4">
                    <span class="text-xl font-bold text-white">
                        Cloud VoIP
                    </span>
                    <button
                        class="text-white"
                        type="button"
                        @click="closeSidebar">
                        <Icon icon="mdi:close" class="w-6 h-6" />
                    </button>
                </div>

                <PanelMenu :model="menuItems" class="flex-1">
                    <template #item="{ item }">
                        <router-link
                            :to="item.to"
                            class="flex items-center px-4 py-3 cursor-pointer"
                            :class="{
                                'bg-[#33C1DE] border-s-4 text-white':
                                    menuStore.activeMenu === item.to,
                                'text-white': menuStore.activeMenu !== item.to,
                            }"
                            @click="
                                () => {
                                    menuStore.setActiveMenu(item.to);
                                    closeSidebar();
                                }
                            ">
                            <Icon
                                :icon="item.icon || ''"
                                class="w-5 h-5 mr-2 text-primary" />
                            <span>{{ item.label }}</span>
                        </router-link>
                    </template>
                </PanelMenu>

                <button
                    type="button"
                    class="mt-auto w-full flex items-center gap-3 px-5 py-4 text-white border-t border-white/20 hover:bg-[#33C1DE] transition-colors"
                    @click="handleLogout">
                    <Icon icon="bxs:log-out" class="w-5 h-5" />
                    <span class="font-medium">Logout</span>
                </button>
            </aside>
        </transition>

        <!-- Main content -->
        <div class="flex-1 flex flex-col">
            <!-- Topbar -->
            <header
                class="bg-white shadow border border-gray-200 rounded-none md:rounded-md flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
                <div class="flex items-center gap-3">
                    <!-- hamburger mobile -->
                    <button
                        type="button"
                        class="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        @click="openSidebar">
                        <Icon icon="mdi:menu" class="w-6 h-6" />
                    </button>

                    <div class="flex flex-col gap-1">
                        <h1 class="text-lg md:text-2xl font-semibold">
                            <span v-if="loadingOrg"
                                >Loading organization...</span
                            >
                            <span v-else>{{ orgName || "Organization" }}</span>
                        </h1>
                        <h2 class="text-sm md:text-lg text-gray-600">
                            {{ headerSubtitle }}
                        </h2>
                        <p
                            v-if="orgError"
                            class="text-xs md:text-sm text-red-500">
                            {{ orgError }}
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Avatar (desktop) -->
                    <div class="hidden sm:block">
                        <div
                            class="size-10 md:size-12 bg-gray-300 rounded-full" />
                    </div>

                    <!-- Info + tombol profile -->
                    <div class="flex flex-col gap-1 text-right">
                        <h1
                            class="text-xs md:text-sm font-semibold text-cyan-600">
                            {{ headerDate }}
                        </h1>
                        <h2
                            class="text-sm md:text-lg truncate max-w-[160px] md:max-w-none">
                            {{ userEmail || "user@example.com" }}
                        </h2>

                        <!-- ⭐ Tombol ke Profile -->
                        <div class="flex justify-end mt-1">
                            <Button
                                size="small"
                                class="!px-3 !py-1 !rounded-full !text-xs md:!text-sm !border-sky-300 !text-sky-600 !bg-white hover:!bg-sky-50 flex items-center gap-1 md:gap-2"
                                @click="goToProfile">
                                <Icon
                                    icon="mdi:account-circle"
                                    class="w-4 h-4" />
                                <span class="hidden sm:inline">Profile</span>
                                <span class="sm:hidden">Prof</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page content -->
            <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
                <slot />
            </main>
        </div>
    </div>
</template>

<style>
.p-panelmenu-panel {
    padding: 0 !important;
}
.p-panelmenu-panel,
.p-panelmenu-panel:hover {
    border-radius: 0 !important;
    border: 0 !important;
    background-color: transparent !important;
}

.p-panelmenu-header-content:hover {
    background-color: transparent !important;
}

.p-datatable-column-header-content > span {
    width: 100%;
}

.p-datatable-paginator-bottom {
    margin: 1rem 0 0 0;
    border-width: 0 !important;
}

/* transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
    transition: transform 0.18s ease, opacity 0.18s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}
</style>
