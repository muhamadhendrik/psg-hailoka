<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";

const callDuration = ref("00:00:00");
const muted = ref(true);

let timer: any;
let seconds = 0;

onMounted(() => {
  timer = setInterval(() => {
    seconds++;
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    callDuration.value = `${h}:${m}:${s}`;
  }, 1000);
});

onUnmounted(() => clearInterval(timer));

function toggleMute() {
  muted.value = !muted.value;
}

// function endCall() {
//   console.log("Call ended");
//   // emit or handle end call logic
// }

function toggleSpeaker() {
  console.log("Speaker toggled");
}

// Modal confirmation


import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const visible = ref(false)

const openDialog = () => (visible.value = true)
const closeDialog = () => (visible.value = false)
const confirmEndCall = () => {
  console.log('Call ended')
  visible.value = false
}


</script>

<template>
  <div class="flex flex-col items-center justify-between min-h-screen bg-sky-600 text-white py-10">
    <!-- Header -->
    <div class="text-center mt-6">
      <h2 class="text-xl font-medium">Cloud VoIP</h2>
    </div>

    <!-- Middle Section -->
    <div class="flex flex-col items-center text-center mt-10 space-y-4">
      <div class="p-6 bg-white rounded-2xl">
        <!-- <Icon icon="mdi:do-not-disturb" class="text-white text-5xl" /> -->
         <img src="/images/icons/other.png" alt="">
      </div>
      <div class="text-sm">Connected with Room Service</div>
      <div class="text-lg font-medium">Anna</div>
      <div class="mt-2">
        <div class="text-sm font-mono">{{ callDuration }}</div>
        <div class="text-sm opacity-80">{{ muted ? "Muted" : "Unmuted" }}</div>
      </div>
    </div>

    <!-- Footer Controls -->
    <div class="flex items-center justify-center gap-10 mb-6">
      <!-- Mute -->
      <div class="flex flex-col items-center">
        <button
          @click="toggleMute"
          class="flex items-center justify-center w-12 h-12 rounded-full transition"
        >
          <Icon
            :icon="muted ? 'mdi:microphone-off' : 'mdi:microphone'"
            class="text-white text-2xl"
          />
        </button>
        <!-- <span class="text-sm mt-1">Mute</span> -->
      </div>

      <!-- End Call -->
      <div class="flex flex-col items-center">
        <button
          @click="openDialog"
          class="flex items-center justify-center w-24 h-10 rounded-full bg-red-500 hover:bg-red-600 transition shadow-lg"
        >
          <span class="">End Call</span>
        </button>
        <!-- <span class="text-sm mt-1">End Call</span> -->
      </div>

      <!-- Speaker -->
      <div class="flex flex-col items-center">
        <button
          @click="toggleSpeaker"
          class="flex items-center justify-center w-12 h-12 rounded-full transition"
        >
          <Icon icon="mdi:volume-high" class="text-white text-2xl" />
        </button>
        <!-- <span class="text-sm mt-1">Speaker</span> -->
      </div>
    </div>
  </div>

  <Dialog
      v-model:visible="visible"
      modal
      :draggable="false"
      :closable="false"
      class="rounded-2xl shadow-lg w-80 sm:w-96"
    >
      <div class="text-center">
        <h2 class="text-lg font-semibold mb-2">End Call?</h2>
        <p class="text-gray-600 mb-6">This will end your current call.</p>

        <div class="flex justify-between gap-4">
          <Button
            label="Cancel"
            outlined
            class="border-2! border-sky-500! text-sky-500! rounded-full! px-6!"
            @click="closeDialog"
          />
          <Button
            label="End Call"
            class="bg-red-400! text-white rounded-full! px-6! border-none!"
            @click="confirmEndCall"
          />
        </div>
      </div>
    </Dialog>
</template>

<style scoped>
/* Optional subtle gradient background */
.bg-sky-600 {
  background-color: #00A1C3;
}
</style>
