<template>
   <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
    <div class="font-normal text-xl text-gray-900 ">
      <ArrowLeftOutlined class="pr-2" @click="onClickBack" /><span class="pl-4">{{ props.title }}</span>
    </div>
    <slot name="right" />
  </header>
</template>
<script setup lang="ts">
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useRouter } from "vue-router"
const props = defineProps<{
  title?: string
}>()
const $router = useRouter()
const onClickBack = () => {
  $router.back()
}
</script>