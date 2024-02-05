<template>
  <div>
    <h2 class="text-gray-500 text-[16px] pb-3 font-bold">Directions: An introductory sentence for a brief summary of the
      passage is provided below. Complete the summary by selecting the THREE answer choices that express the most
      important ideas in the passage. Some answer choices do not belong in the summary because they express ideas that are
      not presented in the passage or are minor ideas in the passage. This questions is worth 2 points. Drag your answer
      choices to the spaces here they belong. To remove an answer choice, click on it. To review the passage, click VIEW
      TEXT.</h2>
    <h1 class="text-green-1 text-[16px] pb-8 font-bold">{{ props.stem }}</h1>
    <div>
      <DropBox v-for="(val, i) in props.restriction_count" :key="val" :resource="resource" :onDrop="onDrop" :onDel="onDel"
        :index="i"></DropBox>
    </div>
    <h2 class="text-gray-500 text-[16px] font-bold pb-3 pt-4">Answer Choices</h2>
    <div class="flex flex-wrap w-[calc(100%+20px)] -ml-[10px]">
      <DragBox v-for="(val, i) in props.choice" :key="props.choice_label[i]" :val="val" :type="props.choice_label[i]"
        :res="res"></DragBox>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed, ref } from 'vue'
import DropBox from './DropBox.vue'
import DragBox from './DragBox.vue'
const res = ref<any[]>([])
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
const resource = computed(() => {
  return props.choice.reduce((def: any, val, i) => {
    def[props.choice_label[i]] = val
    return def
  }, {})
})
const onDrop = ({ type, index }: { type: string, index: number }) => {
  res.value[index] = type
}
const onDel = ({ index }: { index: number }) => {
  res.value[index] = ''
}
</script>
