<template>
  <BAudio 
    title="Please listen carefully." 
    img="2" 
    :url="props.voice_link" 
  />
</template>
<script lang="ts" setup>
import BAudio from "@/components/BaseAudio/index.vue";
import { defineProps } from "vue"
const props = defineProps<{
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