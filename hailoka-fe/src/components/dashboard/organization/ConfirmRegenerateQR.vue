<template>
  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    :closable="false"
    class="w-full sm:w-[400px] rounded-2xl overflow-hidden"
  >
    <!-- Header -->
    <template #header>
      <div class="flex justify-between items-center w-full border-b pb-3">
        <h2 class="text-lg font-semibold text-gray-800">
          Regenerate QR Code
        </h2>
        <button
          @click="onCancel"
          class="text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full p-1">
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>
    </template>

    <!-- Message -->
    <div class="py-4 space-y-3">
      <p class="text-gray-800 text-base">
        Are you sure you want to regenerate the QR code? The current QR code will be replaced with a new one.
      </p>
      <p class="text-gray-500 text-sm">
        Anyone with the old QR code will no longer be able to use it.
      </p>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-3 pt-4">
        <Button
          label="Cancel"
          outlined
          class="border-sky-400 text-sky-500 hover:bg-sky-50 rounded-full px-5"
          @click="onCancel"
        />
        <Button
          label="Regenerate"
          class="!bg-sky-500 !text-white hover:!bg-sky-600 rounded-full px-5 border-0"
          @click="onConfirm"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps<{
  visible: boolean;
}>();

const emits = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "confirm"): void;
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

function onConfirm() {
  emits("confirm");
  visible.value = false;
}
</script>

<style scoped>
.p-dialog-content {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem !important;
}
</style>

