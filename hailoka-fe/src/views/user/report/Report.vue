<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DashboardUserLayout from "../../../layouts/DashboardUserLayout.vue";
import { Icon } from "@iconify/vue";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import { useMenuStore } from "../../../stores/menu";
// import { useOrganizationStore } from "../../../stores/organization";

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();
// const orgStore = useOrganizationStore();

const organizationId = computed(() =>
    String(route.params.organizationId ?? "")
);

// Set active menu
menuStore.setActiveMenu(`/admin/${organizationId.value}/reports`);

// Organization name is already shown in DashboardUserLayout header, so we don't need it here

// Search query
const searchQuery = ref("");

// Report types
interface ReportItem {
    id: string;
    title: string;
    route?: string;
}

const reports: ReportItem[] = [
    {
        id: "call-history",
        title: "Call History Report",
        route: "CallHistoryReport",
    },
    {
        id: "missed-call",
        title: "Missed Call Report",
        route: "MissedCallReport",
    },
    {
        id: "staff-performance",
        title: "Staff Performance Report",
        route: "StaffPerformanceReport",
    },
    {
        id: "extension-usage",
        title: "Extension Usage Report",
        route: "ExtensionUsageReport",
    },
    {
        id: "guest-feedback",
        title: "Guest Feedback Report",
        route: "GuestFeedbackReport",
    },
];

// Filtered reports based on search
const filteredReports = computed(() => {
    if (!searchQuery.value.trim()) {
        return reports;
    }
    const query = searchQuery.value.toLowerCase();
    return reports.filter((report) =>
        report.title.toLowerCase().includes(query)
    );
});

function handleReportClick(report: ReportItem) {
    // TODO: Navigate to specific report detail page
    if (report.route) {
        router.push({
            name: report.route,
            params: { organizationId: organizationId.value },
        });
    }
}
</script>

<template>
    <DashboardUserLayout>
        <div class="w-full h-full px-4 py-6">
            <!-- Header - Organization name already shown in DashboardUserLayout header, so we skip it here -->

            <!-- Search Bar -->
            <div class="mb-6">
                <IconField class="relative w-full">
                    <Icon
                        icon="material-symbols:search"
                        width="20"
                        height="20"
                        class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <InputText
                        v-model="searchQuery"
                        placeholder="Search report"
                        class="w-full rounded-full! pl-10 border-sky-300! focus:border-sky-400! focus:ring-0!" />
                </IconField>
            </div>

            <!-- Report List -->
            <section class="bg-transparent">
                <div class="space-y-3">
                    <button
                        v-for="report in filteredReports"
                        :key="report.id"
                        type="button"
                        @click="handleReportClick(report)"
                        class="w-full bg-white border border-gray-200 rounded-xl px-5 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                        <span class="text-sm md:text-base text-gray-800">
                            {{ report.title }}
                        </span>
                        <Icon
                            icon="mdi:chevron-right"
                            class="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <!-- Empty State -->
                <div
                    v-if="filteredReports.length === 0"
                    class="flex flex-col items-center justify-center py-10 text-gray-500">
                    <Icon
                        icon="mdi:file-search-outline"
                        width="48"
                        height="48"
                        class="mb-3 text-gray-400" />
                    <p class="text-sm font-medium">No reports found</p>
                    <p class="text-xs text-gray-400">
                        Try adjusting your search query
                    </p>
                </div>
            </section>
        </div>
    </DashboardUserLayout>
</template>

<style scoped>
/* Additional styling if needed */
</style>

