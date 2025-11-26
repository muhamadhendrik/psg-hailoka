<script lang="ts" setup>

import { ref } from 'vue';
import MainLayout from '../../layouts/MainLayout.vue';
import { Icon } from '@iconify/vue';

// Local state
const showPassword = ref(false)
const password = ref("")

</script>

<template>
     <MainLayout>

        <div class="w-1/2 h-full lg:block hidden bg-[url('/images/rectangle-orange.png')] bg-[1020px] rounded-s-2xl"></div>

        <div class="w-1/2 flex flex-col px-40 py-16 lg:justify-between items-center h-full bg-white rounded-e-2xl">
            

            <img src="/images/phone-cloud.png" class="w-48" alt="">

            <div class="flex flex-col justify-end w-full gap-2 px-4">

                <p class="font-semibold text-2xl">Join Cloud VoIP Super Admin</p>
                <p>Fill in the details below to create your account.</p>

                <form class="mt-4">

                    <div class="mb-5">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
                            Full Name <span class="text-red-600">*</span>
                        </label>
                        <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 block w-full p-2.5" placeholder="name@flowbite.com" required />
                    </div>

                    <div class="mb-5">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
                            Email <span class="text-red-600">*</span>
                        </label>
                        <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 block w-full p-2.5" placeholder="name@flowbite.com" required />
                    </div>

                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900">
                            Password <span class="text-red-600">*</span>
                        </label>

                    <div class="relative mb-5">
                        <input
                            name="passs"
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 block w-full p-2.5"
                        />

                        <!-- Toggle button -->
                        <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                            @click="showPassword = !showPassword"
                        >
                            <Icon v-if="!showPassword" icon="mdi:eye" class="w-5 h-5" />
                            <!-- <Icon  icon="mdi-light:eye" width="24" height="24" /> -->
                            <Icon v-else icon="mdi:eye-off" class="w-5 h-5"/>
                        </button>
                    </div>

                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900">
                            Confirm Password <span class="text-red-600">*</span>
                    </label>

                    <div class="relative mb-5">
                        <input
                            name="passs"
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 block w-full p-2.5"
                        />

                        <!-- Toggle button -->
                        <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                            @click="showPassword = !showPassword"
                        >
                            <Icon v-if="!showPassword" icon="mdi:eye" class="w-5 h-5" />
                            <!-- <Icon  icon="mdi-light:eye" width="24" height="24" /> -->
                            <Icon v-else icon="mdi:eye-off" class="w-5 h-5"/>
                        </button>
                    </div>

                    <button type="submit" class="py-3 px-5 text-gray-700 bg-gray-200 hover:bg-cyan-500 font-medium rounded-3xl w-full text-center">Register Now</button>
                </form>

                <!-- <button type="button" class="py-2.5 px-5 mt-4 rounded-3xl flex gap-3 justify-center items-center bg-white shadow-md border border-gray-100 text-gray-600">
                    <Icon icon="material-icon-theme:google" class="size-7" />
                    <span>Sign in with Google</span>
                </button> -->

                <p class="text-center mt-4">
                    Already have account? <a href="" class="text-cyan-500">Login Now</a>
                </p>
                    
            </div>

        </div>
    </MainLayout>
</template>