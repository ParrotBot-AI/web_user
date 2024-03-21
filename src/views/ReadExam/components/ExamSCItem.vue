<template>
  <div>
    <h1 class="text-gray-500 text-[18px] pb-10 font-bold">
      <p v-for="(val, i) in question_contents" :key="i" v-html="val.replace(/\[▇\]/g, `<span class='fill-item'>【<b></b>】</span>`)"></p>
    </h1>
    <!--单选-->
    <a-radio-group v-model:value="sc_value"
      v-if="props.restriction.rc === 1 && props.keywords.k !== '$$' && !isShowAnserHistory">
      <a-radio v-for="(item, index) in props.detail" :key="index" :value="index"
        class="flex pb-7 text-gray-500 myraido">
        <!-- <span class="pl-3 pr-2">{{ props.options_label[index] }}.</span> -->
        <p class="flex-1">{{ item }}</p>
      </a-radio>
    </a-radio-group>
    <!--文章段落反选-->
    <h2 v-else-if="props.keywords.k === '$$'" class="text-green-1 text-[18px]">
      {{ props.keywords.s || 'keywords.s is not defined' }}
    </h2>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue'
import { useRoute } from "vue-router"
import { useExamStore } from "@/stores/exam"
const $route = useRoute()
const examStore = useExamStore()
const sc_value = ref<number>(-1)
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
  },
  answer?: number[],
  answer_weight?: number[]
}>()

const isShowAnserHistory = computed(() => {
  if($route.name !== 'result') {
    return false
  }
  return props.answer?.some((item) => item !== 0)
})


watch(() => props.question_id, () => {
  const answerValue = examStore.examing_data.answerData.find(val => val.question_id === props.question_id)
  if (answerValue?.is_answer) {
    const index = answerValue?.answer.findIndex(val => val === 1) ?? -1
    if (props.keywords.k !== '$$') {
      sc_value.value = index
    } else {
      document.getElementById('content')?.querySelectorAll('span').forEach((val) => {
        const { index: i } = val.dataset
        if (index === Number(i)) {
          val.innerHTML = `【 <em>${props.keywords.s}</em> 】`
        }
      })
    }
  } else {
    sc_value.value = -1
  }
}, {
  immediate: true
})
const question_contents = computed(() => {
  return props.question_content.split(/\\n/)
})
watch(() => sc_value.value, () => {
  const value = props.options_label.map((val, i) => i === sc_value.value ? 1 : 0)
  const answerValue = examStore.examing_data.answerData.find(val => val.question_id === props.question_id)?.answer
  if (sc_value.value > -1 && value.toString() !== answerValue?.toString()) {
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
