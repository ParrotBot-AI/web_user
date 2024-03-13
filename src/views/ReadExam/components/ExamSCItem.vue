<template>
  <div>
    <h1 class="text-gray-500 text-[18px] pb-10 font-bold">
      <p v-for="(val, i) in question_contents" :key="i">{{ val.replace(/\$\$/, '【 】') }}</p>
    </h1>
    <!--单选-->
    <a-radio-group v-model:value="sc_value"
      v-if="props.restriction.rc === 1 && props.keywords.k !== '$$' && props.answer?.length === 0">
      <a-radio v-for="(item, index) in props.detail" :key="index" :value="index"
        class="flex pb-7 text-gray-500 myraido">
        <span class="pl-3 pr-2">{{ props.options_label[index] }}.</span>
        <p class="flex-1">{{ item }}</p>
      </a-radio>
    </a-radio-group>
    <!--文章段落反选-->
    <h2 v-else-if="props.keywords.k === '$$'" class="text-green-1 text-[18px]">
      {{ props.keywords.s || 'keywords.s is not defined' }}
    </h2>
    <!-- 单选回顾 -->
    <template v-if="props.answer?.length !== 0">
      <div v-for="( item, index ) in  props.detail " :key="index" :value="index"
        class="flex pb-7 text-gray-500 myraido">
        <span class="w-[18px] h-[18px] rounded-[50%] border-solid cursor-pointer border-[#d9d9d9] border-[1px] mr-2"
          :style="{ backgroundColor: answerHistorylist[index] ? '#1B8B8C' : '' }">
          <svg t="1710335175938" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="1451" width="200" height="200">
            <path
              d="M468.52096 682.9568c-13.00992 0-25.2928-5.05856-34.688-14.45376-0.72192-0.72192-0.72192-1.44384-1.44384-1.44384L256.78336 450.98496c-7.94624-9.3952-6.5024-23.84896 3.61472-31.7952 9.39008-7.94624 23.84896-6.5024 31.7952 3.61472l174.16192 214.6304c1.44384 1.43872 2.88768 1.43872 5.05856-0.72704l307.57376-306.57024a22.05696 22.05696 0 0 1 31.80032-0.72192 22.05184 22.05184 0 0 1 0.72192 31.7952l-308.29568 307.29216c-9.40032 9.39008-21.68832 14.45376-34.69312 14.45376z"
              p-id="1452" fill="#d81e06" v-if="answerHistorylist[index] === 2"></path>
          </svg>
        </span>
        <span class="pl-3 pr-2">{{ props.options_label[index] }}.</span>
        <p class="flex-1">{{ item }}</p>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue'
import { useExamStore } from "@/stores/exam"
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
const answerHistorylist = computed(() => {
  const { answer_weight, answer } = props
  const newW = (answer_weight as number[])?.reduce((prev, next) => {
    if (next) {
      next = 2
    }
    (prev as number[]).push(next)
    return prev
  }, [])
  if (answer?.join('') === answer_weight?.join('')) {
    return newW
  }
  const newA = (answer as number[])?.reduce((prev, next) => {
    if (next) {
      next = 3
    }
    (prev as number[]).push(next)
    return prev
  }, [])
  const result: number[] = []
  for (let i = 0; i < newW.length; i++) {
    if (newW[i]) {
      result.push(newW[i])
    } else if (newA[i]) {
      result.push(newA[i])
    } else {
      result.push(newW[i])
    }
  }
  return result
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
