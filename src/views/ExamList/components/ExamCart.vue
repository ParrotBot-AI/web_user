<template>
   <div class="flex bg-white h-48 exam-card mx-3 w-1/2">
    <div class="left overflow-hidden h-full relative">
      <p class="text-white text-[30px] text-center pt-14">Official 1</p>
      <div class="absolute bottom-6 w-full px-2 flex">
        <a-button @click="onClickExam(props.resource_id)" class="w-1/2 mx-2">模考</a-button>
        <a-button @click="onClickPractice(props.resource_id)" class="w-1/2 mx-2">练习</a-button>
      </div>
    </div>
    <div class="flex-1 overflow-hidden pl-2">
      <div class="w-full border-b"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineProps, defineEmits} from "vue"
const emits = defineEmits(["showExamModal"])
const props = defineProps<{
  resource_id: number
}>()
const onClickExam = (id) => {
  emits("showExamModal", id)
}
const onClickPractice = (id) => {
  console.log('练习', id)
}
</script>
<style scoped>
  .exam-card {
    border-radius: 8px;
    box-shadow: 0px 4px 20px 0px rgba(27, 139, 140, 0.20);
  }
  .left {
    width: 256px;
    border-radius: 8px;
    background: linear-gradient(219deg, #B2DAC8 -0.38%, #18898E 77.62%);
    stroke-width: 1px;
    stroke: var(--color-gray-200);
    filter: drop-shadow(0px 20px 24px rgba(16, 24, 40, 0.08));
  }
</style>
