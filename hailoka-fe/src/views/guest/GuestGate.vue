<script lang="ts" setup>

import MainLayout from '../../layouts/MainLayout.vue';
// import { Icon } from "@iconify/vue";

</script>


<template>
    <MainLayout>
        <div class="flex flex-col justify-between w-full items-center h-screen relative bg-gradient-to-t from-white from-20% via-white/40 to-transparent">
            
            <div class="flex flex-col justify-center items-center mt-20">
                <h1 class="text-3xl font-semibold" >Cloud VoIP</h1>
                <h1 class="mt-4 mb-1 text-center px-4 font-semibold text-lg">Welcome, Jane Doe 👋🏻</h1>
                <h2 class="text-white">Let's get connect</h2>
            </div>

            <div class="flex flex-col h-[70%] w-full gap-2 px-4 pt-6 pb-12 ">

                <img src="/images/phone-scan.png" class="w-48 mt-8 mx-auto" alt="">

                <RouterLink :to="{ name:'ScanBarcode' }" class="mx-auto">
                    <button type="button" class="py-2.5 px-5 rounded-3xl mt-4 bg-cyan-500 w-fit mx-auto text-gray-200 hover:bg-cyan-500 focus:outline-none focus:bg-cyan-500 focus:text-white">
                        Scan QR To Connect
                    </button>
                </RouterLink>
                

                <span class="text-gray-500 flex p-2 w-[200px] text-center mx-auto">
                    Each organization has its unique QR code
                </span>

                <a href="" class="text-amber-600 font-semibold text-lg w-full text-center absolute left-0 bottom-20">Watch the tutorial</a>

            </div>
        </div>
    </MainLayout>

</template>