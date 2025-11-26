<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import { Icon } from '@iconify/vue'
// import { Button } from 'primevue'
// import Dropdown from "primevue/dropdown";

const visible = ref(true)

const position = ref('bottomright');

// const roles = [
//   {
//     label: 'Bussines Center',
//     value: 2,
//     description: 'Open: 04:00 - 23:59'
//   },
//   {
//     label: 'Laundry',
//     value: 4,
//     description: 'Closed: 06:00 - 18:00'
//   },
//   {
//     label: 'Restauran A',
//     value: 3,
//     description: 'Curently unuvailable'
//   }
// ]

// const form = ref({
//   roleId: null,
// })

// const onDecline = () => {
//   console.log('Call declined')
//   visible.value = false
// }
// const onPickup = () => {
//   console.log('Call picked up')
//   visible.value = false
// }
// const onTransfer = () => {
//   console.log('Transfer clicked')
// }



const mute = () => console.log('Mute clicked')
const speaker = () => console.log('Speaker clicked')
const hold = () => console.log('Hold clicked')
const transfer = () => console.log('Transfer clicked')
const endCall = () => {
  console.log('Call ended')
  visible.value = false
}

const controls = [
  { label: 'Mute', icon: 'mdi:microphone-off', action: mute },
  { label: 'Speaker', icon: 'mdi:volume-high', action: speaker },
  { label: 'Hold', icon: 'mdi:pause', action: hold },
  { label: 'Transfer', icon: 'mdi:swap-horizontal', action: transfer },
]
</script>



<template>
  <Dialog
    v-model:visible="visible"
    modal
    dismissableMask
    :position="position"
    :pt="{
        header: { class: 'pickup-dialog-header' }
    }"
    contentClass="p-0!"
    :closable="false"
    :style="{ width: '400px', borderRadius: '12px', overflow: 'hidden', padding: '0' }"
    class="pickup-dialog"
  >
    <!-- Header -->
    <template #header>

      <div class="w-full bg-[#00703C] text-white flex flex-col p-4 rounded-t-lg">

        <div class="flex justify-between items-center border-b py-4">
          <span class="text-lg font-medium">In Call</span>
          <Icon icon="mdi:close" class="cursor-pointer size-6" @click="visible = false" />
        </div>
        
        <div class="flex items-center mt-4">
          <div class="rounded-full bg-transparent border-2 bg-opacity-20 p-3 mr-4">
            <Icon icon="solar:call-chat-linear" width="24" height="24" />
          </div>

          <div>
            <div class="font-semibold text-lg">Alan Maker</div>
            <div class="text-sm opacity-90">00:05:34</div>
          </div>
        </div>
      </div>

    </template>

    <!-- Body -->
    <div class="bg-white p-6 flex flex-col items-center space-y-6">

      <div class="flex items-center justify-between w-full px-4">

        <div class="flex flex-col items-center space-y-1">
          <div class="bg-cyan-100 rounded-full p-3">
            <Icon icon="mdi:silverware-fork-knife" class="text-cyan-600" width="20" height="20" />
          </div>
        </div>

        <div class="border-t border-dashed border-cyan-200 w-full"></div>

        <div class="flex flex-col items-center space-y-1 opacity-60">
          <div class="bg-cyan-100 rounded-full p-3">
            <Icon icon="mdi:account-outline" class="text-cyan-600" width="20" height="20" />
          </div>
        </div>

      </div>

      <div class="flex items-center justify-between w-full px-4">
        <span class="text-sm font-medium">Restaurant</span>
        <span class="text-sm font-medium">John Doe</span>
      </div>

      
      <div class="flex justify-center space-x-6 mt-2">

        <div class="grid grid-cols-2 gap-8">
            <div v-for="control in controls" :key="control.label" class="flex flex-col items-center space-y-2 cursor-pointer" @click="control.action()">

                <div class="rounded-full bg-cyan-100 text-cyan-600 p-3 hover:bg-cyan-200 transition" >
                    <Icon :icon="control.icon" width="28" height="28" />
                </div>
                <span class="text-sm font-medium text-gray-700">{{ control.label }}</span>
            </div>
        </div>

      </div>

      <div class="flex flex-col items-center space-y-2">
            <div class="rounded-full bg-red-500 text-white p-3 hover:bg-red-600 cursor-pointer transition" @click="endCall" >
                <Icon icon="mdi:phone-hangup" width="28" height="28" />
            </div>
            <span class="text-sm font-medium text-gray-700">End Call</span>
        </div>
      
    </div>

  </Dialog>
</template>

<style>
    /* .pickup-dialog ::v-deep(.p-dialog-header) {
    display: none;
    } */

    .pickup-dialog-header {
        padding: 0px !important;
    }
</style>
