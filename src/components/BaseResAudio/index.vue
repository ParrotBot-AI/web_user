<template>
  <div class="flex mt-6" :class="props.class">
    <audio controls="false" class="opacity-0 w-0 h-0" @timeupdate="timeupdate" @loadedmetadata="loadedmetadata"
      @ended="ended" ref="audioElement">
      <source :src="props.src" type="audio/mpeg">
      {{ $t('Your browser does not support the audio element') }}
    </audio>
    <span
      class="w-[35px] h-[35px] rounded-full mr-4 flex justify-center items-center cursor-pointer overflow-hidden bg-[#F0F7F7]"
      :style="{ border: '1px solid #1B8B8C' }" @click="onPlay">
      <CaretRightOutlined class="text-[24px] text-[#1B8B8C] ml-[4px] mt-0" v-show="paused" />
      <PauseOutlined class="text-[18px] text-[#1B8B8C]" v-show="!paused" />
    </span>
    <div class="mt-3 overflow-hidden w-[300px] audio-bar">
      <div class="h-2 bg-[#F2F2F2] rounded-full relative">
        <div class="absolute left-0 top-0 h-full rounded-full bg-[#1B8B8C]" :style="{ width: computedWidth }"></div>
      </div>
      <p class="flex justify-between mt-2 times">
        <span class="text-xs text-[#1B8B8C]">{{ curTimeText }}</span>
        <span class="text-xs text-[#BDBDBD]">{{ durationText }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { formatTime } from "@/utils/dayjs";
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons-vue';
import { computed, defineProps, onUnmounted, ref } from 'vue';
const paused = ref(true)
const audioElement = ref<HTMLAudioElement | null>(null)
const sumDuration = ref(0)
const curTime = ref(0)
const props = defineProps<{
  src: string;
  class?: string
}>()
const loadedmetadata = () => {
  sumDuration.value = audioElement.value?.duration || 0
  paused.value = true
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
  if (paused.value) {
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

<style></style>