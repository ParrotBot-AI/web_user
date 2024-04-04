<template>
  <div class="px-32">
    <h2 class="pt-16 pb-14 text-[#475467] text-xl">{{ props.question_content }}</h2>
    <!--多选-->
    <a-checkbox-group v-model:value="mc_value" class="flex flex-col">
      <a-checkbox v-for="(item, index) in props.detail" :key="index" :value="index"
        class="flex pb-7 text-gray-500 mycheckbox flex-row">
        <!-- <span class="pl-3 pr-2">{{ props.options_label[index] }}.</span> -->
        <p class="flex-1 overflow-hidden text-wrap">{{ item }}</p>
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>
<script lang="ts" setup>
import { useHearingExam } from "@/stores/hearingExam";
import { defineProps, ref, watch, watchEffect } from 'vue';
const examStore = useHearingExam()
const mc_value = ref([])
const props = defineProps<{
  question_title: string;
  detail: string[];
  question_id: number;
  options_label: string[];
  question_content: string;
  restriction: {
    rc: number;
    r: number;
  }
}>()

watchEffect(() => {
  const answerValue = examStore?.answerData?.find(val => val.question_id === props.question_id)
  if (answerValue?.is_answer) {
    mc_value.value =  answerValue?.answer?.reduce((def, val,i) => { 
      val === 1 && def.push(i)
      return def
    }, [])
  }
})
watch(() => mc_value.value, () => {
  if(mc_value.value.length > props.restriction.rc) {
    mc_value.value.shift()
  }
  const value = props.options_label.map((val, i) => Number((Object.values(mc_value.value) as number[]).includes(i)))
  const answerValue = examStore?.answerData?.find(val => val.question_id === props.question_id)?.answer
  if (mc_value.value.length === props.restriction.rc && value.toString() !== answerValue?.toString()) {
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