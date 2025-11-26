<template>
  <Dialog
    v-model:visible="visible"
    :header="computedHeader"
    modal
    :style="{ width: '28rem' }"
    class="rounded-2xl"
  >
    <div class="space-y-4">
      <p class="text-gray-700">
        Are you sure you want to {{ actionWord }} this user?
      </p>

      <div class="text-gray-700 space-y-1">
        <p>
          <span class="font-semibold">Name:</span>
          <span class="text-gray-900">{{ user.name }}</span>
        </p>
        <p>
          <span class="font-semibold">Email:</span>
          <span class="text-gray-900">{{ user.email }}</span>
        </p>
        <p>
          <span class="font-semibold">Total Organizations:</span>
          <span class="text-gray-900">{{ user.totalOrganizations }}</span>
        </p>
      </div>

      <p class="text-sm text-gray-500 leading-snug">
        If this user is an Organization Owner, {{ actionWord }}ing them will also
        {{ actionWord }} the entire organization. All staff under the organization will
        remain active.
      </p>

      <div class="flex justify-end gap-2 pt-2">
        <Button
          label="Cancel"
          outlined
          class="!border-sky-400 !text-sky-500 hover:!bg-sky-50"
          @click="$emit('close')"
        />
        <Button
          :label="buttonLabel"
          :severity="isSuspend ? 'danger' : 'success'"
          class="!text-white"
          @click="$emit('confirm', user)"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

interface User {
  name: string;
  email: string;
  totalOrganizations: number;
}

const props = defineProps<{
  visible: boolean;
  user: User;
  isSuspend: boolean; // true = suspend, false = activate
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", user: User): void;
}>();

const computedHeader = computed(() =>
  props.isSuspend ? "Suspend User" : "Activate User"
);

const buttonLabel = computed(() =>
  props.isSuspend ? "Suspend User" : "Activate User"
);

const actionWord = computed(() =>
  props.isSuspend ? "suspend" : "activate"
);

const visible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) emit("close");
  },
});
</script>

<style scoped>
.p-dialog .p-dialog-content {
  border-radius: 1rem;
}
</style>
