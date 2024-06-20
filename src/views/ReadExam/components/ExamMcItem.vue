<template>
  <div>
    <h1 class="text-gray-500 text-[18px] pb-10 font-bold">
      <p v-for="(val,i) in question_contents" :key="i">{{ val }}</p>
    </h1>
    <!--多选-->
    <a-checkbox-group v-model:value="mc_value" v-if="props.restriction.rc > 1 && props.question_type === 'Toefl_Reading_mc_2'" class="flex flex-col">
      <a-checkbox v-for="(item, index) in props.detail" :key="index" :value="index"
        class="flex pb-7 text-gray-500 mycheckbox flex-row">
        <!-- <span class="pl-3 pr-2">{{ props.options_label[index] }}.</span> -->
        <p class="flex-1 overflow-hidden text-wrap">{{ item }}</p>
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>
<script setup lang="ts">
import { useReadExamStore } from "@/stores/readExam";
import { computed, defineProps, ref, watch } from 'vue';
const examStore = useReadExamStore()
const mc_value = ref([]);
const props = defineProps<{
  question_id: number;
  question_type: string;
  question_content: string;
  detail: string[];
  options_label: string[];
  restriction: {
    rc: number;
  };
  keywords: {
    p: string;
    k: string;
    s?: string
  }
}>()
const question_contents = computed(() => {
  return props.question_content.split(/\\n/)
})
watch(() => props.question_id, () => {
  const answerValue = examStore.answerData?.find(val => val.question_id === props.question_id)
  if (answerValue?.is_answer) {
    mc_value.value =  answerValue?.answer?.reduce((def, val,i) => { 
      val === 1 && def.push(i)
      return def
    }, [])
  }
}, {
  immediate: true
})
watch(() => mc_value.value, () => {
  if(mc_value.value.length > props.restriction.rc) {
    mc_value.value.shift()
  }
  const value = props.options_label.map((val, i) => Number((Object.values(mc_value.value) as number[]).includes(i)))
  const answerValue = examStore.answerData.find(val => val.question_id === props.question_id)?.answer
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

.mycheckbox :global(.ant-checkbox) {
  align-self: flex-start;
  margin-top: 0.2rem;
}

.mycheckbox :global(.ant-checkbox) {
  border-radius: 50%;
  overflow: hidden;
}

.mycheckbox :global(.ant-checkbox .ant-checkbox-inner) {
  border-radius: 50%;
}
</style>
