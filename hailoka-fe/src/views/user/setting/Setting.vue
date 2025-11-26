<script lang="ts" setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import DashboardUserLayout from "../../../layouts/DashboardUserLayout.vue";

const route = useRoute();
const router = useRouter();

const organizationId = computed(() =>
    String(route.params.organizationId ?? "")
);

// TODO: nanti bisa diganti ambil dari store (organizationStore.currentOrganization?.name)
// const orgName = computed(() => "Green Living Residence");

type SettingItem = {
    label: string;
    // sesuaikan dengan nama route yang kamu punya
    to?: { name: string; params?: Record<string, any> };
};

const settingItems: SettingItem[] = [
    {
        label: "Organization Detail",
        to: {
            name: "SettingsOrganizationDetail",
            params: { organizationId: organizationId.value },
        },
    },
    {
        label: "Role Management",
        to: {
            name: "RoleManagement",
            params: { organizationId: organizationId.value },
        },
    },
    {
        label: "Extension Configuration",
        to: {
            name: "SettingsExtensionConfiguration",
            params: { organizationId: organizationId.value },
        },
    },
    {
        label: "Manage Plan",
        to: {
            name: "ManagePlan",
            params: { organizationId: organizationId.value },
        },
    },
];

function handleClick(item: SettingItem) {
    if (!item.to) return;
    router.push(item.to);
}
</script>

<template>
    <DashboardUserLayout>
        <div class="w-full h-full px-4 py-6">
            <!-- Settings list card -->
            <section class="bg-transparent">
                <div class="space-y-3">
                    <button
                        v-for="item in settingItems"
                        :key="item.label"
                        type="button"
                        class="w-full bg-white border border-gray-200 rounded-xl px-5 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                        <span class="text-sm md:text-base text-gray-800">
                            {{ item.label }}
                        </span>
                        <Icon
                            icon="mdi:chevron-right"
                            class="w-5 h-5 text-gray-400"
                            @click.stop="handleClick(item)" />
                    </button>
                </div>
            </section>
            <!-- </div> -->
        </div>
    </DashboardUserLayout>
</template>

<style scoped>
/* kosong dulu, kalau nanti mau tweak khusus halaman ini bisa ditaruh di sini */
</style>
