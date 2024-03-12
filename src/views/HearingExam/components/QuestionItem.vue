<template>
  <div class="bg-white w-full h-full">
    <div class="text-center h-14 flex items-center justify-between bg-white px-8">
      <h2 class="text-gray-900 text[20px] font-bold">{{props.title}}</h2>
    </div>
    <div class="flex flex-1 justify-center items-center overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
      <BAudio 
        title="Please listen carefully." 
        class="mt-20"
        img="2" 
        :url="props.voice_link" 
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import BAudio from "@/components/BaseAudio/index.vue";
import { defineProps } from "vue"
const props = defineProps<{
  title: string;
  voice_link: string;
  question_id: number;
  order: number;
  isPlay: boolean;
  questions: Array<{
    question_id: number;
    question_type: string;
    question_content: string;
    detail: string[];
    options_label: string[];
  }>
}>()
</script>
<style scoped>
  
</style>