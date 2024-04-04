<template>
    <a-button 
      type="primary" 
      v-show="props.isShow && props.id !== 'horn'" 
      class="pl-3 pr-5 text-[16px] mx-1.5 h-[40px] flex items-center justify-center"
      :class="{ 'flex-row-reverse !pr-3 !pl-5': props.id === 'next' || props.id === 'continue', '!pl-5': props.id === 'submit'}" @click="onClick"
      :disabled="props.disabled"
    >
      <img :src="icons[props.id]!" class="px-2" v-if="props.id !== 'submit'"/>
      <span>{{ props.title }} </span>
    </a-button>
    <div v-show="props.isShow && props.id === 'horn'" class="mx-1.5 w-8 cursor-pointer flex flex-col relative voclume">
      <span class="flex justify-center items-center py-[18px] h-8 rounded-md bg-[#B2DAC8]" @click="onVolumeClick">
        <img :src="volume" />
      </span>
      <div class="w-full h-36 bg-[#B2DAC8] pb-5 pt-1.5 absolute top-full left-0 rounded-br-md rounded-bl-md -mt-2" v-show="isVolumeShow">
        <a-slider vertical class="h-full" @change="onChange" v-model:value="volumeVlaue" />
      </div>
    </div>
</template>
<script lang="ts" setup>
import help from '@/assets/images/help.svg'
import left from '@/assets/images/left.svg'
import progress from '@/assets/images/progress.svg'
import right from '@/assets/images/right.svg'
import volume from '@/assets/images/volume.svg'
import { defineProps, onMounted, onUnmounted, ref, watchEffect } from "vue"
const isVolumeShow = ref(false)
const volumeVlaue = ref(100)
const icons = {
  progress,
  help,
  prev: left,
  next: right,
  continue: right,
  submit: null,
  horn: null
}
export type KeyofIcons = keyof typeof icons
export type HeaderBtnProps = {
  title: string;
  id: KeyofIcons;
  disabled: boolean;
  isShow: boolean;
  onClick?: () => void;
}

const props = defineProps<HeaderBtnProps>()
console.log(props)
function getPlayingAudios() {
  const audios = document.querySelectorAll('audio');
  const playingAudios = Array.from(audios).filter(audio => !audio.paused);
  return playingAudios[0] || {};
}
const onClick = () => {
  props.onClick?.()
}
watchEffect(() => {
  props.id ==='horn' && getPlayingAudios() && (getPlayingAudios().volume = volumeVlaue.value / 100)
}, {
  flush: 'post'
})
const onChange = (value: number) => {
  getPlayingAudios() && (getPlayingAudios().volume = value / 100)
}
const clickEvnent = (e:MouseEvent) => {
  if (e.target !== document.querySelector('.voclume')) {
    isVolumeShow.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', clickEvnent)
})
onUnmounted(() => {
  document.removeEventListener('click', clickEvnent)
})
const onVolumeClick = (e:MouseEvent) => {
  e.stopPropagation()
  isVolumeShow.value = !isVolumeShow.value
}
</script>
<style scoped>
:global(.ant-btn-primary:disabled) {
  background: #1B8B8C;
  color: #fff;
  border-color: #1B8B8C;
  opacity: 0.5;
}
</style>
