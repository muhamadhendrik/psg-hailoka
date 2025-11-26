<script lang="ts" setup>
import { useRoute } from "vue-router";
import DashboardUserLayout from "../../../layouts/DashboardUserLayout.vue";
import { useMenuStore } from "../../../stores/menu";
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { Button, Column, DataTable } from "primevue";
import { answeredCallDummy } from "../../../data/extensionCalls";
// import PickupDialog from '../../../components/dashboard/home/PickupDialog.vue';
// import InCallDialog from '../../../components/dashboard/home/InCallDialog.vue';
// import EndCall from '../../../components/dashboard/home/EndCall.vue';
// import ResumeCall from '../../../components/dashboard/home/ResumeCall.vue';
import MissedCallDialog from "../../../components/dashboard/home/MissedCallDialog.vue";

const route = useRoute();
const organizationId = route.params.organizationId;

const menuStore = useMenuStore();
menuStore.setActiveMenu(`/admin/${organizationId}`);

const callStats = ref([
    {
        label: "Total Calls Today",
        value: 120,
        icon: "majesticons:phone-retro-line",
        bg: "bg-sky-50",
        iconBg: "bg-sky-200",
        iconColor: "text-sky-700",
    },
    {
        label: "Ringing",
        value: 15,
        icon: "ph:bell",
        bg: "bg-rose-50",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-700",
    },
    {
        label: "Active",
        value: 60,
        icon: "solar:call-chat-linear",
        bg: "bg-emerald-50",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-700",
    },
    {
        label: "On Hold",
        value: 10,
        icon: "si:phone-paused-line",
        bg: "bg-gray-50",
        iconBg: "bg-gray-200",
        iconColor: "text-gray-700",
    },
    {
        label: "Missed",
        value: 20,
        icon: "mdi:phone-remove",
        bg: "bg-red-50",
        iconBg: "bg-red-100",
        iconColor: "text-red-700",
    },
]);

interface LiveCall {
    id: string;
    guestName: string;
    extPickup: string;
    status: string;
    duration: string;
}

const liveCallList = ref<LiveCall[]>([
    {
        id: "67567k-d7f6g87-d76g8d",
        guestName: "Alan Walker",
        extPickup: "Receptionist / John doe",
        status: "Active",
        duration: "00:09:27",
    },
    {
        id: "67567k-d7f6g87-d76g8d",
        guestName: "Ninja Annonymous",
        extPickup: "Restaurant / Lena",
        status: "Ringing",
        duration: "-",
    },
    {
        id: "67567k-d7f6g87-d76g8d",
        guestName: "Kenny",
        extPickup: "Room Service / Jane",
        status: "On Hold",
        duration: "00:01:34",
    },
    {
        id: "67567k-d7f6g87-d76g8d",
        guestName: "Michael Frank",
        extPickup: "Engineer / -",
        status: "Missed",
        duration: "-",
    },
]);

interface AnsweredCall {
    id: string;
    guestName: string;
    extPickup: string;
    duration: string;
    feedback: {
        star: number;
        description: string;
    };
}

const answeredCall = ref<AnsweredCall[]>(answeredCallDummy);

const openInCalldialog = ref(false);
</script>

<template>
    <DashboardUserLayout>
        <div class="space-y-4">
            <!-- Stats -->
            <section class="p-3 md:p-4 rounded-lg bg-white shadow-sm">
                <h2
                    class="text-gray-800 font-semibold mb-4 text-base md:text-lg">
                    Current Call Overview
                </h2>

                <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div
                        v-for="(item, index) in callStats"
                        :key="index"
                        :class="[
                            'flex items-center justify-between p-3 md:p-4 rounded-xl transition hover:shadow-sm border border-transparent',
                            item.bg,
                        ]">
                        <div>
                            <p
                                class="text-gray-700 text-xs md:text-sm font-medium mb-1">
                                {{ item.label }}
                            </p>
                            <p
                                class="text-xl md:text-2xl font-semibold text-gray-900">
                                {{ item.value }}
                            </p>
                        </div>

                        <div
                            :class="[
                                'flex items-center justify-center size-10 md:size-12 rounded-lg',
                                item.iconBg,
                                item.iconColor,
                            ]">
                            <Icon
                                :icon="item.icon"
                                class="text-2xl md:text-4xl" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Live Call -->
            <section
                class="bg-white border border-gray-200 rounded-md p-4 md:p-6 shadow">
                <h1
                    class="text-gray-800 text-base md:text-lg font-semibold mb-4">
                    Live Call
                </h1>

                <div class="card space-y-4">
                    <div class="overflow-x-auto">
                        <DataTable
                            :value="liveCallList"
                            scrollable
                            tableStyle="min-width: 800px; white-space: nowrap;"
                            sortMode="single">
                            <Column field="guestName" :frozen="true" sortable>
                                <template #sorticon="{ sortOrder }">
                                    <div
                                        class="flex justify-between items-center w-full">
                                        <span class="font-semibold">Name</span>

                                        <span v-if="sortOrder === 1">
                                            <Icon
                                                icon="fluent:arrow-sort-up-lines-16-filled"
                                                width="20"
                                                height="20" />
                                        </span>
                                        <span v-else-if="sortOrder === -1">
                                            <Icon
                                                icon="fluent:arrow-sort-down-lines-16-filled"
                                                width="20"
                                                height="20" />
                                        </span>
                                        <span v-else>
                                            <Icon
                                                icon="solar:sort-outline"
                                                width="20"
                                                height="20" />
                                        </span>
                                    </div>
                                </template>
                            </Column>

                            <Column
                                field="extPickup"
                                header="Ext / Picked Up By" />
                            <Column field="status" header="Status" />
                            <Column field="duration" header="Duration" />

                            <Column
                                field="id"
                                header="Actions"
                                frozen
                                alignFrozen="right">
                                <template #body="{ data }">
                                    <Button
                                        v-if="data.status == 'Active'"
                                        variant="link"
                                        class="text-red-400!">
                                        <Icon
                                            icon="mdi:phone-remove"
                                            width="20"
                                            height="20" />
                                        <span class="text-sm">End Call</span>
                                    </Button>

                                    <Button
                                        v-if="data.status == 'Ringing'"
                                        variant="link"
                                        class="text-green-700!">
                                        <Icon
                                            icon="ph:bell"
                                            width="20"
                                            height="20" />
                                        <span class="text-sm">Pick Up</span>
                                    </Button>

                                    <Button
                                        v-if="data.status == 'On Hold'"
                                        variant="link"
                                        class="text-sky-500!">
                                        <Icon
                                            icon="si:phone-paused-line"
                                            width="20"
                                            height="20" />
                                        <span class="text-sm">Resume</span>
                                    </Button>

                                    <Button
                                        v-if="data.status == 'Missed'"
                                        variant="link"
                                        class="text-orange-500!">
                                        <Icon
                                            icon="solar:call-chat-linear"
                                            width="20"
                                            height="20" />
                                        <span class="text-sm">Call Back</span>
                                    </Button>
                                </template>
                            </Column>

                            <template #empty>
                                <div
                                    class="flex flex-col items-center justify-center py-10 text-gray-500 h-[320px] md:h-[500px]">
                                    <i class="pi pi-inbox text-4xl mb-3"></i>
                                    <p class="text-sm font-medium">
                                        No records found
                                    </p>
                                    <p class="text-xs text-gray-400">
                                        Try adjusting your filters or add new
                                        data
                                    </p>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </section>

            <!-- Answered Call -->
            <section
                class="bg-white border border-gray-200 rounded-md p-4 md:p-6 shadow">
                <h1
                    class="text-gray-800 text-base md:text-lg font-semibold mb-4">
                    Answered Call
                </h1>

                <div class="card space-y-4">
                    <div class="overflow-x-auto">
                        <DataTable
                            :value="answeredCall"
                            scrollable
                            tableStyle="min-width: 800px; white-space: nowrap;"
                            sortMode="single"
                            paginator
                            :rows="10"
                            :rowsPerPageOptions="[5, 10, 20, 50]"
                            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                            currentPageReportTemplate="{first} to {last} of {totalRecords}">
                            <Column field="guestName" :frozen="true" sortable>
                                <template #sorticon="{ sortOrder }">
                                    <div
                                        class="flex justify-between items-center w-full">
                                        <span class="font-semibold">Name</span>

                                        <span v-if="sortOrder === 1">
                                            <Icon
                                                icon="fluent:arrow-sort-up-lines-16-filled"
                                                width="20"
                                                height="20" />
                                        </span>
                                        <span v-else-if="sortOrder === -1">
                                            <Icon
                                                icon="fluent:arrow-sort-down-lines-16-filled"
                                                width="20"
                                                height="20" />
                                        </span>
                                        <span v-else>
                                            <Icon
                                                icon="solar:sort-outline"
                                                width="20"
                                                height="20" />
                                        </span>
                                    </div>
                                </template>
                            </Column>

                            <Column
                                field="extPickup"
                                header="Ext / Picked Up By" />
                            <Column field="duration" header="Duration" />
                            <Column field="feedback" header="Feedback">
                                <template #body="{ data }">
                                    <span
                                        class="inline-flex gap-1 items-center">
                                        {{
                                            data.feedback.star > 0
                                                ? data.feedback.star
                                                : "-"
                                        }}
                                        <Icon
                                            v-if="data.feedback.star > 0"
                                            icon="noto:star"
                                            width="18"
                                            height="18" />
                                        <span class="text-xs md:text-sm">
                                            / {{ data.feedback.description }}
                                        </span>
                                    </span>
                                </template>
                            </Column>

                            <Column
                                field="id"
                                header="Details"
                                frozen
                                alignFrozen="right">
                                <template #body="">
                                    <Button
                                        variant="link"
                                        class="text-gray-700!">
                                        <Icon
                                            icon="mdi:eye"
                                            width="20"
                                            height="20" />
                                    </Button>
                                </template>
                            </Column>

                            <template #empty>
                                <div
                                    class="flex flex-col items-center justify-center py-10 text-gray-500 h-[320px] md:h-[500px]">
                                    <i class="pi pi-inbox text-4xl mb-3"></i>
                                    <p class="text-sm font-medium">
                                        No records found
                                    </p>
                                    <p class="text-xs text-gray-400">
                                        Try adjusting your filters or add new
                                        data
                                    </p>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </section>

            <!-- Dialog contoh -->
            <MissedCallDialog v-if="openInCalldialog" />
        </div>
    </DashboardUserLayout>
</template>
