<template>
  <AnswerReview v-if="examStore.showAnswerHistoryDialog" />
  <a-layout class="w-full h-full flex flex-col">
    <b-header :title="title">
      <template #right>
        <div class="flex">
          <a-button 
            type="primary" 
            class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center bg-[#B2DAC8] text-[#1B8B8C]"
           @click="onBackClick"
          >
            <span><LeftOutlined />返回主页</span>
          </a-button>
          <a-button 
            type="primary" 
            class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center"
           @click="onReviewAnswer"
          >
            <span>回顾答案<RightOutlined /></span>
          </a-button>
        </div>
      </template>
    </b-header>
    <div class="flex-1 bg-green-2">
      <div class="flex items-center justify-center pt-28">
        <!-- <div class="w-14 h-14 rounded-full bg-white flex justify-center items-center mr-14 cursor-pointer"
          :style="{ boxShadow: '0px 3px 3px 0 rgb(27 139 140 / 60%)' }">
          <LeftOutlined class="text-green-1 text-[22px]" />
        </div> -->
        <div>
          <Card v-bind="examStore.resultData" />
        </div>
        <!-- <div class="w-14 h-14 rounded-full bg-white flex justify-center items-center ml-14 cursor-pointer"
          :style="{ boxShadow: '0px 3px 3px 0 rgb(27 139 140 / 60%)' }">
          <RightOutlined class="text-green-1 text-[22px]" />
        </div> -->
      </div>
      <footer></footer>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { RightOutlined, LeftOutlined } from '@ant-design/icons-vue';
import Card from './components/Card.vue'
import AnswerReview from './components/AnswerReview.vue'
import { ref, onMounted } from "vue"
import { useExamStore } from "@/stores/exam"
const examStore = useExamStore()
const $route = useRoute()
const title = ref("模考小结")
const $router = useRouter()
onMounted(async () => {
  await examStore.getExamResult($route.params.sheetId as string)
})
const onBackClick = () => {
  $router.replace('/')
}
const onReviewAnswer = () => {
  examStore.setShowAnswerHistoryDialog()
}

</script>
<style scoped></style>