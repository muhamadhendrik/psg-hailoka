<script setup lang="ts">
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  visible: boolean,
  isNext: boolean,
  note: string,
  orgInfo: {
    name: string,
    contact: string,
    email: string,
    requestedAt: string
  },
  type: 'approve' | 'reject',
  onClose: () => void,
  onNext: (next: boolean) => void,
  onConfirm: () => void
}>();

const emit = defineEmits(['update:visible', 'update:note']);

// Local proxy for visible
const visibleProxy = ref(props.visible);
watch(() => props.visible, val => visibleProxy.value = val);
watch(visibleProxy, val => emit('update:visible', val));

// To allow v-model for note
const noteProxy = ref(props.note);
watch(noteProxy, val => emit('update:note', val));
watch(() => props.note, val => noteProxy.value = val);
</script>

<template>
  <Dialog
    v-model:visible="visibleProxy"
    modal
    :draggable="false"
    :closable="false"
    class="custom-dialog w-6xl"
  >
    <!-- Header -->
    <template #header>
      <div class="flex justify-between items-center w-full border-b pb-3">
        <h2 v-if="!isNext" class="text-lg font-semibold text-gray-800">
          {{ type === 'approve' ? 'Approve Organization' : 'Reject Organization' }}
        </h2>
        <Button v-else variant="link" @click="onNext(false)" class="text-black!">
          <Icon icon="material-symbols:arrow-back-ios-rounded" width="21" height="21" />
          <span class="font-semibold">
            {{ type === 'approve' ? 'Confirm Organization' : 'Confirm Rejection' }}
          </span>
        </Button>
        <Button text rounded @click="onClose" class="text-gray-500! hover:text-gray-700! hover:bg-white!">
          <Icon icon="material-symbols:close-rounded" width="24" height="24" />
        </Button>
      </div>
    </template>

    <!-- Body -->
    <div class="bg-white space-y-6">
      <!-- Organization Info -->
      <div class="space-y-2 text-sm text-gray-700">
        <p class="flex gap-2">
          <span class="font-medium text-lg text-gray-900">Organization :</span>
          <span class="text-lg">{{ orgInfo.name }}</span>
        </p>
        <p class="flex gap-2">
          <span class="font-medium text-lg text-gray-900">Contact Person / Phone :</span>
          <span class="text-lg">{{ orgInfo.contact }}</span>
        </p>
        <p class="flex gap-2">
          <span class="font-medium text-lg text-gray-900">Email :</span>
          <span class="text-lg">{{ orgInfo.email }}</span>
        </p>
        <p class="flex gap-2">
          <span class="font-medium text-lg text-gray-900">Requested At :</span>
          <span class="text-lg">{{ orgInfo.requestedAt }}</span>
        </p>
      </div>

      <!-- Notes -->
      <div class="space-y-2">
        <label for="notes" class="block font-medium text-gray-900">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          v-model="noteProxy"
          v-if="!isNext"
          :placeholder="type === 'approve'
            ? 'Add an optional note for the organization owner (e.g., additional instructions, welcome message).'
            : 'Add an optional note for the organization owner (e.g., reason for rejection, etc.).'"
          class="w-full h-28 border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none"
        ></textarea>
        <p class="text-base pb-4 border-b" v-else>
          {{ note }}
        </p>
        <p class="text-sm text-gray-500" v-if="!isNext">
          Your note will be included in the
          {{ type === 'approve' ? 'approval' : 'rejection' }}
          notification sent to the organization's contact person via email/WhatsApp.
        </p>
        <p class="text-base" v-else>
          {{ type === 'approve'
            ? 'Are you sure you want to approve this organization? Once approved, the organization will become active and accessible to its owner and staff.'
            : 'Are you sure you want to reject this organization? This action cannot be undone. The contact person will be notified along with your notes.' }}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-between gap-3 pt-3 w-full">
        <Button
          label="Cancel"
          outlined
          @click="onClose"
          class="!border-sky-500 !text-sky-500 rounded-full! px-6! hover:!bg-sky-50"
        />
        <Button
          label="Next"
          v-if="!isNext"
          @click="onNext(true)"
          class="!bg-sky-500 hover:!bg-sky-600 rounded-full! px-6!"
        />
        <Button
          v-else
          :label="type === 'approve' ? 'Confirm Approve' : 'Confirm Reject'"
          @click="onConfirm"
          :class="type === 'approve'
            ? '!bg-sky-500 hover:!bg-sky-600'
            : '!bg-red-600 hover:!bg-red-700'
          + ' rounded-full! px-6! py-3 text-white hover:cursor-pointer'"
        />
      </div>
    </template>
  </Dialog>
</template>

<!-- <script setup lang="ts">
import { ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  visible: boolean,
  isNext: boolean,
  note: string,
  orgInfo: {
    name: string,
    contact: string,
    email: string,
    requestedAt: string
  },
  type: 'approve' | 'reject',
  onClose: () => void,
  onNext: (next: boolean) => void,
  onConfirm: () => void
}>();

// To allow v-model for note
const noteProxy = ref(props.note);
watch(noteProxy, val => emit('update:note', val));
watch(() => props.note, val => noteProxy.value = val);

const emit = defineEmits(['update:note']);
</script> -->