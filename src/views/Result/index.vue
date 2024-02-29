<template>
  <a-layout class="w-full h-full flex flex-col">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 ">
        <ArrowLeftOutlined class="pr-2" />{{ title }}
      </div>
      <HeaderBtns />
    </header>
    <div class="flex-1 bg-green-2">
      <div class="flex items-center justify-center pt-28">
        <div class="w-14 h-14 rounded-full bg-white flex justify-center items-center mr-14 cursor-pointer" :style="{boxShadow: '0px 3px 3px 0 rgb(27 139 140 / 60%)'}">
          <LeftOutlined class="text-green-1 text-[22px]" />
        </div>
        <div>
          <Card v-bind="data" />
        </div>
        <div class="w-14 h-14 rounded-full bg-white flex justify-center items-center ml-14 cursor-pointer" :style="{boxShadow: '0px 3px 3px 0 rgb(27 139 140 / 60%)'}">
          <RightOutlined class="text-green-1 text-[22px]" />
        </div>
      </div>
      <footer></footer>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { ArrowLeftOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { useRoute } from "vue-router"
import Card from './components/Card.vue'
import {ref, reactive, onMounted} from "vue"
import {useExamStore} from "@/stores/exam"
const examStore = useExamStore()
const $route = useRoute()
const title = ref("模考小结")
const data = reactive({
  aiComment: '在使用鹦鹉智学时，您可以随时与AI助教交流。我们深知托福学习的困难与沮丧。所以她不仅是一个经验丰富的托福老师，更是一个可以给您情绪价值的好友，帮您排解托福学习的压力。',
  questions: [
    {
      title: '细节题',
      total: 3,
      correct: 2,
    },
    {
      title: '排除题',
      total: 3,
      correct: 2,
    }
  ],
  mockScoreTotal: 30,
  mockScore: 25,
  basisScoreTotal: 20,
  basisScore: 15,
  intensifyScoreTotal: 7,
  intensifyScore: 7,
  summarySourceTotal: 3,
  summarySource: 2,
})
onMounted(() => {
  examStore.getExamResult($route.params.sheetId)
})
</script>
<style scoped>
  
</style>