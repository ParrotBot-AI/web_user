<template>
    <div class="flex mt-6">
      <audio 
        controls="false" 
        class="opacity-0 w-0 h-0" 
        autoplay
        @timeupdate="timeupdate"
        @loadedmetadata="loadedmetadata" 
        @ended="ended"
        ref="audioElement"
      >
        <source :src="props.src" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <span 
        class="w-[35px] h-[35px] rounded-full mr-4 flex justify-center items-center cursor-pointer overflow-hidden bg-[#F0F7F7]" 
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
      <div class="mt-3 overflow-hidden w-[300px]">
        <div class="h-2 bg-[#F2F2F2] rounded-full relative">
          <div class="absolute left-0 top-0 h-full rounded-full bg-[#1B8B8C]" :style="{width: computedWidth}"></div>
        </div>
        <p class="flex justify-between mt-2">
          <span class="text-xs text-[#1B8B8C]">{{ curTimeText }}</span>
          <span class="text-xs text-[#BDBDBD]">{{ durationText }}</span>
        </p>
      </div>
    </div>
</template>
    
<script setup lang='ts'>
import { defineProps, onUnmounted, ref, computed } from 'vue'
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons-vue';
import {formatTime} from "@/utils/dayjs"
const paused = ref(false)
const audioElement = ref<HTMLAudioElement | null>(null)
const sumDuration = ref(0)
const curTime = ref(0)
const props = defineProps<{
    src: string;
}>()
const loadedmetadata = () => {
  sumDuration.value = audioElement.value?.duration || 0
  paused.value = false
}
const ended = () => {
  paused.value = true
  props.ended?.()
}
const timeupdate = () => {
  curTime.value = audioElement.value ? audioElement.value?.currentTime : 0
}
const durationText = computed(() => {
  return formatTime(sumDuration.value || 0)
})
const curTimeText = computed(() => {
  return formatTime(curTime.value || 0)
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
onUnmounted(() => {
  audioElement.value?.pause()
  audioElement.value?.remove()
  audioElement.value = null
})
</script>
    
<style>
    
</style>