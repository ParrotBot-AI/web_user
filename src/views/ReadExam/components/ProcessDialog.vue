<template>
  <a-layout class="w-[100vw] h-[100vh] flex flex-col absolute top-0 left-0 bg-green-2 z-20"
    :class="{ 'translate-x-0 translate-y-0': examStore.showProcessDialog }">
    <b-header title="进度" :onClickBack="onClickBack">
      <template #right>
        <div class="flex">
          <a-button type="primary" class="h-[40px] flex-row-reverse pr-1 pl-3 text-[16px] mx-1.5 flex items-center justify-center"
            @click="onClickBack">
            <img :src="right" class="px-2" />
            <span>RETURN</span>
          </a-button>
          <a-button type="primary" class="h-[40px] flex-row-reverse pr-1 pl-3 text-[16px] mx-1.5 flex items-center justify-center"
            @click="onClickBack">
            <img :src="right" class="px-2" />
            <span>GO TO QUESTION</span>
          </a-button>
        </div>
      </template>
    </b-header>
    <div class="bg-white w-full overflow-hidden flex-1 flex flex-col">
      <div class="flex justify-end px-8 h-12 items-center"
        :style="{ borderBottom: '1px solid #D0D5DD', boxShadow: 'box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }">
       <Timer />
      </div>
      <div class="text-gray-500 px-8 py-3"
        :style="{ borderBottom: '1px solid #D0D5DD', boxShadow: 'box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }">
        <p>Below is the list of questions in this screen. The question you were looking at last is highlighted when you
          enter Review.The status column shows if a question has been answered, not answered, or not seen. When a question
          is worth more than one point, the Status column will indicate that the question has been answered, even if it is
          only partially answered.</p>
        <p class="pt-2">To review a specific question from the list, click on the question to highlight it, then click on
          Go to Question at the top of the screen. When there are more questions than will fit on the screen, you can use
          the scroll bar to view the others.</p>
        <p class="pt-2">To leave Review and return to where you were in the test, click on Return. </p>
      </div>
      <div class="flex-1 overflow-y-auto px-8 pt-4">
        <a-table 
          :loading="tableLoading"
          :columns="columns" 
          size="small" 
          :dataSource="examStore.processData" 
          :pagination="false" 
          :rowKey="'order'"
          class="text-center"
        />
      </div>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import right from '@/assets/images/right.svg'
import Timer from "./Timer.vue"
import { useReadExamStore } from "@/stores/readExam"
import { useRoute } from "vue-router"
import { onMounted, ref } from "vue"

const examStore = useReadExamStore()
const $route = useRoute()
const tableLoading = ref(true)
const columns = [
  {
    title: 'Number',
    dataIndex: 'order',
  },
  {
    title: 'Description',
    
    dataIndex: 'question_content'
  },
  {
    title: 'Status',
    dataIndex: 'is_answer',
    width: 280,
    customRender: ({ text }: { text: string }) => {
      return text ? "Answered" : "Not Answered"
    },
  }
]
const onClickBack = () => {
  examStore.setShowProcessDialog()
}
onMounted(async () => {
  tableLoading.value = true
  await examStore.getExamProcess($route.query.id as string)
  tableLoading.value = false
})



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
:global(.ant-table-wrapper .ant-table-thead >tr>th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before ){
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
