<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import DashboardLayout from '../../../layouts/DashboardLayout.vue';
import Button from 'primevue/button';
import { useMenuStore } from '../../../stores/menu';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { ref, onMounted, computed } from 'vue';
import OrganizationModalAction from '../../../components/dashboard/OrganizationModalAction.vue';
import { organizationUserService, type OrganizationDetail } from '../../../services/organizationUser';

const toast = useToast();

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();

if(route.name == 'DetailOrganization') {
  menuStore.setActiveMenu('/admin');
}else{
  menuStore.setActiveMenu('/admin/organizations');
}

const organizationId = computed(() => route.params.id as string);

const loading = ref(false);
const error = ref("");
const organization = ref<OrganizationDetail | null>(null);

const isNextApprove = ref(false);
const isNextReject = ref(false);
const visibleApprove = ref(false);
const visibleReject = ref(false);
const updatingStatus = ref(false);

const approveNote = ref("");
const rejectNote = ref("");

const statusLabel = computed(() => {
    if (!organization.value) return "Unknown";
    switch (organization.value.organization_status_id) {
        case 1:
            return "In Review";
        case 2:
            return "Approved";
        case 3:
            return "Rejected";
        case 4:
            return "Suspended";
        default:
            return "Unknown";
    }
});

const statusColor = computed(() => {
    if (!organization.value) return "text-gray-500";
    switch (organization.value.organization_status_id) {
        case 1:
            return "text-orange-500";
        case 2:
            return "text-green-500";
        case 3:
            return "text-red-500";
        case 4:
            return "text-gray-500";
        default:
            return "text-gray-500";
    }
});

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

async function fetchOrganization() {
    try {
        loading.value = true;
        error.value = "";

        const response = await organizationUserService.getOrganizationById(organizationId.value);
        organization.value = response.data;
    } catch (err: any) {
        console.error("Error fetching organization:", err);
        error.value = err.response?.data?.message || "Failed to fetch organization data.";
        
        toast.add({
            severity: "error",
            summary: "Error",
            detail: error.value,
            group: "custom",
            life: 5000,
        });
    } finally {
        loading.value = false;
    }
}

async function confirmApprove() {
    if (!organization.value) return;

    try {
        updatingStatus.value = true;
        const response = await organizationUserService.updateOrganizationStatus(
            organization.value.id,
            {
                organization_status_id: 2, // Approved
                reviewer_notes: approveNote.value || null,
                internal_notes: null,
            }
        );

        if (response.data.success) {
            toast.add({
                severity: "success",
                summary: "Organization Approved",
                detail: `Organization "${organization.value.name}" has been approved.`,
                group: "custom",
                life: 5000,
            });
            closeModalApprove();
            // Refresh organization data
            await fetchOrganization();
            // Navigate back after a short delay
            setTimeout(() => {
                router.back();
            }, 1500);
        }
    } catch (err: any) {
        console.error("Error approving organization:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: err.response?.data?.message || "Failed to approve organization.",
            group: "custom",
            life: 5000,
        });
    } finally {
        updatingStatus.value = false;
    }
}

async function confirmReject() {
    if (!organization.value) return;

    try {
        updatingStatus.value = true;
        const response = await organizationUserService.updateOrganizationStatus(
            organization.value.id,
            {
                organization_status_id: 3, // Rejected
                reviewer_notes: rejectNote.value || null,
                internal_notes: null,
            }
        );

        if (response.data.success) {
            toast.add({
                severity: "success",
                summary: "Organization Rejected",
                detail: `Organization "${organization.value.name}" has been rejected.`,
                group: "custom",
                life: 5000,
            });
            closeModalReject();
            // Refresh organization data
            await fetchOrganization();
            // Navigate back after a short delay
            setTimeout(() => {
                router.back();
            }, 1500);
        }
    } catch (err: any) {
        console.error("Error rejecting organization:", err);
        toast.add({
            severity: "error",
            summary: "Error",
            detail: err.response?.data?.message || "Failed to reject organization.",
            group: "custom",
            life: 5000,
        });
    } finally {
        updatingStatus.value = false;
    }
}

function closeModalApprove() {
    isNextApprove.value = false;
    visibleApprove.value = false;
    approveNote.value = "";
}

function closeModalReject() {
    isNextReject.value = false;
    visibleReject.value = false;
    rejectNote.value = "";
}

const goBack = () => {
    router.back();
};

function openWhatsApp() {
    if (!organization.value) return;
    const phoneNumber = organization.value.primary_contact_phone_number.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
}

onMounted(fetchOrganization);

</script>

<template>

  <DashboardLayout>

    <div class="pt-1 pb-4 px-6 bg-white rounded-md shadow-sm border border-gray-100">

        <div class="flex justify-between border-b border-gray-500 items-center py-5">

            <Button variant="link" @click="goBack" class="text-2xl! text-black! font-semibold! flex! items-center! ps-0!">
                <Icon icon="material-symbols:arrow-back-ios-rounded" width="24" height="24" />
                <span v-if="organization">
                    {{ organization.name }} - <span :class="statusColor">{{ statusLabel }}</span>
                </span>
                <span v-else>Loading...</span>
            </Button>

            <div class="flex gap-2" v-if="organization && organization.organization_status_id === 1">
                <Button label="Custom Icon" severity="danger" @click="visibleReject = true" class="px-3! flex! rounded-3xl! w-[115px] justify-between!">
                  <Icon icon="carbon:close-filled" width="27" height="27" />
                    <span class="me-2">Reject</span>
                </Button>

                <Button label="Approve Icon" severity="info"  @click="visibleApprove = true" class="rounded-3xl! w-[130px] justify-between!">
                    <Icon icon="lets-icons:check-fill" width="32" height="32" />
                    <span class="me-2">Approve</span>
                </Button>
            </div>

        </div>

        <!-- <div class="flex flex-wrap py-4"> -->

          <div v-if="loading" class="flex justify-center items-center py-10">
              <p class="text-gray-500">Loading organization data...</p>
          </div>

          <div v-else-if="error" class="flex justify-center items-center py-10">
              <p class="text-red-500">{{ error }}</p>
          </div>

          <div v-else-if="organization" class="text-gray-800 space-y-6">
              <!-- Organization Info -->
              <section>
                  <h2 class="text-gray-800 font-semibold mb-2 text-lg border-b py-4">Organization Info</h2>

                  <div class="space-y-6">
                      <div>
                          <p class="text-gray-500 font-medium">Organization Name</p>
                          <p class="text-black font-normal">{{ organization.name }}</p>
                      </div>

                      <div>
                      <p class="text-gray-500 font-medium">Description</p>
                      <p class="text-gray-800">
                          {{ organization.description || "No description provided" }}
                      </p>
                      </div>

                      <div>
                      <p class="text-gray-500 font-medium">Address</p>
                      <p>{{ organization.address || "No address provided" }}</p>
                      </div>

                      <div>
                      <p class="text-gray-500 font-medium">Created At / Requested At</p>
                      <p>{{ formatDate(organization.created_at) }}</p>
                      </div>
                  </div>
              </section>

              <!-- Primary Contact -->
              <section>
                  <h2 class="font-semibold text-lg border-b border-gray-300 pb-2 mb-4">Primary Contact</h2>

                  <div class="space-y-4 text-lg">
                      <div>
                      <p class="text-gray-500 font-medium">Contact Person Name</p>
                      <p class="text-gray-900">{{ organization.primary_contact_full_name }}</p>
                      </div>

                      <div>
                      <p class="text-gray-500 font-medium">Phone</p>
                      <p class="text-gray-900">{{ organization.primary_contact_phone_number }}</p>
                      </div>

                      <Button
                          label="Contact WhatsApp"
                          outlined
                          icon="pi pi-whatsapp"
                          class="!border-sky-400 !text-sky-500 hover:!bg-sky-50 rounded-full! ps-2! pe-4! py-2!"
                          @click="openWhatsApp"
                      />
                  </div>
              </section>

              <!-- Statistics -->
              <section>
                  <h2 class="font-semibold text-2xl border-b border-gray-300 pb-2 mb-4">Statistics</h2>

                  <div class="text-lg">
                      <p class="text-gray-500 font-medium">Total Members</p>
                      <p class="text-gray-900">{{ organization.total_member }}</p>
                  </div>
              </section>
          </div>

        
        <!-- </div> -->
        
    </div>

    <OrganizationModalAction
      v-if="organization"
      v-model:visible="visibleApprove"
      :isNext="isNextApprove"
      v-model:note="approveNote"
      :orgInfo="{
        name: organization.name,
        contact: `${organization.primary_contact_full_name} / ${organization.primary_contact_phone_number}`,
        email: 'N/A',
        requestedAt: formatDate(organization.created_at)
      }"
      type="approve"
      :onClose="closeModalApprove"
      :onNext="val => isNextApprove = val"
      :onConfirm="confirmApprove"
    />

    <OrganizationModalAction
      v-if="organization"
      v-model:visible="visibleReject"
      :isNext="isNextReject"
      v-model:note="rejectNote"
      :orgInfo="{
        name: organization.name,
        contact: `${organization.primary_contact_full_name} / ${organization.primary_contact_phone_number}`,
        email: 'N/A',
        requestedAt: formatDate(organization.created_at)
      }"
      type="reject"
      :onClose="closeModalReject"
      :onNext="val => isNextReject = val"
      :onConfirm="confirmReject"
    />

    <!-- <Toast /> -->

    <Toast position="top-right" group="custom">
      <template #message="{ message }">
        <div class="flex items-center gap-3 text-gray-800 px-4 py-3 shadow-sm border border-sky-200">
           <Icon icon="bi:check-circle" width="38" height="38" />
          <div>
            <p class="font-medium text-sm">{{ message.summary }}</p>
            <p class="text-sm">{{ message.detail }}</p>
          </div>
        </div>
      </template>
    </Toast>

  </DashboardLayout>

</template>


<!-- Custom template for the toast -->



<style>


</style>
