<template>
  <a-layout class="w-full h-full overflow-hidden">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 "><ArrowLeftOutlined class="pr-2" @click="onClickToRead" />题库选择</div>
    </header>
    <div>
      <!--题目区间-->
    </div>
    <div class="flex-1 overflow-y-auto">
      <!--列表-->
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import {useRouter} from "vue-router"
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
const $router = useRouter()
const onClickToRead = () => {
  $router.push("/read")
}
</script>
