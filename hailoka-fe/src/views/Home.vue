<script lang="ts" setup>
import MainLayout from "../layouts/MainLayout.vue";

// import MainLayout from "../layouts/MainLayout.vue";
// import { useCounterStore } from '../stores/counter';
// const { appName, count, doubleCount } = useCounterStore()
// const counter = useCounterStore();
</script>

<template>
    <MainLayout>
        <!-- Left illustration (desktop only) -->
        <div
            class="hidden lg:block w-1/2 h-full bg-[url('/images/rectangle-blue.jpg')] bg-[length:1020px] bg-center rounded-s-2xl"></div>

        <!-- Right content -->
        <div
            class="flex flex-col justify-between items-center lg:items-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-16 py-8 sm:py-10 lg:py-16 rounded-e-2xl min-h-full lg:h-full bg-gradient-to-t from-white from-20% via-white/40 to-transparent lg:bg-white">
            <!-- Heading -->
            <div
                class="flex flex-col mx-auto justify-center items-center text-center max-w-md w-full">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                    Get Started
                </h1>
                <p class="mt-3 text-sm sm:text-base text-gray-700">
                    Connect your team and customers with enterprise-grade voice
                    solutions.
                </p>
            </div>

            <!-- Illustration -->
            <img
                src="/images/phone-cloud.png"
                alt=""
                class="w-32 sm:w-40 lg:w-48 mt-8 lg:mt-0 mx-auto" />

            <!-- User type cards -->
            <div
                class="w-full max-w-md mt-8 lg:mt-12 pb-6 flex flex-col gap-3 text-center">
                <p class="font-semibold text-gray-800">Select User Type</p>
                <p class="text-sm text-gray-600">
                    To continue, we need to know who you are
                </p>

                <RouterLink to="/guest/signin">
                    <div
                        class="flex w-full p-3 gap-3 items-center border border-gray-300 rounded-md hover:border-sky-400 hover:shadow-sm transition bg-white/70">
                        <div class="size-12 flex-shrink-0">
                            <img src="/images/guest.png" alt="Guest" />
                        </div>
                        <div class="flex flex-col">
                            <span
                                class="font-semibold text-gray-900 items-start text-start"
                                >Guest</span
                            >
                            <span
                                class="text-sm text-gray-600 items-start text-start">
                                Connect to an organization and call extensions.
                            </span>
                        </div>
                    </div>
                </RouterLink>

                <RouterLink to="/admin/signin">
                    <div
                        class="flex w-full p-3 gap-3 items-center border border-gray-300 rounded-md hover:border-sky-400 hover:shadow-sm transition bg-white/70">
                        <div class="size-12 flex-shrink-0">
                            <img src="/images/owner.png" alt="Owner" />
                        </div>
                        <div class="flex flex-col">
                            <span
                                class="font-semibold text-gray-900 items-start text-start"
                                >Owner/Staff</span
                            >
                            <span
                                class="text-sm text-gray-60 0 items-start text-start">
                                Sign in to manage organization and calls.
                            </span>
                        </div>
                    </div>
                </RouterLink>
            </div>
        </div>
    </MainLayout>
</template>
