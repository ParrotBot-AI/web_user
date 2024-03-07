<template>
  <div>
    <h1 class="text-gray-500 text-[18px] pb-10 font-bold">
      <p v-for="(val,i) in question_contents" :key="i">{{ val }}</p>
    </h1>
    <!--多选-->
    <a-checkbox-group v-model:value="mc_value" v-if="props.restriction.rc > 1 && props.question_type === 'Toefl_Reading_mc2'" class="flex flex-col">
      <a-checkbox v-for="(item, index) in props.detail" :key="index" :value="index"
        class="flex pb-7 text-gray-500 mycheckbox flex-row">
        <span class="pl-3 pr-2">{{ props.options_label[index] }}.</span>
        <p class="flex-1 overflow-hidden text-wrap">{{ item }}</p>
      </a-checkbox>
    </a-checkbox-group>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue'
import { useExamStore } from "@/stores/exam"
const examStore = useExamStore()
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
watch(() => mc_value.value, () => {
  const value = props.options_label.map((val, i) => Number((Object.values(mc_value.value) as number[]).includes(i)))
  examStore.saveQuestion(props.question_id, value)
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
