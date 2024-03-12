<template>
  <div class="flex flex-col items-center justify-center" :class="class">
    <h2 class="text-[#475467] text-xl pb-8">{{ props.title }}</h2>
    <div class="w-[300px]">
      <img :src="props.img === '1' ? v1 : v2" class="w-full"/>
    </div>
    <div class="flex mt-12 justify-center items-center">
      <audio 
        controls="false" 
        class="opacity-0 w-0 h-0" 
        autoplay
        @timeupdate="timeupdate"
        @loadedmetadata="loadedmetadata" 
        ref="audioElement"
      >
        <source :src="props.url" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <span 
        class="w-[35px] h-[35px] rounded-full mr-4 flex justify-center items-center cursor-pointer" 
        :style="{border:'1px solid #1B8B8C'}"
        @click="onPlay"
      >
        <CaretRightOutlined 
          class="text-[24px] text-[#1B8B8C] ml-1.5" 
          v-show="paused" 
        />
        <PauseOutlined 
          class="text-[18px] text-[#1B8B8C] ml-0.5 mt-0.5" 
          v-show="!paused" 
        />
      </span>
      <div class="mt-3">
        <div class="h-2 w-[300px] bg-[#F2F2F2] rounded-full relative">
          <div class="absolute left-0 top-0 h-full rounded-full bg-[#1B8B8C]" :style="{width: computedWidth}"></div>
        </div>
        <p class="flex justify-between mt-2">
          <span class="text-xs text-[#1B8B8C]">{{ curTimeText }}</span>
          <span class="text-xs text-[#BDBDBD]">{{ durationText }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, onMounted, ref, computed } from 'vue'
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs'
import v1 from "@/assets/images/v-1.png"
import v2 from "@/assets/images/v-2.png"
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
const paused = ref(false)
const audioElement = ref<HTMLAudioElement | null>(null)
const sumDuration = ref(0)
const curTime = ref(0)

const props = defineProps<{
  title: string;
  class?: string;
  img: string;
  url: string;
}>()
const loadedmetadata = () => {
  sumDuration.value = audioElement.value!.duration
  paused.value = false
}
const timeupdate = () => {
  curTime.value = audioElement.value!.currentTime
}
const durationText = computed(() => {
  console.log(dayjs)
  return dayjs.duration(sumDuration.value || 0, 'seconds').format('mm:ss')
})
const curTimeText = computed(() => {
  console.log(dayjs.duration)
  return dayjs.duration(curTime.value || 0, 'seconds').format('mm:ss')
})
const computedWidth = computed(() => {
  return `${curTime.value / sumDuration.value * 100}%`
})
const onPlay = () => {
  paused.value = !paused.value
  if(paused.value) {
    audioElement.value?.pause()
  } else {
    audioElement.value?.play()
  }
}

</script>
<style scoped>
  
</style>