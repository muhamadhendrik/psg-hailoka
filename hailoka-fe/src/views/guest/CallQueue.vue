<script setup lang="ts">
import { ref } from "vue"
import { Icon } from "@iconify/vue"

const queuePosition = ref(3)
const estimatedWait = ref("02:15")

const endCall = () => {
  console.log("Call ended")
}

const toggleMute = () => {
  console.log("Toggle mute")
}

const toggleSpeaker = () => {
  console.log("Toggle speaker")
}
</script>

<template>
  <div class="flex flex-col items-center justify-between h-screen py-8 bg-white text-center">
    <!-- Header -->
    <div class="mt-6">
      <h1 class="text-xl font-semibold text-gray-800">Cloud VoIP</h1>
    </div>

    <!-- Main Content -->
    <div>
      <img
        src="/images/icons/clock-vector.png"
        alt="Queue Illustration"
        class="w-28 h-28 mx-auto mb-4"
      />
      <p class="text-gray-500">Connected with Room Service</p>
      <p class="text-gray-800 font-medium">You are in queue</p>
      <p class="text-gray-800 font-semibold">#{{ queuePosition }} in line</p>

      <p class="text-gray-500 italic mt-6">
        Estimated wait - <span class="font-medium">{{ estimatedWait }}</span> minutes
      </p>
    </div>

    <!-- Bottom Controls -->
    <div class="flex items-center justify-center gap-8 mt-8 mb-6">
      <button
        @click="toggleMute"
        class="text-gray-800 hover:text-gray-900 transition"
      >
        <Icon icon="mdi:microphone-outline" class="text-2xl" />
      </button>

      <button
        @click="endCall"
        class="bg-red-400 text-white font-medium px-6 py-2 rounded-full shadow-sm hover:bg-red-500 transition"
      >
        End Call
      </button>

      <button
        @click="toggleSpeaker"
        class="text-gray-800 hover:text-gray-900 transition"
      >
        <Icon icon="mdi:volume-high" class="text-2xl" />
      </button>
    </div>
  </div>
</template>
