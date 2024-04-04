<template>
  <div class="px-32">
    <h2 class="pt-16 pb-14 text-[#475467] text-xl">{{ props.question_content }}</h2>
    <div>
      <DropBox 
        v-for="(val, i) in props.answer" 
        :key="i" 
        :checked="res"
        :resource="resource" 
        :onDrop="onDrop" 
        :onDel="onDel"
        :accept="['0', '1', '2']"
        :index="i"
      ></DropBox>
    </div>
    <h2 class="text-gray-500 text-[16px] font-bold pb-3 pt-4">Answer Choices</h2>
    <div class="flex flex-wrap w-[calc(100%+20px)] -ml-[10px]">
      <DragBox 
        v-for="(val, i) in props.detail" 
        :key="i" 
        :val="val" 
        :type="`${i}`"
        :res="res"
      ></DragBox>
    </div>
    <div class="py-2 px-4 mt-4 bg-[#F6F6F6] text-[#475467] text-base">Directions: Drag your answer choices to the spaces here they belong. To remove an answer choice, click on it. To review the passage, click VIEW TEXT.</div>
  </div>
</template>
<script lang="ts" setup>
import { useHearingExam } from "@/stores/hearingExam";
import DragBox from '@/views/ReadExam/components/DragBox.vue';
import DropBox from '@/views/ReadExam/components/DropBox.vue';
import { computed, defineProps, ref, watchEffect } from 'vue';
const examStore = useHearingExam()
const res = ref<any[]>([])
const props = defineProps<{
  question_title: string;
  detail: string[];
  question_id: number;
  options_label: string[];
  question_content: string;
  answer: number[]
}>()
const resource = computed(() => {
  return props.detail.reduce((def: any, val, i) => {
    def[i] = val
    return def
  }, {})
})
watchEffect(() => {
  const answerValue = examStore?.answerData?.find((val) => val.question_id === props.question_id);
  const _answer = answerValue?.answer.map(val => `${val}`)
  if(answerValue?.is_answer) {
    res.value = _answer
  } 
})
const onDrop = ({ type, index }: { type: string, index: number }) => {
  res.value[index] = type
  if(res.value.length === props.answer.length) {
    examStore.saveQuestion(props.question_id, res.value)
  }
}
const onDel = ({ index }: { index: number }) => {
  res.value[index] = ''
}
</script>
<style scoped>
.myraido:global(.ant-radio-wrapper .ant-radio-checked .ant-radio-inner) {
  background-color: transparent;
}

.myraido :global(.ant-radio-checked .ant-radio-inner::after) {
  background-color: var(--color-green-1);
}

.mycheckbox:global(.ant-checkbox+span),
.myraido:global(.ant-radio-wrapper span.ant-radio+*) {
  flex: 1;
  overflow: hidden;
  display: flex;
}
</style>