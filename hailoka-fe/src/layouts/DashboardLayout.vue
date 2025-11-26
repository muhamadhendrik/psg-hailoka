<script lang="ts" setup>
import PanelMenu from "primevue/panelmenu";
import { Icon } from "@iconify/vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMenuStore } from "../stores/menu";
import { useAuthStore } from "../stores/auth";

const menuStore = useMenuStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const menuItems = ref([
    {
        label: "Home",
        icon: "mdi:home",
        to: "/admin",
    },
    {
        label: "User",
        icon: "fa7-solid:users",
        to: "/admin/user",
    },
    {
        label: "Organizations",
        icon: "ri:building-fill",
        to: "/admin/organizations",
    },
]);

// Dynamic menu name based on current route
const currentMenuName = computed(() => {
    const currentPath = route.path;
    const found = menuItems.value.find((item) => item.to === currentPath);
    return found?.label ?? "Home";
});

// User info from auth store
const userEmail = computed(() => authStore.user?.email ?? "");
const userName = computed(() => authStore.user?.name ?? "");

// Dynamic date/time
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

// Logout handler
async function handleLogout() {
    try {
        await authStore.logout();
        router.push({ name: "SignIn" });
    } catch (err: any) {
        console.error("Logout error:", err?.response?.data);
    }
}

// Update date every minute
onMounted(() => {
    headerDate.value = formatHeaderDate();
    setInterval(() => {
        headerDate.value = formatHeaderDate();
    }, 60000); // Update every minute
});

// Sync active menu with route changes
watch(
    () => route.path,
    (newPath) => {
        menuStore.setActiveMenu(newPath);
    },
    { immediate: true }
);
</script>

<template>
    <div class="flex h-screen">
        <!-- Sidebar -->
        <aside class="w-64 bg-[#D76236] flex flex-col h-screen">
            <div class="p-4 text-xl font-bold text-white text-center items-center justify-center">Cloud VoIP</div>
            <!-- <PanelMenu :model="menuItems" class="h-full" /> -->
            <PanelMenu :model="menuItems" class="mt-12 flex-1">
                <template #item="{ item }">
                    <router-link
                        :to="item.to"
                        class="flex items-center px-4 py-3 cursor-pointer"
                        :class="{
                            'bg-[#F08962] border-s-4 text-white':
                                menuStore.activeMenu === item.to,
                            'text-white': menuStore.activeMenu !== item.to,
                        }"
                        @click="menuStore.setActiveMenu(item.to)">
                        <!-- <span :class="[item.icon, 'mr-2']"></span> -->
                        <Icon
                            :icon="item.icon || ''"
                            class="w-5 h-5 mr-2 text-primary" />
                        <span>{{ item.label }}</span>
                    </router-link>
                </template>
            </PanelMenu>
            
            <!-- Logout Button at Bottom -->
            <div class="p-4 border-t border-[#F08962]">
                <button
                    @click="handleLogout"
                    class="w-full flex items-center px-4 py-3 text-white hover:bg-[#F08962] rounded transition-colors">
                    <Icon icon="mdi:logout" class="w-5 h-5 mr-2" />
                    <span class="font-medium">Logout</span>
                </button>
            </div>
        </aside>

        <!-- Main content -->
        <div class="flex-1 flex flex-col p-4 overflow-y-auto">
            <!-- Topbar -->
            <header
                class="bg-surface-200 bg-white shadow border border-gray-200 rounded-md flex items-center justify-between p-6">
                <div class="flex flex-col gap-3">
                    <h1 class="text-2xl font-semibold">Super Admin</h1>
                    <h2 class="text-lg">{{ currentMenuName }}</h2>
                </div>
                <div class="flex items-center gap-3">
                    <div class="">
                        <div class="size-12 bg-gray-300 rounded-full"></div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <h1 class="font-semibold text-orange-400">
                            {{ headerDate }}
                        </h1>
                        <h2 class="text-lg">{{ userEmail || userName }}</h2>
                    </div>
                </div>
            </header>

            <!-- Page content -->
            <main class="bg-surface-50 flex-1 mt-4">
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
    /* @apply bg-gray-100 rounded-lg shadow-md; Tailwind utilities applied here */
    border-radius: 0 !important;
    border: 0 !important;
    /* background-color: #F08962; */
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
</style>
