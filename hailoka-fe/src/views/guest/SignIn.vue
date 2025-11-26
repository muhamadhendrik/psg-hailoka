<script lang="ts" setup>

import MainLayout from '../../layouts/MainLayout.vue';

</script>

<template>
    <MainLayout>
        <div class="flex flex-col w-full justify-center items-center h-screen">
            <h1 class="text-3xl font-bold" >Cloud VoIP</h1>

            <div class="flex flex-col w-[350px]">

                <div class="flex w-full gap-3 items-center mt-4">

                    <img src="/images/people.png" alt="">
                    <h1 class="text-2xl font-semibold">
                        Please Input Some Information as a Guest
                    </h1>

                </div>

                <div class="flex gap-3 w-full mt-6">

                    <input type="text" class="w-3/4 border px-2 rounded-2xl text-center" placeholder="Input Your Name">

                    <button type="button" class="w-1/4 p-2 rounded-2xl bg-gray-300">SUBMIT</button>

                </div>

                <hr class="w-3/4 mx-auto my-8">

                <div class="flex w-full">
                    <button type="button" class="p-3 bg-gray-300 w-full rounded-2xl">Or You Can Sign In With Google</button>
                </div>

            </div>

        </div>
    </MainLayout>
    
</template>