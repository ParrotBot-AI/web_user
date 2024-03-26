<template>
  <div class="text-center h-[50px] text-[#21272A] flex items-center justify-between bg-white px-8 w-full relative" :style="{ borderBottom: `1px solid #D0D5DD` }">
    <h2 class="text-[20px] font-bold truncate">{{props.title}}</h2>
    <p class="overflow-hidden text-[18px] font-normal absolute left-1/2 -translate-x-1/2" v-if="props.length">Question {{ props.index }} of {{ props.length }}</p>
    <div>
      <slot name="right" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps<{
  index: number;
  length: number;
  title: string;
}>()
</script>
<style scoped>
  
</style>