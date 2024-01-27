<template>
  <a-layout class="w-full h-full">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 ">
        <ArrowLeftOutlined class="pr-2" @click="onClickToRead" />模拟考试
      </div>
      <div>111</div>
    </header>
    <div class="flex-col items-center justify-center">
      <div class="h-10 border-b border-solid text-center leading-10">Question 1 of 10</div>
      <div class="flex h-full w-full flex-1">
        <div class="basis-1/2 border-r border-solid">1</div>
        <div class="basis-1/2">2</div>
      </div>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"
import { onMounted } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useExamStore } from '@/stores/exam'
import { getCurrentInstance } from "vue";
import type { ComponentInternalInstance } from 'vue'

const $router = useRouter()
const { params } = useRoute();
const examStore = useExamStore()

const onClickToRead = () => {
  $router.push("/read")
}
// 获取模拟考试数据
const getmockExamData = () => {
  // console.log(params, "| params");
  const arrParams = params.arrayParam.split(',')
  const id = arrParams.pop()
  const { sections } = examStore.getExamModalData(Number(id))
  const { questions } = sections[0]
  // 获取选择考试题的数据
  const checkMockExamData = arrParams.map((v) => {
    return questions.find((item) => item.question_id == v);
  })
  console.log(checkMockExamData, "| checkMockExamData");
}
onMounted(() => {
  getmockExamData()
  // 连接socket
  const { proxy } = getCurrentInstance() as ComponentInternalInstance;
  proxy?.$connect();
})
</script>
