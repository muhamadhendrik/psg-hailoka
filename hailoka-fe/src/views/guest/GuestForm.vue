<script lang="ts" setup>

import { ref } from 'vue';
import MainLayout from '../../layouts/MainLayout.vue';
import { Icon } from "@iconify/vue";
import { authService } from "../../services/authService";
import type { GuestRegisterPayload } from "../../services/authService";
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

async function submit() {
  error.value = "";
  success.value = "";
  if (!name.value.trim()) {
    error.value = "Please enter your name";
    return;
  }

  loading.value = true;
  try {
    const payload: GuestRegisterPayload = { name: name.value.trim() };
    const res = await authService.guestRegister(payload);

    // server response example: { id, name, token? }
    success.value = "Registration successful";

    // optional: if backend returns a token or guest id, save it
    if (res.data?.token) {
      localStorage.setItem("guest_token", res.data.token);
    }

    if (res.data?.id) {
      localStorage.setItem("guest_id", res.data.id);
    }

    // navigate to guest home after a short delay
    setTimeout(() => router.push("/guest/gate"), 700);
    
  } catch (err: any) {
    error.value = err?.response?.data?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
}

</script>


<template>
    <MainLayout>
        <div class="flex flex-col w-full items-center h-screen relative bg-gradient-to-t from-white from-20% via-white/40 to-transparent">
            
            <div class="flex flex-col justify-center items-center mt-20">
                <h1 class="text-3xl font-semibold" >Get Started</h1>
                <h1 class="my-4 text-center px-4">Connect your team and customers with enterprise-grade voice solutions.</h1>
            </div>

            <img src="/images/phone-cloud.png" class="w-48" alt="">

            <div class="flex flex-col h-[500px] justify-end w-full gap-2 px-4 pt-6 pb-12 absolute bottom-0">

                <p class="text-center mb-4">Continue as Guest</p>

                <form @submit.prevent="submit">

                    <div class="mb-5">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
                        <input type="text" id="name" v-model="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 block w-full p-3.5" placeholder="Enter your name" required />
                    </div>

                    <button type="submit" class="py-2.5 px-5 rounded-3xl bg-gray-200 w-full mx-auto text-gray-600 hover:bg-cyan-500 focus:outline-none focus:bg-cyan-500 focus:text-white">Continue</button>
                
                </form>

                
                <hr class="mt-5">
                <span class="bg-white p-2 -mt-8 mx-auto w-fit text-lg">Or</span>

                <button type="button" class="py-2.5 px-5 rounded-lg flex gap-3 justify-center items-center bg-white shadow-md border border-gray-100 text-gray-600">
                    <Icon icon="material-icon-theme:google" class="size-7" />
                    <span>Sign in with Google</span>
                </button>

            </div>
        </div>
    </MainLayout>

</template>