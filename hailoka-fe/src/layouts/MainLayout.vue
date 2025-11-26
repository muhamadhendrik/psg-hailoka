<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showMobileMenu = ref(false);

const navItems = [
    { name: "Home", to: "/" },
    { name: "Chat", to: "/chat" },
    { name: "Projects", to: "/projects" },
    { name: "Profile", to: "/profile" },
];

function go(to) {
    showMobileMenu.value = false;
    router.push(to);
}
</script>

<template>
    <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <!-- Header (mobile-first) -->

        <!-- <header class="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <div class="flex items-center gap-3">
        
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="p-2 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

        
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-semibold">MyApp</span>
            <span class="text-xs text-slate-500 hidden sm:inline">— mobile-first UI</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button class="p-2 rounded-md hidden sm:inline-flex focus:ring-2 focus:ring-sky-400">
            
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2.5 7.5 7.5 0 0116.65 16.65z"/>
            </svg>
          </button>
        </div>
      </header> -->

        <div
            class="h-screen flex-1 lg:hidden flex overflow-hidden lg:w-md w-full mx-auto border bg-[url('/images/login-background.png')] lg:bg-size-[66rem] bg-size-[60rem]">
            <main class="flex-1 overflow-auto">
                <slot />
            </main>
        </div>

        <div
            class="h-screen flex-1 lg:flex hidden overflow-hidden lg:w-full w-md mx-auto">
            <main class="flex w-full overflow-auto p-7 bg-gray-200">
                <slot />
            </main>
        </div>

        <!-- Mobile sliding menu (overlay) -->
        <transition name="fade">
            <div
                v-if="showMobileMenu"
                class="fixed inset-0 z-40 bg-black/40 md:hidden"
                @click="showMobileMenu = false" />
        </transition>

        <transition name="slide-up">
            <div
                v-if="showMobileMenu"
                class="fixed z-50 left-0 right-0 top-14 bg-white p-4 md:hidden shadow-lg">
                <nav class="flex flex-col gap-2">
                    <template v-for="item in navItems" :key="item.to">
                        <button
                            @click="go(item.to)"
                            class="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100">
                            {{ item.name }}
                        </button>
                    </template>
                </nav>
            </div>
        </transition>
    </div>
</template>

<style scoped>
/* transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active {
    transition: transform 0.18s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.18s;
}
.slide-up-enter-from {
    transform: translateY(-6px);
    opacity: 0;
}
.slide-up-leave-to {
    transform: translateY(-6px);
    opacity: 0;
}
</style>
