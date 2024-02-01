<template>
  <div>
    <h2 class="text-gray-500 text-[16px] pb-3 font-bold">Directions: An introductory sentence for a brief summary of the passage is provided below. Complete the summary by selecting the THREE answer choices that express the most important ideas in the passage. Some answer choices do not belong in the summary because they express ideas that are not presented in the passage or are minor ideas in the passage. This questions is worth 2 points.  Drag your answer choices to the spaces here they belong. To remove an answer choice, click on it. To review the passage, click VIEW TEXT.</h2>
    <h1 class="text-green-1 text-[16px] pb-8 font-bold">{{ props.stem }}</h1>
    <div>
      <div v-for="val in props.restriction_count" :key="val" class="w-full h-14 border border-green-1 border-solid mb-1.5"></div>
    </div>
    <h2 class="text-gray-500 text-[16px] font-bold pb-3 pt-4">Answer Choices</h2>
    <div class="flex flex-wrap w-[calc(100%+20px)] -ml-[10px]">
      <div v-for="(val,i) in props.choice" :key="props.choice_label[i]" class="w-1/2 px-[10px] py-[5px]">
        <div class="h-14 overflow-auto border border-green-1 border-solid pt-2.5 pl-4 cursor-pointer select-none select-bar">
          <p class="text-[14px] text-gray-500">{{ val }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{
  question_id: number;
  question_type: string;
  stem: string;
  choice_label: string[];
  choice: string[];
  restriction_count: number;
  keywords: {
    p: string;
    k: string;
    s?: string
  }
}>()
</script>
<style scoped>
  .select-bar {
    position: relative;
  }
  .select-bar:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
    height: 100%;
    background: url('@/assets/images/select.png') no-repeat;
    background-size: 100% 100%;
  }
</style>