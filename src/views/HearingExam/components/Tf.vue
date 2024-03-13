<template>
  <div class="px-32">
    <h2 class="pt-16 pb-14 text-[#475467] text-xl">{{ props.question_content }}</h2>
    <a-table />
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps } from 'vue'
import { useExamStore } from "@/stores/exam"
const examStore = useExamStore()
const props = defineProps<{
  question_title: string;
  detail: string[];
  question_id: number;
  options_label: string[];
  question_content: string;
}>()

</script>
<style scoped>

</style>