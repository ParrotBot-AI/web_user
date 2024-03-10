<template>
  <a-layout class="w-full h-full flex flex-col">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 ">
        <ArrowLeftOutlined class="pr-2" />{{ $t(title) }}
      </div>
      <HeaderBtns />
    </header>
    <div class="flex-1 bg-green-2">
      <div class="flex items-center justify-center pt-28">
        <div class="w-14 h-14 rounded-full bg-white flex justify-center items-center mr-14 cursor-pointer" :style="{boxShadow: '0px 3px 3px 0 rgb(27 139 140 / 60%)'}">
          <LeftOutlined class="text-green-1 text-[22px]" />
        </div>
        <div>
          <Card v-bind="examStore.resultData" />
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
import {ref, onMounted} from "vue"
import {useExamStore} from "@/stores/exam"
const examStore = useExamStore()
const $route = useRoute()
const title = ref("模考小结")
onMounted(() => {
  examStore.getExamResult($route.params.sheetId as string)
})
</script>
<style scoped>
  
</style>