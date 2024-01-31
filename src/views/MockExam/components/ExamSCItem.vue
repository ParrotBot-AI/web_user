<template>
  <div>
    <h1 class="text-gray-500 text-[18px] pb-10 font-bold">{{ props.stem }}</h1>
    <a-radio-group v-model:value="sc_value" v-if="props.restriction_count === 1 && props.keywords.k !== '$$' && props.question_type !== 'TR_fill_sentence'">
      <a-radio 
        v-for="(item, index) in props.choice" 
        :key="index" 
        :value="index + 1"
        class="flex pb-7 text-gray-500 myraido"
      >
        <span class="pl-3 pr-2">{{ props.choice_label[index] }}.</span><p class="flex-1">{{ item }}</p>
      </a-radio>
    </a-radio-group>
    <a-checkbox-group v-model:value="mc_value" v-else-if="props.restriction_count > 1" class="flex flex-col">
      <a-checkbox 
        v-for="(item, index) in props.choice" 
        :key="index" 
        :value="index + 1"
        class="flex pb-7 text-gray-500 mycheckbox flex-row"
      >
        <span class="pl-3 pr-2">{{ props.choice_label[index] }}.</span><p class="flex-1 overflow-hidden text-wrap">{{ item }}</p>
      </a-checkbox>
    </a-checkbox-group>
    <h2 v-else-if="props.keywords.k === '$$' || props.question_type=== 'TR_fill_sentence'" class="text-green-1 text-[18px]">
      {{ typeof props.keywords === 'string' ? props.keywords : props.keywords.s }}
    </h2>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref } from 'vue'
const sc_value = ref<number>(1);
const mc_value = ref([]);
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
  .myraido:global(.ant-radio-wrapper .ant-radio-checked .ant-radio-inner) {
    background-color: transparent;
  }
  .myraido :global(.ant-radio-checked .ant-radio-inner::after) {
    background-color: var(--color-green-1);
  }
  .mycheckbox:global(.ant-checkbox+span),.myraido:global(.ant-radio-wrapper span.ant-radio+*) {
    flex: 1;
    overflow: hidden;
    display: flex;
  }
  .mycheckbox :global(.ant-checkbox){
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
