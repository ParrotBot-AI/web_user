<template>
  <a-layout class="w-full h-full flex flex-col absolute top-0 left-0  bg-green-2 z-50">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 ">
        <ArrowLeftOutlined class="pr-2" />模拟考试
      </div>
    </header>
    <div class="text-center h-14 flex items-center justify-between bg-white px-8">
      <h2 class="text-gray-900 text[20px] font-bold">{{ questionsData[0].question_title }}</h2>
    </div>
    <div class="flex flex-1 overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
      <div class="flex-1 h-full overflow-h-auto overflow-x-hidden" :style="{ borderRight: `1px solid #D0D5DD` }"
        v-show="isViewText || !examStore.curQuestionChildren?.isShowViewText">
        <h1 class="text-center text-[20px] text-gray-900 py-5">{{ examStore.curQuestion?.question_title }}</h1>
        <div ref="contentDiv" id="content">
          <p class="px-8 text-gray-500 text-[18px] leading-7" :class="'read-mock-content-' + (i + 1)"
            v-for="(val, i) in questionsData[0].children" v-html="val.question_content" :key="i"></p>
        </div>
      </div>
      <div class="flex-1 h-full overflow-h-auto overflow-x-hidden px-12 py-7">
        <component :is="examItems[questionsData[0].children[0]?.question_type as keyof IExamItems]"
          v-bind="questionsData[0].children[0]" />
      </div>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { ref, reactive } from 'vue'
import { useExamStore } from '@/stores/exam'
import ExamSCItem from '@/views/ReadExam/components/ExamSCItem.vue'
import ExamMCItem from '@/views/ReadExam/components/ExamMcItem.vue'
import ExamLastMcItem from '@/views/ReadExam/components/ExamLastMcItem.vue'
const isViewText = ref<boolean>(false)
const contentDiv = ref<HTMLDivElement | null>(null)
let questionsData = reactive<any>(null)
const examStore = useExamStore()
type IExamItems = {
  Toefl_Reading_sc: typeof ExamSCItem  // 单选题和填充题
  Toefl_Reading_mc2: typeof ExamMCItem,  // 4选2多选题
  Toefl_Reading_mc: typeof ExamLastMcItem,  // 6选3 拖动题
}
const examItems: IExamItems = {
  Toefl_Reading_sc: ExamSCItem,
  Toefl_Reading_mc2: ExamMCItem,
  Toefl_Reading_mc: ExamLastMcItem,
}

questionsData = examStore.resultData.questions_r?.questions

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
