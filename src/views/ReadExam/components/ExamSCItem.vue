<template>
  <div>
    <h1 class="text-gray-500 text-[18px] pb-10 font-bold">
      <p v-for="(val, i) in question_contents" :key="i">{{ val.replace(/\$\$/, '【 】') }}</p>
    </h1>
    <!--单选-->
    <a-radio-group v-model:value="sc_value"
      v-if="props.restriction.rc === 1 && props.keywords.k !== '$$' && !isShowAnserHistory">
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
    <template v-if="isShowAnserHistory">
      <div v-for="( item, index ) in  props.detail " :key="index" :value="index"
        class="flex pb-7 text-gray-500 myraido">
        <img :src="check" alt="check" class="cursor-pointer" v-if="answerHistorylist[index] === 0" />
        <img :src="correntCheck" alt="correntCheck" class="cursor-pointer" v-else-if="answerHistorylist[index] === 2" />
        <img :src="mistakeCheck" alt="mistakeCheck" class="cursor-pointer" v-else />
        <span class="pl-3 pr-2">{{ props.options_label[index] }}.</span>
        <p class="flex-1">{{ item }}</p>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue'
import { useExamStore } from "@/stores/exam"
import check from '@/assets/homeIcon/check.svg'
import correntCheck from '@/assets/homeIcon/correntCheck.svg'
import mistakeCheck from '@/assets/homeIcon/mistakeCheck.svg'

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
  return props.answer?.some((item) => item !== 0)
})
const answerHistorylist = computed(() => {
  const { answer_weight, answer } = props
  console.log(answer_weight, "| answer_weight");
  console.log(answer, "| answer");

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
console.log(answerHistorylist, "| answerHistorylist");


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
