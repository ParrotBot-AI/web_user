<template>
  <div class="flex flex-col items-center justify-center">
    <p class="text-[#475467] py-2">Preparation Time: {{ props.p }} Seconds</p>
    <p class="text-[#475467] py-2">Response Time: {{ props.r }} Seconds</p>
    <div class="w-52 text-center mt-3" :style="{border: `1px solid #475467`}">
      <h5 class="bg-[#475467] text-white py-2.5">{{props.status === 'prepare' ? 'PREPARATION TIME' : 'RESPONSE TIME'}}</h5>
      <p class="text-[#475467] py-3">{{ showTime }}</p>
    </div>
    <a-button 
      danger 
      type="primary" 
      class="w-48 mt-4 h-10" 
      v-if="props.status === 'speak'"
      @click="endRecording"
    >
      STOP RECORDING
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, onMounted, ref, computed, onUnmounted } from 'vue'
import {formatTime} from "@/utils/dayjs"
const timer = ref<null | ReturnType<typeof setTimeout>>(null)
const props = defineProps<{
  p: number
  r: number
  status: 'prepare' | 'speak'
  onended: () => void
}>()
const time = ref(0)
const showTime = computed(() => {
  return formatTime(time.value!, 'seconds', 'HH:mm:ss')
})
const end = () => {
  clearInterval(timer.value!)
  props.onended?.()
}
const endRecording = () => {
  end()
}
onMounted(() => {
  console.log(props.status, props.p, props.r)
  time.value = props.status === 'prepare' ? props.p : props.r
  timer.value = setInterval(() => {
    time.value--
    if(time.value <= 0) {
      end()
    }
  }, 1000)
})
onUnmounted(() => {
  end()
})
</script>
<style scoped>
  
</style>