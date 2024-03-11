<template>
  <div class="flex justify-center items-center w-[156px] h-[156px]" :class="props.class">
    <svg width="156" height="156">
      <circle cx="78" cy="78" r="72" stroke="#a6d5c2" stroke-width="12" fill="none" />
      <circle 
        cx="78" cy="78" r="72" stroke="#1B8B8C" stroke-width="12" fill="none" 
        ref="timerCircle" 
        style="transform: rotate(-90deg); transform-origin: center;" 
      />
    </svg>
    <div class="text-[#070417] text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <p class="text-xs">{{ props.title }}</p>
      <b class="font-semibold text-lg">{{ timeText }}</b>
    </div>
  </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import {ref, defineProps, onMounted, onUnmounted, computed} from 'vue'
const timerCircle = ref<SVGCircleElement | null>(null)
const timer = ref<null | ReturnType<typeof setInterval>>(null)
const currentTime = ref(0)
const props = defineProps<{
  time: number
  title?: string
  class?: string
  ended: () => void
}>()
onMounted(() => {
  currentTime.value = props.time
  timer.value = setInterval(() => {
      currentTime.value--;
      updateCircle();
      if (currentTime.value <= 0) {
        clearInterval(timer.value!);
        props.ended()
      }
  }, 1000);
})
onUnmounted(() => {
  clearInterval(timer.value!)
  props.ended()
})
const timeText = computed(() => {
  return dayjs.duration(currentTime.value, 'seconds').format('mm:ss')
})
const updateCircle = () => {
  const radius = timerCircle.value!.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  timerCircle.value!.style.strokeDasharray = `${circumference} ${circumference}`;
  timerCircle.value!.style.strokeDashoffset = `${circumference - currentTime.value / props.time * circumference}`;
}
</script>
<style scoped>

#timerText {
  text-align: center;
  font-size: 20px;
}

</style>