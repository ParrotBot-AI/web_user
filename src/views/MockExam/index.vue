<template>
  <a-layout class="w-full h-full flex flex-col">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 ">
        <ArrowLeftOutlined class="pr-2" @click="onClickToRead" />模拟考试
      </div>
      <HeaderBtns />
    </header>
    <div class="text-center h-16 flex items-center justify-between bg-white px-8">
      <span></span>
      <h2 class="text-gray-900 text[20px] font-bold">Question 1 of 10</h2>
      <div></div>
    </div>
    <div class="flex flex-1 overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
      <div class="flex-1 h-full overflow-h-auto overflow-x-hidden" :style="{ borderRight: `1px solid #D0D5DD` }">
        {{ examStore.examing_data.curQuestionChildren }}
      </div>
      <div class="flex-1 h-full overflow-h-auto overflow-x-hidden">
        <h1 class="text-center text-[20px] text-gray-900 py-5">{{ examStore.examing_data.curQuestion.question_title }}</h1>
        <p class="px-8 text-gray-500 text-[18px] leading-7">{{ examStore.examing_data.curQuestion.questions_content }}</p>
      </div>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"
import WebSocketClient from '@/utils/ws'
import type {USERINFO} from "@/service/user"
import HeaderBtns from "./components/HeaderBtns.vue"
import { onMounted, ref, onUnmounted } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useExamStore } from '@/stores/exam'
import { getWithExpiry } from '@/utils/storage'
const { access } = getWithExpiry<USERINFO>('userinfo')!
const socket = ref<WebSocketClient | null>(null)

const $router = useRouter()
const { query } = useRoute();
const examStore = useExamStore()

const onClickToRead = () => {
  $router.push("/read")
}
// 获取模拟考试数据
const getmockExamData = async () => {
  const arrParams = (query.arrayParam as string)!.split('-').map(Number)
  examStore.startExam(arrParams)
}
onMounted(() => {
  getmockExamData()
  socket.value = new WebSocketClient('ws://' + import.meta.env.VITE_WS_BASEURL + '/ws/question/' + access + '/');
})

onUnmounted(() => {
  socket.value?.close()
}) 
</script>
