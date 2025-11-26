<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import DashboardUserLayout from "../../../layouts/DashboardUserLayout.vue";
import Button from "primevue/button";
import { Icon } from "@iconify/vue";
import { useToast } from "primevue";
import Toast from "primevue/toast";

import { useOrganizationStore } from "../../../stores/organization";
import {
    qrService,
    type OrgQrData,
    type GenerateOrgQrPayload,
} from "../../../services/qrService";
import {
    organizationUserService,
    type OrganizationDetail,
    type UpdateOrganizationStatusPayload,
} from "../../../services/organizationUser";
import ConfirmTemporaryClose from "../../../components/dashboard/organization/ConfirmTemporaryClose.vue";
import ConfirmReopenOrganization from "../../../components/dashboard/organization/ConfirmReopenOrganization.vue";
import ConfirmRegenerateQR from "../../../components/dashboard/organization/ConfirmRegenerateQR.vue";

const route = useRoute();
const router = useRouter();
const orgStore = useOrganizationStore();
const toast = useToast();

const organizationId = computed(() =>
    String(route.params.organizationId ?? "")
);

// Fetch organization detail directly from API to get latest status
const organization = ref<OrganizationDetail | null>(null);
const loadingOrg = ref(false);

// Computed values from fetched organization
const orgName = computed(() => organization.value?.name ?? "-");
const orgDescription = computed(() => organization.value?.description ?? "-");
const orgAddress = computed(() => organization.value?.address ?? "-");
const orgNumber = computed(
    () => (organization.value as any)?.organization_no ?? "—"
);

// Status: 2 = Live/Approved, 4 = Suspended/Temporary Closed
const isTemporaryClosed = computed(
    () => organization.value?.organization_status_id === 4
);

// Dialog states
const showCloseDialog = ref(false);
const showReopenDialog = ref(false);
const showRegenerateQrDialog = ref(false);

// Loading states
const updatingStatus = ref(false);

// ====== QR state ======
const qrLoading = ref(false);
const qrError = ref("");
const qrData = ref<OrgQrData | null>(null);

// dipakai untuk bust cache di URL image
const qrImageVersion = ref(0);

// 🔹 URL gambar pakai organizationId
const qrImageUrl = computed(() => {
    if (!qrData.value) return "";
    return qrService.getOrgQrImageUrl(
        organizationId.value,
        qrImageVersion.value
    );
});

function formatDateTime(iso?: string | null) {
    if (!iso) return "Not generated yet";
    const d = new Date(iso);
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

    const monthName = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");

    return `${monthName} ${day}, ${year} - ${hh}:${mm}:${ss}`;
}

const lastGeneratedText = computed(() =>
    qrData.value ? formatDateTime(qrData.value.created_at) : "Not generated yet"
);

// ====== Actions ======
async function fetchOrganizationDetail() {
    loadingOrg.value = true;
    try {
        const res = await organizationUserService.getOrganizationById(
            organizationId.value
        );
        // Handle both wrapped and unwrapped responses
        const raw: any = res.data;
        organization.value = (raw?.data || raw) as OrganizationDetail;
        
        // Update store if needed
        if (organization.value) {
            orgStore.setSelectedOrganization(organizationId.value);
        }
    } catch (err: any) {
        console.error("Error fetching organization:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: err?.response?.data?.message || "Failed to fetch organization details",
            group: "custom",
            life: 5000,
        });
    } finally {
        loadingOrg.value = false;
    }
}

async function updateOrganizationStatus(statusId: number) {
    if (!organization.value) return;

    updatingStatus.value = true;

    try {
        const payload: UpdateOrganizationStatusPayload = {
            organization_status_id: statusId,
            reviewer_notes: null,
            internal_notes: null,
        };

        const response = await organizationUserService.updateOrganizationStatus(
            organizationId.value,
            payload
        );

        if (response.data.success) {
            // Update local state
            if (organization.value) {
                organization.value.organization_status_id = statusId;
            }

            // Refresh organization detail from API
            await fetchOrganizationDetail();

            // Refresh organization list in store
            await orgStore.fetchOrganizations();

            toast.add({
                severity: "success",
                summary: "Success",
                detail:
                    statusId === 4
                        ? `Organization "${organization.value.name}" has been temporarily closed`
                        : `Organization "${organization.value.name}" has been reopened`,
                group: "custom",
                life: 5000,
            });
        }
    } catch (err: any) {
        console.error("Error updating organization status:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail:
                err?.response?.data?.message ||
                "Failed to update organization status",
            group: "custom",
            life: 5000,
        });
    } finally {
        updatingStatus.value = false;
    }
}

function handleCloseOrganization() {
    showCloseDialog.value = true;
}

function handleReopenOrganization() {
    showReopenDialog.value = true;
}

async function confirmCloseOrganization() {
    await updateOrganizationStatus(4); // 4 = Suspended/Temporary Closed
    showCloseDialog.value = false;
}

async function confirmReopenOrganization() {
    await updateOrganizationStatus(2); // 2 = Approved/Live
    showReopenDialog.value = false;
}

function handleGenerateQrClick() {
    showRegenerateQrDialog.value = true;
}

async function generateQr() {
    if (!organization.value) return;

    qrLoading.value = true;
    qrError.value = "";

    try {
        const orgId = String(organization.value.id);

        const payload: GenerateOrgQrPayload = {
            organization_id: orgId,
            data: {
                organization_id: orgId,
                name: organization.value.name,
                address: organization.value.address,
                description: organization.value.description,
            },
        };

        const res = await qrService.generateOrgQr(payload);
        qrData.value = res.data.data;

        // bump versi supaya <img> reload (cache busting)
        qrImageVersion.value++;

        toast.add({
            severity: "info",
            summary: "Success",
            detail: "QR Code has been regenerated successfully",
            group: "custom",
            life: 5000,
        });
    } catch (err: any) {
        console.error("Generate QR error:", err);
        qrError.value =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to generate QR Code";
        toast.add({
            severity: "error",
            summary: "Error",
            detail: qrError.value,
            group: "custom",
            life: 5000,
        });
    } finally {
        qrLoading.value = false;
    }
}

async function confirmRegenerateQR() {
    await generateQr();
    showRegenerateQrDialog.value = false;
}

async function initQr() {
    try {
        const res = await qrService.getQrCodeByOrganization(
            organizationId.value
        );
        qrData.value = res.data.data;
        qrImageVersion.value++;
    } catch (err) {
        // kalau 404 / belum pernah generate → biarkan kosong
        console.log("No existing QR yet");
    }
}

function goBack() {
    router.back();
}

async function downloadQr() {
    if (!qrData.value) return;

    const url = qrImageUrl.value;
    if (!url) return;

    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${orgName.value || "organization"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

onMounted(async () => {
    if (!orgStore.initialized) {
        await orgStore.fetchOrganizations();
    }
    await fetchOrganizationDetail();
    await initQr();
});
</script>

<template>
    <DashboardUserLayout>
        <div class="w-full h-full">
            <!-- Card utama -->
            <section
                class="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 lg:p-8 flex flex-col gap-6 h-full">
                <!-- Header kecil: back + title + badge -->
                <!-- PAGE HEADER -->
                <div
                    class="flex flex-col sm:flex-row justify-between sm:items-center py-5 border-b border-gray-300 gap-4 sm:gap-0">
                    <!-- Back Button -->
                    <Button
                        variant="link"
                        @click="goBack"
                        class="ps-0! text-black! flex items-center gap-2 text-xl font-semibold">
                        <Icon
                            icon="material-symbols:arrow-back-ios-rounded"
                            width="24"
                            height="24" />
                        <span>Organization Detail</span>
                    </Button>

                    <!-- Temporary Closed / Reopen Button -->
                    <Button
                        v-if="!isTemporaryClosed"
                        severity="danger"
                        rounded
                        :loading="updatingStatus"
                        @click="handleCloseOrganization"
                        class="flex items-center gap-2 pe-4!">
                        <Icon
                            icon="clarity:power-solid"
                            width="28"
                            height="28" />
                        <span>Temporary Closed</span>
                    </Button>
                    <Button
                        v-else
                        rounded
                        :loading="updatingStatus"
                        @click="handleReopenOrganization"
                        class="flex items-center gap-2 pe-4!"
                        style="background-color: #02b1d6; color: white; border: none;">
                        <Icon
                            icon="mdi:play"
                            width="28"
                            height="28" />
                        <span>Reopen Organization</span>
                    </Button>
                </div>

                <!-- Konten: kiri info org, kanan QR -->
                <div
                    class="flex flex-col lg:flex-row gap-8 lg:items-start lg:justify-between">
                    <!-- LEFT: organization info -->
                    <div class="flex-1 space-y-6">
                        <div class="space-y-1">
                            <h2
                                class="text-sm font-semibold text-gray-500 tracking-wide uppercase">
                                Organization Name
                            </h2>
                            <p class="text-gray-900 text-base">
                                {{ orgName }}
                            </p>
                        </div>

                        <div class="space-y-1">
                            <h2
                                class="text-sm font-semibold text-gray-500 tracking-wide uppercase">
                                Description
                            </h2>
                            <p
                                class="text-gray-700 text-sm leading-relaxed max-w-3xl">
                                {{ orgDescription }}
                            </p>
                        </div>

                        <div class="space-y-1">
                            <h2
                                class="text-sm font-semibold text-gray-500 tracking-wide uppercase">
                                Address
                            </h2>
                            <p
                                class="text-gray-700 text-sm leading-relaxed max-w-3xl">
                                {{ orgAddress }}
                            </p>
                        </div>

                        <div class="space-y-1">
                            <h2
                                class="text-sm font-semibold text-gray-500 tracking-wide uppercase">
                                Organization No.
                            </h2>
                            <p class="text-gray-800 text-sm">
                                {{ orgNumber }}
                            </p>
                        </div>

                        <div class="space-y-2 mt-4">
                            <h2
                                class="text-sm font-semibold text-gray-500 tracking-wide uppercase">
                                Change Organization Info
                            </h2>
                            <p class="text-gray-700 text-sm max-w-xl">
                                If you need to update organization details,
                                please contact our support team.
                            </p>
                            <Button
                                label="Request Change"
                                outlined
                                class="!rounded-full !px-5 !py-2 !text-sky-500 !border-sky-300 hover:!bg-sky-50" />
                        </div>

                        <p
                            v-if="orgStore.error"
                            class="text-sm text-red-500 mt-4">
                            {{ orgStore.error }}
                        </p>
                    </div>

                    <!-- RIGHT: QR card -->
                    <aside
                        class="w-full max-w-xs lg:w-72 bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-4">
                        <div
                            class="w-40 h-40 bg-white border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                            <template v-if="qrImageUrl">
                                <img
                                    :src="qrImageUrl"
                                    alt="Organization QR Code"
                                    class="w-full h-full object-contain" />
                            </template>
                            <template v-else>
                                <div
                                    class="text-xs text-gray-400 text-center px-4">
                                    QR Code not generated yet.
                                </div>
                            </template>
                        </div>

                        <div class="w-full text-xs text-gray-500 text-right">
                            <span class="block">Last generated on</span>
                            <span class="font-medium">
                                {{ lastGeneratedText }}
                            </span>
                        </div>

                        <div class="w-full space-y-2 mt-2">
                            <Button
                                class="w-full !rounded-full !border-sky-300 !text-sky-600 !bg-white hover:!bg-sky-50 flex items-center justify-center gap-2"
                                :disabled="!qrData"
                                @click="downloadQr">
                                <Icon icon="mdi:download" class="w-4 h-4" />
                                <span>Download QR Code</span>
                            </Button>

                            <Button
                                class="w-full !rounded-full !bg-sky-500 !border-sky-500 !text-white hover:!bg-sky-600 flex items-center justify-center gap-2"
                                :loading="qrLoading"
                                @click="handleGenerateQrClick">
                                <Icon icon="mdi:refresh" class="w-4 h-4" />
                                <span>Re-Generate QR Code</span>
                            </Button>
                        </div>

                        <p
                            v-if="qrError"
                            class="text-xs text-red-500 text-center mt-1">
                            {{ qrError }}
                        </p>
                    </aside>
                </div>
            </section>
        </div>

        <!-- Dialogs -->
        <ConfirmTemporaryClose
            v-model:visible="showCloseDialog"
            @confirm="confirmCloseOrganization" />

        <ConfirmReopenOrganization
            v-model:visible="showReopenDialog"
            @confirm="confirmReopenOrganization" />

        <ConfirmRegenerateQR
            v-model:visible="showRegenerateQrDialog"
            @confirm="confirmRegenerateQR" />

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
