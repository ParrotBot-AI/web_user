<template>
  <a-layout class="w-full h-full flex flex-col absolute top-0 left-0  bg-green-2 z-50">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center" v-show="showQuesNav">
      <div class="font-normal text-xl text-gray-900 ">
        <ArrowLeftOutlined class="pr-2" @click="onReviewAnswer"/> {{ $t('返回')}}
      </div>
      <a-button 
        type="primary" 
        class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center"
        @click="onReviewAnswer"
      >
        <span><AuditOutlined />{{ ' ' }}{{ ' ' }}{{ $t('查看报告') }}</span>
      </a-button>
    </header>
    <div class="flex-1 overflow-hidden flex flex-col">
      <BQuesTitle 
          :title="answerData?.question_parent?.question_title" 
          :index="step + 1" 
          :length="resultStore.resultData?.format_question?.length"
          v-show="showQuesNav"
        > 
      </BQuesTitle>
      <component :is="reviewComponent" :answerData="answerData" />
    </div>
    <QuestionNav 
      :onChangeQues="onChangeQues"
      v-if="showQuesNav"
    />
  </a-layout>
</template>
<script setup lang="ts">
import { useResultStore } from "@/stores/result"
import { ArrowLeftOutlined, AuditOutlined } from '@ant-design/icons-vue'
import { computed, ref } from 'vue'
import { useRoute } from "vue-router"
import HearingReview from './HearingReview.vue'
import QuestionNav from "./QuestionNav.vue"
import ReadReview from './ReadReview.vue'
import SpokenReview from "./SpokenReview.vue"
import WritingReview from './WritingReview.vue'
const resultStore = useResultStore()
const step = ref(0)
const $route = useRoute()
const ComponentMap = {
  'read': ReadReview,
  'hearing': HearingReview,
  'writing': WritingReview,
  'spoken': SpokenReview
}
const answerData = computed(() => {
  return resultStore.resultData.format_question[step.value]
})

const reviewComponent = computed(() => {
  return ComponentMap[resultStore.resultData.type as string] || null
})
const showQuesNav = computed(() => {
  return resultStore.resultData.type  === 'read' || resultStore.resultData.type  === 'hearing'
})
const onReviewAnswer = () => {
  resultStore.setShowAnswerHistoryDialog()
}

const onChangeQues = (type, parentIndex, curIndex) => {
  if(type === 1 || type === -1) {
    step.value += type
    if (step.value < 0) {
      step.value = 0
    }
    if (step.value >= resultStore.resultData.format_question.length) {
      step.value = resultStore.resultData.format_question.length - 1
    }
  } else {
    step.value = resultStore.resultData.questions_r.questions.reduce((def,v,i) => {
      if(i < parentIndex){
        def += v.children.length
      } else if(i === parentIndex) {
        def += curIndex
      }
      return def
    },0)
  }
}
</script>


<style scoped>
:global(.ant-table-wrapper table) {
  border: 1px solid #1B8B8C;
  border-radius: 0;
}

:global(.ant-table-thead>tr>th.ant-table-cell) {
  background-color: #B2DAC8;
  text-align: center;
}

:global(.ant-table-tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td) {
  background: #D0F0E6;
}

:global(.ant-table-container table>thead>tr:first-child>*:last-child) {
  border-start-end-radius: 0px !important
}

:global(.ant-table-container table>thead>tr:first-child>*:first-child) {
  border-start-start-radius: 0px !important
}

:global(.ant-table-wrapper .ant-table-thead >tr>th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before) {
  display: none;
}

:global(.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody >tr>td:first-child),
:global(.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody >tr>td:last-child) {
  text-align: center;
  font-weight: 700;
  color: #667085;
}

:global(.ant-table-wrapper .ant-table:not(.ant-table-bordered) .ant-table-tbody >tr >td) {
  border-top: 1px solid #1B8B8C;
}

:global(.ant-table-wrapper .ant-table-thead >tr>th) {
  border-bottom: 1px solid #1B8B8C;
}
</style>
