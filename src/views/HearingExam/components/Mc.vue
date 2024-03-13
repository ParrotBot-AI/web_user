<template>
  <div class="px-32">
    <h2 class="pt-16 pb-14 text-[#475467] text-xl">{{ props.question_content }}</h2>
    <!--多选-->
    <a-checkbox-group v-model:value="mc_value" class="flex flex-col">
      <a-checkbox v-for="(item, index) in props.detail" :key="index" :value="index"
        class="flex pb-7 text-gray-500 mycheckbox flex-row">
        <span class="pl-3 pr-2">{{ props.options_label[index] }}.</span>
        <p class="flex-1 overflow-hidden text-wrap">{{ item }}</p>
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue'
import { useExamStore } from "@/stores/exam"
const examStore = useExamStore()
const sc_value = ref<number>(-1)
const mc_value = ref([])
const props = defineProps<{
  question_title: string;
  detail: string[];
  question_id: number;
  options_label: string[];
  question_content: string;
}>()
watch(() => props.question_id, () => {
  const answerValue = examStore.examing_data.answerData.find(val => val.question_id === props.question_id)
  if(answerValue!.is_answer) {
    const index = answerValue?.answer.findIndex(val => val === 1) ?? -1
    sc_value.value = index
  } else {
    sc_value.value = -1
  }
}, {
  immediate: true
})
watch(() => sc_value.value, () => {
  const value = props.options_label.map((val, i) => i === sc_value.value ? 1 : 0)
  const answerValue = examStore.examing_data.answerData.find(val => val.question_id === props.question_id)?.answer
  if(sc_value.value > -1 && value.toString() !== answerValue?.toString()) {
    examStore.saveQuestion(props.question_id, value)
  }
})
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