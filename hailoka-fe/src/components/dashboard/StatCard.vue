<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  title: string;
  value: number | string;
  description?: string;
  icon: string;
  bg?: string;
  iconBg?: string;
  classParam?: string;
}>();
</script>

<template>
  <div :class="[`rounded-lg shadow-sm p-4 flex justify-between items-start`, bg, classParam]">
    <div>
      <p class="text-sm text-gray-600">{{ title }}</p>
      <h3 class="text-2xl font-bold text-gray-900">{{ value }}</h3>
      <p v-if="description" class="text-xs text-gray-500 mt-1">{{ description }}</p>
    </div>
    <div :class="['p-2 rounded-lg', iconBg]">
      <Icon :icon="icon" class="w-6 h-6" />
    </div>
  </div>
</template>
