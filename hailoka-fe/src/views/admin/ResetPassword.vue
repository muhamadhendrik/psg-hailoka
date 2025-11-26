<script lang="ts" setup>

import { ref } from 'vue';
import MainLayout from '../../layouts/MainLayout.vue';
import { Icon } from '@iconify/vue';
import { authService } from "../../services/authService";

import { useRoute } from "vue-router"
const route = useRoute()

const isSuccessResetPassord = ref(false)
const message = ref("");

// Local state
const showPassword = ref(false)
const password = ref("")

const showConfirmPassword = ref(false)
const confirmPassword = ref("")

const token = route.query.token || undefined

async function handleResetPassword() {
  try {
    await authService.resetPassword({ newPassword: password.value, token: token as string });
    message.value = "Password reset successful!";
    isSuccessResetPassord.value = true

  } catch (err: any) {
    message.value = err.response?.data?.message || "Reset failed";
  }
}


</script>

<template>
     <MainLayout>

        <div class="w-1/2 h-full lg:block hidden bg-[url('/images/rectangle-blue.jpg')] bg-[1020px] rounded-s-2xl"></div>

        <div class="w-1/2 flex flex-col px-40 py-16 lg:justify-between items-center h-full bg-white rounded-e-2xl">
           
            <div v-if="token && !isSuccessResetPassord" class="flex flex-col h-full justify-center w-full gap-2 px-4">

                <h1 class="font-semibold flex items-center gap-3">
                    Reset Password
                </h1>

                <p>Enter your account's email address and we'll send you a link to reset your password.</p>

                <form class="" @submit.prevent="handleResetPassword">
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
                        <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                            @click="showPassword = !showPassword"
                        >
                            <Icon v-if="!showPassword" icon="mdi:eye" class="w-5 h-5" />
                            <Icon v-else icon="mdi:eye-off" class="w-5 h-5"/>
                        </button>
                    </div>

                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900">
                        Confirm Password <span class="text-red-600">*</span>
                    </label>

                    <div class="relative mb-5">
                        <input
                            name="passs"
                            v-model="confirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 block w-full p-2.5"
                        />

                        <button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                            @click="showConfirmPassword = !showConfirmPassword"
                        >
                            <Icon v-if="!showConfirmPassword" icon="mdi:eye" class="w-5 h-5" />
                            <Icon v-else icon="mdi:eye-off" class="w-5 h-5"/>
                        </button>
                    </div>

                    <button type="submit" class="py-3 px-5 text-gray-700 bg-gray-200 hover:bg-cyan-500 font-medium rounded-3xl w-full text-center">
                        Send Reset Link
                    </button>
                    
                </form>
                    
            </div>

            <div v-if="token && isSuccessResetPassord" class="flex flex-col h-full justify-center w-full gap-2 px-4">

                <h1 class="font-semibold flex items-center gap-3">
                    Reset Password Successfull
                </h1>

                <p>Your password has been successfully reset. Redirecting you to the login page…</p>

                <RouterLink to="/admin/signin" class="py-3 px-5 text-gray-700 bg-cyan-500 hover:bg-cyan-500 font-medium rounded-3xl w-full text-center">
                        Go to Login
                </RouterLink>
                    
            </div>

            <div v-if="!token" class="flex flex-col h-full justify-center w-full gap-2 px-4">

                <h1 class="font-semibold flex items-center gap-3">
                    Bad Request
                </h1>

                <!-- <p>Your password has been successfully reset. Redirecting you to the login page…</p> -->

                <RouterLink to="/admin/signin" class="py-3 px-5 text-gray-700 bg-cyan-500 hover:bg-cyan-500 font-medium rounded-3xl w-full text-center">
                    Back To Login
                </RouterLink>
                    
            </div>

        </div>
    </MainLayout>
</template>