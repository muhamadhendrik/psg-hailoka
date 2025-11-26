<script lang="ts" setup>

import { ref } from 'vue';
import MainLayout from '../../layouts/MainLayout.vue';
import { Icon } from '@iconify/vue';

import { authService } from '../../services/authService';

const email = ref("");
const message = ref("");

const isSuccess = ref(false)

async function handleForgotPassword() {
  try {
    await authService.forgotPassword({ email: email.value });
    message.value = "Reset link sent to your email!";

    isSuccess.value = true

    // alert("Reset password link has sended to your email")

  } catch (err: any) {
    message.value = err.response?.data?.message || "Error sending reset link";
  }
}

// Local state

</script>

<template>
     <MainLayout>

        <div class="w-1/2 h-full lg:block hidden bg-[url('/images/rectangle-blue.jpg')] bg-[1020px] rounded-s-2xl"></div>

        <div class="w-1/2 flex flex-col px-40 py-16 lg:justify-between items-center h-full bg-white rounded-e-2xl">
           
            <div v-if="!isSuccess" class="flex flex-col h-full justify-center w-full gap-2 px-4">

                <RouterLink to="/admin/signin" class="font-semibold flex items-center gap-3">
                    <Icon icon="icon-park-outline:left" width="24" height="24" /> 
                    Forgot Password
                </RouterLink>

                <p>Enter your account's email address and we'll send you a link to reset your password.</p>

                <form class="" @submit.prevent="handleForgotPassword">
                    <div class="mb-5">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
                            Email <span class="text-red-600">*</span>
                        </label>
                        <input type="email" id="email" v-model="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-3xl focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 block w-full p-2.5" placeholder="" required />
                    </div>

                    <button type="submit" class="py-3 px-5 text-gray-700 bg-gray-200 hover:bg-cyan-500 font-medium rounded-3xl w-full text-center">
                        Send Reset Link
                    </button>
                </form>
                    
            </div>


            <div v-if="isSuccess" class="flex flex-col h-full justify-center w-full gap-2 px-4">

                <h1 class="font-semibold flex items-center gap-3">
                    Check Your email
                </h1>

                <p>We've sent a password reset link to tylerhowell@gmail.com. Please check your inbox and click the link to reset your password.</p>

                <button  class="py-3 px-5 text-gray-700 bg-cyan-500 hover:bg-cyan-500 font-medium rounded-3xl w-full text-center">
                    Resend Email
                </button>
                    
            </div>



        </div>
    </MainLayout>
</template>