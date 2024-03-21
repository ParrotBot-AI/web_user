<template>
  <div class="bg-white rounded-md px-14 pb-14 pt-24 relative"
    :style="{ boxShadow: `0px 4px 20px 0px rgba(27, 139, 140, 0.20)` }">
    <div class="w-[190px] h-[137px] result-icon absolute -top-[70px] left-1/2 -translate-x-1/2">
      <span class="absolute right-[52px] top-[9px] text-[24px] text-white">A+</span>
    </div>
    <div class="w-[56vw]">
      <ul class="flex mb-8 mt-2 list">
        <li v-for="val in summaryList" :key="val.id" class="flex-1 list-none flex items-center justify-center flex-col">
          <h2 class="text-gray-600 font-normal text-[16px]">{{ $t(val.title) }}</h2>
          <p class="font-bold text-gray-600">
            <span class="text-[36px]">{{ props[val.id] }}</span><span class="text-[24px]"> / {{
      props[`${val.id}Total` as keyof IPropsType] }}</span>
          </p>
        </li>
      </ul>
      <div class="flex flex-wrap hidden">
        <span v-for="(val, i) in props.questions" :key="i"
          class="px-4 py-1.5 rounded-full text-gray-600 bg-[#E7EAEE] text-[16px] mx-2">
          {{ val.title }}: {{ val.correct }}/{{ val.total }}
        </span>
      </div>
      <div :style="{ background: 'rgba(208, 240, 230, 0.50)' }"
        class="rounded-md p-5 pt-6 mt-12 ai-comment relative text-gray-500 text-[16px] leading-6 hidden">{{
      props.aiComment }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowRightOutlined } from '@ant-design/icons-vue'
import { defineProps, ref } from 'vue';
import { useExamStore } from "@/stores/exam"
const examStore = useExamStore()
type IPropsType = {
  aiComment: string,
  questions: {
    title: string,
    total: number,
    correct: number,
  }[],
  mockScoreTotal: number,
  mockScore: number,
  basisScoreTotal: number,
  basisScore: number,
  intensifyScoreTotal: number,
  intensifyScore: number,
  summarySourceTotal: number,
  summarySource: number,
}
const props = defineProps<IPropsType>()
const summaryList: Array<{ title: string, id: keyof IPropsType }> = [
  {
    title: '模考得分',
    id: 'mockScore',
  },
  // {
  //   title: '基础题',
  //   id: 'basisScore',
  // },
  // {
  //   title: '强化题',
  //   id: 'intensifyScore',
  // },
  // {
  //   title: '文章小结题',
  //   id: 'summarySource',
  // }
]


</script>
<style scoped>
.result-icon {
  background: url('@/assets/images/result-icon.jpg') no-repeat;
  background-size: 100% 100%;
}

.ai-comment:before {
  content: '';
  position: absolute;
  width: 120px;
  height: 32px;
  background: url('@/assets/images/aititle.png') no-repeat;
  background-size: cover;
  top: -18px;
  left: -20px;
}

.list li:nth-child(2) {
  border-left: 1px solid #D0D5DD;
}
</style>