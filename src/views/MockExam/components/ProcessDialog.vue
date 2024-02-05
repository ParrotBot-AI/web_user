<template>
  <a-layout class="w-full h-full flex flex-col absolute top-0 left-0 -translate-x-full -translate-y-full bg-green-2 z-50"
    :class="{ 'translate-x-0 translate-y-0': examStore.showProcessDialog }">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 ">
        <ArrowLeftOutlined class="pr-2" @click="onClickBack" />模拟考试
      </div>
      <div class="flex">
        <a-button type="primary" class="flex-row-reverse pr-1 pl-3 text-[16px] mx-1.5 flex items-center justify-center"
          @click="onClickBack">
          <img :src="right" class="px-2" />
          <span>RETURN</span>
        </a-button>
        <a-button type="primary" class="flex-row-reverse pr-1 pl-3 text-[16px] mx-1.5 flex items-center justify-center"
          @click="onClickBack">
          <img :src="right" class="px-2" />
          <span>GO TO QUESTION</span>
        </a-button>
      </div>
    </header>
    <div class="bg-white w-full overflow-hidden flex-1 flex flex-col">
      <div class="flex justify-end px-8 h-12 items-center"
        :style="{ borderBottom: '1px solid #D0D5DD', boxShadow: 'box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }">
        <div class="flex justify-between items-center w-[165px] h-[32px] overflow-hidden">
          <span>{{ showTime }}</span>
          <img :src="hideEye" alt="hide-eye" class="w-[35px] h-full" />
          <span class="text-[#1B8B8C]">Hide Timer</span>
        </div>
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
        <a-table :columns="columns" size="small" :dataSource="examStore.processData" :pagination="false" :rowKey="'order'"
          :bordered="true" />
      </div>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import right from '@/assets/images/right.svg'
import openEye from '@/assets/images/open-eye.svg'
import hideEye from '@/assets/images/hide-eye.svg'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useExamStore } from "@/stores/exam"
import { useRoute } from "vue-router"
import { onMounted, computed } from "vue"
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

const examStore = useExamStore()
const $route = useRoute()
const columns = [
  {
    title: 'Number',
    dataIndex: 'order',
  },
  {
    title: 'Description',
    dataIndex: 'stem'
  },
  {
    title: 'Status',
    dataIndex: 'is_answer',
    customRender: ({ text }: { text: string }) => {
      return text ? "Answered" : "Not Answered"
    },
  }
]
const onClickBack = () => {
  examStore.setShowProcessDialog()
}
onMounted(() => {
  examStore.getExamProcess($route.query.id as string)
})

const showTime = computed(() => {
  return dayjs.duration(examStore.examing_data.time_remain, 'seconds').format('mm:ss')
})

</script>


<style scoped>
:global(.ant-table-thead>tr>th.ant-table-cell) {
  background-color: #B2DAC8;
}

:global(.ant-table-tbody>tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)>td) {
  background: #D0F0E6;
}

:global(.ant-table-container table>thead>tr:first-child>*:last-child) {
  border-start-end-radius: 0px !important
}
</style>
