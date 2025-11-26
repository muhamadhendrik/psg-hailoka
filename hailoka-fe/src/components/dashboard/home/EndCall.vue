<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import { Icon } from '@iconify/vue'
import { Button } from 'primevue'
import Dropdown from "primevue/dropdown";

const visible = ref(true)

const position = ref('center');

const roles = [
  {
    label: 'Bussines Center',
    value: 2,
    description: 'Open: 04:00 - 23:59'
  },
  {
    label: 'Laundry',
    value: 4,
    description: 'Closed: 06:00 - 18:00'
  },
  {
    label: 'Restauran A',
    value: 3,
    description: 'Curently unuvailable'
  }
]

const form = ref({
  roleId: null,
})

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



// const mute = () => console.log('Mute clicked')
// const speaker = () => console.log('Speaker clicked')
// const hold = () => console.log('Hold clicked')
// const transfer = () => console.log('Transfer clicked')
// const endCall = () => {
//   console.log('Call ended')
//   visible.value = false
// }

// const controls = [
//   { label: 'Mute', icon: 'mdi:microphone-off', action: mute },
//   { label: 'Speaker', icon: 'mdi:volume-high', action: speaker },
//   { label: 'Hold', icon: 'mdi:pause', action: hold },
//   { label: 'Transfer', icon: 'mdi:swap-horizontal', action: transfer },
// ]
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
    :style="{ width: '500px', borderRadius: '12px', overflow: 'hidden', padding: '0' }"
    class="pickup-dialog"
  >
    <!-- Header -->
    <template #header>

      <div class="w-full bg-[#00703C] text-white flex flex-col p-4 rounded-t-lg">

        <div class="flex justify-between items-center border-b py-4">
          <span class="text-lg font-medium">End Call</span>
          <Icon icon="mdi:close" class="cursor-pointer size-6" @click="visible = false" />
        </div>
        
        <div class="flex items-center mt-4">
          <div class="rounded-full bg-transparent border-2 bg-opacity-20 p-3 mr-4">
            <Icon icon="solar:call-chat-linear" width="24" height="24" />
          </div>

          <div>
            <div class="font-semibold text-lg">Alan Maker</div>
            <div class="text-sm opacity-90">In Call - 00:05:34</div>
          </div>
        </div>
      </div>

    </template>

    <!-- Body -->
    <!-- <div class="bg-white p-6 flex flex-col items-center space-y-6">

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

      
      <div class="flex flex-col gap-4 justify-center space-x-6 mt-2">

        <p class="text-gray-900">
            Are you sure you want to end this call? The guest and staff will be disconnected immediately.
        </p>

        <p class="text-sm">
            Note: Once ended, this call cannot be resumed.
        </p>

      </div>

      <div class="flex items-center justify-between w-full space-y-2">
            <Button variant="outlined" class="rounded-full! border-cyan-600! text-cyan-600! font-semibold">Cancel</Button>
            <div class="flex gap-3">
                <Button variant="text" class="rounded-full! bg-amber-600! text-white! font-semibold">Transfer</Button>
                <Button variant="text" class="rounded-full! bg-red-400! text-white! font-semibold">End Call</Button>
            </div>
        </div>
      
    </div> -->

    <div class="bg-white py-4 px-0 flex flex-col space-y-6">
        <Button variant="link" class="text-gray-800! w-fit mb-2"> <Icon icon="line-md:chevron-left" width="24" height="24" /> Transfer Call</Button>

        <div class="px-4 py-0 space-y-2">
            <h3 class="text-gray-500">Current Extension</h3>
            <h2 class="text-gray-700 font-semibold">Restaurant</h2>
        </div>

        <div class="px-4">
            <label for="role" class="block text-gray-700 font-medium mb-2">
                Transfer to
            </label>
            <Dropdown
                id="role"
                v-model="form.roleId"
                :options="roles"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Extension"
                class="w-full rounded-full! border-sky-300! focus:border-sky-400! focus:ring-0!"
            >
                <template #option="slotProps">
                    <div class="flex items-center gap-2">
                        <span class="font-medium text-gray-800">{{ slotProps.option.label }}</span>
                        <span class="text-sm text-cyan-600">{{ slotProps.option.description }}</span>
                    </div>
                </template>
            </Dropdown>
        </div>

        <div class="px-4 flex justify-between">
            <Button variant="outlined" class="border-sky-500! text-sky-500! rounded-full!">Cancel</Button>
            <Button variant="outlined" class="border border-gray-500! text-gray-500! rounded-full!">Confirm Transfer</Button>

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
