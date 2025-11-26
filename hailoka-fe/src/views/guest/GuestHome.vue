<script lang="ts" setup>

import { Icon } from '@iconify/vue';
import MainLayout from '../../layouts/MainLayout.vue';
import { ref } from 'vue';
// import { Icon } from "@iconify/vue";

const openDropdown = ref(false);



interface Extension {
  name: string
  icon: string
}

const extensions: Extension[] = [
  { name: 'Receptionist', icon: '/images/icons/baverage.png' },
  { name: 'Room Service', icon: '/images/icons/other.png' },
  { name: 'Engineer', icon: '/images/icons/gear.png' },
  { name: 'Restaurant', icon: '/images/icons/utensil.png' },
  { name: 'Laundry', icon: '/images/icons/loundry.png' },
  { name: 'Fitness Center', icon: '/images/icons/gym.png' },
  { name: 'Security', icon: '/images/icons/shield.png' },
]

function handleSelect(extension: Extension) {
  console.log('Selected extension:', extension.name)
  // You could emit an event or call an API here
}

</script>


<template>
    <MainLayout>
        <div class="flex flex-col w-full items-center h-screen relative bg-gradient-to-t from-white from-20% via-white/40 to-transparent">
            
            <div class="flex flex-col justify-center items-center mt-10">
                <h1 class="text-3xl font-semibold" >Cloud VoIP</h1>
                <!-- <h1 class="my-4 text-center px-4">Home Page</h1> -->
            </div>

            <div class="flex w-full flex-col mt-8 px-4">

                <h1 class="my-2 font-medium">Connected as Guest</h1>

                <div class="flex items-center justify-between relative">
                    <h1 class="font-medium">John Doe</h1>

                    <button  
                        @click="openDropdown = !openDropdown"
                        type="button" 
                        class="py-1.5 px-3 rounded w-fit hover:cursor-pointer"
                    >
                        <Icon icon="pepicons-pencil:dots-y" width="24" height="24" />
                    </button>

                    <div v-if="openDropdown" class="absolute right-0 -bottom-20 mt-2 w-40 bg-white border border-gray-100 rounded-md shadow-lg z-10">

                        <ul class="py-1 text-sm text-gray-700">
                            <li>
                                <button 
                                    
                                    class="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                >
                                    Disconect
                                </button>
                            </li>
                            <li>
                                <button  class="block w-full px-4 py-2 text-left hover:bg-gray-100">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="h-[200px] w-full bg-[url('/images/user-hero-banner.png')] bg-cover bg-[-80px_center] mt-4 p-3 rounded-3xl relative">
                    <p>You are currently connect to</p>

                    <h1 class="text-2xl font-semibold mt-2">Green Living Residance</h1>

                    <p class="absolute bottom-3 text-lg">Bussines No. 888-999-000</p>
                </div>

            </div>

            <div class="w-full bg-white px-4 pt-14 -mt-12">
                    <h2 class="text-lg font-medium text-gray-800 mb-4">Select Extension to Call</h2>

                    <div class="grid grid-cols-3 gap-4">

                        <div class="flex flex-col gap-3" v-for="ext in extensions">

                            <div
                               
                                :key="ext.name"
                                @click="handleSelect(ext)"
                                class="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-sky-50 cursor-pointer transition-all border border-gray-300 hover:border-sky-200"
                                >
                                    <img
                                    :src="ext.icon"
                                    :alt="ext.name"
                                    class="w-10 h-10 object-contain mb-2 transition-transform duration-200 hover:scale-105"
                                    />
                                
                            </div>

                            <span class="text-sm font-medium text-gray-800 text-center">{{ ext.name }}</span>

                        </div>
                        
                    </div>


                </div>

        </div>
    </MainLayout>

</template>