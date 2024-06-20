<template>
  <div class="flex flex-col items-center justify-center" :class="class">
    <a-avatar :src="props.src" :size="props.size || 100"/>
    <div class="text-[#000000] font-bold pt-2 text-center">{{props.name}}</div> 
  </div>
</template>
<script setup lang="ts">
import {defineProps} from "vue"
const props = defineProps<{
  name: string
  size?: number
  src: any
  class?: string
}>()
</script>
<style scoped>
  
</style>