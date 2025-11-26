<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
// import { storeToRefs } from "pinia";

import { useStaffSelectionStore } from "../../../stores/staffSelection";
import { staffServices } from "../../../services/staffService";
import { useRoute } from "vue-router";

const route = useRoute()
const organizationId = route.params.organizationId

const visible = defineModel<boolean>("visible", { default: false });
const staffSelection = useStaffSelectionStore();

// const { selectedStaff } = storeToRefs(staffSelection);

// watch(selectedStaff, (newValue, oldValue) => {
//   console.log('someStateProperty changed:', newValue, oldValue);
// });

const loading = ref(false)
const error = ref("")

interface Staff {
  user_id: string;
  name: string;
}

// example data
const staffList = ref<Staff[]>([]);

const search = ref("");

async function fetchStaffs() {

  try {
    
    loading.value = true;
    error.value = "";
    const response = await staffServices.getStaffSelection(organizationId as string)    
    staffList.value = response.data.staffs


  } catch (err: any) {

    console.error("Error fetching staff:", err);
    error.value = err.response?.data?.message || "Failed to fetch staff.";

  } finally {

    loading.value = false;

  }
}

onMounted(fetchStaffs)

const filteredStaff = computed(() => {
  const q = (search.value || "").toLowerCase();

  return staffList.value.filter((s) => {    

    const name = (s?.name ?? "").toLowerCase();
    return name.includes(q);
  });
});

const allSelected = computed({
  get: () =>
    staffSelection.selectedStaff.length > 0 &&
    staffSelection.selectedStaff.length === staffList.value.length,
  set: (val) => {
    if (val) staffSelection.selectAll(staffList.value);
    else staffSelection.deselectAll();
  },
});

const handleSave = () => {
  console.log("Selected staff:", staffSelection.selectedStaff);
  visible.value = false;
};

// const isSelected = (id: string) => {
//   return staffSelection.selectedStaff.some((s) => s.user_id === id);
// };

// const toggleSelection = (staff: Staff, checked: boolean) => {
//   if (checked) staffSelection.add(staff);
//   else staffSelection.remove(staff.user_id);
// };

// watch(visible, (val) => {
//   if (val) {
//     // Force reactivity update when dialog opens
//     staffSelection.selectedStaff = [...staffSelection.selectedStaff];
//   }
// });

// console.log("staffSelection.selectedStaff dialog >>>>>>>", staffSelection.selectedStaff);


</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Select Staff"
    class="w-[28rem] rounded-2xl overflow-hidden"
  >
    <div class="space-y-4">
      <p class="text-gray-600">You can select one or more staff.</p>

      <!-- Search Input -->
      <div class="relative">
        <InputText
          v-model="search"
          placeholder="Search"
          class="w-full rounded-full pl-10 border-gray-300 focus:border-sky-400 focus:ring-sky-400"
        />
        <i
          class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      <!-- Select All -->
      <div class="flex justify-end">
        <button
          class="text-sky-500 text-sm font-medium hover:underline"
          @click="allSelected = !allSelected"
        >
          {{ allSelected ? "Deselect All" : "Select All" }}
        </button>
      </div>

      <!-- Staff List -->
      <div class="max-h-64 overflow-y-auto divide-y divide-gray-100">
        <div
          v-for="staff in filteredStaff"
          :key="staff.user_id"
          class="flex items-center justify-between py-2"
        >
          <span class="text-gray-700">{{ staff.name }}</span>
          <Checkbox
            :inputId="`staff-${staff.user_id}`"
            :value="staff"
            v-model="staffSelection.selectedStaff"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="pt-3">
        <Button
          label="Save"
          :class=" (staffSelection.selectedStaff.length > 0 ? 'bg-sky-500!':'bg-gray-200! text-gray-600! border-0!') + ' w-full! border-0! text-white hover:bg-sky-600 rounded-full!'"
          @click="handleSave"
        >
          <template #default>
            Save ({{ staffSelection.selectedStaff.length }} selected)
          </template>
        </Button>
      </div>
    </div>
  </Dialog>
</template>
