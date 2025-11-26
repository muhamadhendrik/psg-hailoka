<script setup lang="ts">
import { useStaffSelectionStore } from '../../../stores/staffSelection';

const staffSelection = useStaffSelectionStore();

const handleRemove = (id: string) => {
  staffSelection.remove(id);
};

</script>

<template>
  <div class="max-h-64 overflow-y-auto rounded-lg border border-gray-200 p-3">
    <div
      v-for="staff in staffSelection.selectedStaff"
      :key="staff.user_id"
      class="flex items-center gap-3 py-1"
    >
      <!-- Remove Button -->
      <button
        @click="handleRemove(staff.user_id)"
        class="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
      >
        <i class="pi pi-minus text-xs"></i>
      </button>

      <!-- Staff Name -->
      <span class="text-gray-700">
        {{ staff.name }}
      </span>
    </div>
  </div>
</template>
