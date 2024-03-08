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
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { computed, ref, onMounted, onUnmounted } from 'vue'
dayjs.extend(duration)
const examStore = useExamStore()
const showTimer = ref(true)
const TIMER = ref(null)
const showTime = computed(() => {
  return dayjs.duration(examStore.examing_data.time_remain, 'seconds').format('mm:ss')
})
onMounted(() => {
  // 开始倒计时
  TIMER.value = setInterval(() => {
    examStore.examing_data.time_remain--
    if(examStore.examing_data.time_remain <= 0) {
      clearInterval(TIMER.value)
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(TIMER.value)
})
const onClick = () => {
  showTimer.value = !showTimer.value
}
</script>
<style scoped>
  
</style>