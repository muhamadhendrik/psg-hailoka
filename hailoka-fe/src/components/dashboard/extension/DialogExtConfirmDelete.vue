<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="true"
    class="w-full sm:w-[400px] rounded-2xl overflow-hidden"
    header="Delete staff"
  >
    <!-- Title -->
    <div class="flex justify-between items-center border-b border-gray-200">
      <button @click="visible = false" class="text-gray-500 hover:text-gray-700">
        <i class="pi pi-times text-lg"></i>
      </button>
    </div>

    <!-- Message -->
    <div class="py-4 space-y-3">
      <p class="text-gray-800 text-base">
        Are you sure you want to delete extension
        <span class="font-semibold text-gray-900">"{{ extName }}"</span>?
      </p>
      <p class="text-gray-500 text-sm">
        This action will permanently remove the extension and its settings. Calls to this extension will no longer be connected..
      </p>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-4">
      <Button
        label="Cancel"
        outlined
        class="border-sky-400 text-sky-500 hover:bg-sky-50 rounded-full px-5"
        @click="onCancel"
      />
      <Button
        label="Delete"
        severity="danger"
        class="bg-red-400 text-white hover:bg-red-500 rounded-full px-5 border-0"
        @click="onDelete"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps<{
  visible: boolean;
  extName: string;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "confirmDelete"): void;
}>();

const visible = ref(props.visible);

watch(
  () => props.visible,
  (val) => (visible.value = val)
);

watch(visible, (val) => emits("update:visible", val));

function onCancel() {
  visible.value = false;
}

function onDelete() {
  emits("confirmDelete");
  visible.value = false;
}
</script>

<style scoped>
.p-dialog-content {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem !important;
}
</style>
