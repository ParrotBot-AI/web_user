<template>
  <div>
    <h2 class="text-gray-500 text-[16px] pb-3 font-bold">Directions: An introductory sentence for a brief summary of the
      passage is provided below. Complete the summary by selecting the THREE answer choices that express the most
      important ideas in the passage. Some answer choices do not belong in the summary because they express ideas that are
      not presented in the passage or are minor ideas in the passage. This questions is worth 2 points. Drag your answer
      choices to the spaces here they belong. To remove an answer choice, click on it. To review the passage, click VIEW
      TEXT.</h2>
    <h1 class="text-green-1 text-[16px] pb-8 font-bold">{{ props.question_content }}</h1>
    <div>
      <DropBox 
        v-for="(val, i) in props.restriction.rc" 
        :key="val" 
        :checked="res"
        :resource="resource" 
        :onDrop="onDrop" 
        :onDel="onDel"
        :index="i"
      ></DropBox>
    </div>
    <h2 class="text-gray-500 text-[16px] font-bold pb-3 pt-4">Answer Choices</h2>
    <div class="flex flex-wrap w-[calc(100%+20px)] -ml-[10px]">
      <DragBox 
        v-for="(val, i) in props.detail" 
        :key="props.options_label[i]" 
        :val="val" 
        :type="props.options_label[i]"
        :res="res"
      ></DragBox>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed, ref, watch } from 'vue'
import DropBox from './DropBox.vue'
import DragBox from './DragBox.vue'
import { useExamStore } from "@/stores/exam"
const examStore = useExamStore()
const res = ref<any[]>([])
const props = defineProps<{
  question_id: number;
  question_type: string;
  question_content: string;
  options_label: string[];
  detail: string[];
  restriction: {
    rc: number;
    r: number
  };
  keywords: {
    p: string;
    k: string;
    s?: string
  }
}>()
const resource = computed(() => {
  return props.detail.reduce((def: any, val, i) => {
    def[props.options_label[i]] = val
    return def
  }, {})
})
watch(() => examStore.examing_data.answerData, () => {
  const answerValue = examStore.examing_data.answerData.find((val) => val.question_id === props.question_id);
  const _answer = answerValue?.answer.reduce((def:string[], val, i) => {
    if(val === 1) {
      def.push(props.options_label[i])
    }
    return def
  }, [])
  if(_answer?.length === 3) {
    res.value = _answer
    console.log(_answer, res.value)
  }
}, {
  immediate: true
})
const onDrop = ({ type, index }: { type: string, index: number }) => {
  res.value[index] = type
  const count = res.value.reduce((val, item) => item !== undefined ? val + 1 : val, 0)
  if(count === props.restriction.rc) {
    examStore.saveQuestion(props.question_id, props.options_label.map(val => res.value.includes(val) ? 1 : 0))
  }
}
const onDel = ({ index }: { index: number }) => {
  res.value[index] = ''
}
</script>
