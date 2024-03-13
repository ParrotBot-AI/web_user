<template>
  <div class="flex justify-between items-center h-[32px] overflow-hidden">
    <span v-show="showTimer">{{ showTime }}</span>
    <span class="flex justify-center items-center cursor-pointer pl-2" @click="onClick">
      <img :src="showTimer ? hideEye : openEye" alt="hide-eye" class="w-[20px] h-full" />
      <span class="text-[#1B8B8C] text-[12px] pl-1">{{showTimer ? 'Hide Timer' : 'Show Timer'}}</span>
    </span>
  </div>
</template>
<script setup lang="ts">
import openEye from '@/assets/images/open-eye.svg'
import hideEye from '@/assets/images/hide-eye.svg'
import { useExamStore } from "@/stores/exam"
import {formatTime} from "@/utils/dayjs"
import { computed, ref, onMounted, onUnmounted } from 'vue'
const examStore = useExamStore()
const showTimer = ref(true)
const TIMER = ref<null | ReturnType<typeof setTimeout>>(null)
const showTime = computed(() => {
  return formatTime(examStore.examing_data.time_remain)
})
onMounted(() => {
  // 开始倒计时
  TIMER.value = setInterval(() => {
    examStore.examing_data.time_remain--
    if(examStore.examing_data.time_remain <= 0) {
      clearInterval(TIMER.value!)
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(TIMER.value!)
})
const onClick = () => {
  showTimer.value = !showTimer.value
}
</script>
<style scoped>
  
</style>