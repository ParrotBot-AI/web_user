<template>
  <a-layout class="w-full h-full">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 "><ArrowLeftOutlined class="pr-2" @click="onClickToRead" />模拟考试</div>
      <div>111</div>
    </header>
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
