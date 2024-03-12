<template>
    <a-button 
      type="primary" 
      v-if="props.isShow" 
      class="pl-1 pr-3 text-[16px] mx-1.5 flex items-center justify-center"
      :class="{ 'flex-row-reverse !pr-1 !pl-3': props.id === 'next' || props.id === 'continue' }" @click="onClick"
      :disabled="props.disabled"
    >
      <img :src="icons[props.id]!" class="px-2" v-if="icons[props.id] !== 'submit'"/>
      <span>{{ $t(props.title) }} </span>
    </a-button>
</template>
<script lang="ts" setup>
import progress from '@/assets/images/progress.svg'
import help from '@/assets/images/help.svg'
import left from '@/assets/images/left.svg'
import right from '@/assets/images/right.svg'
import { defineProps } from "vue"
const icons = {
  progress,
  help,
  prev: left,
  next: right,
  continue: right,
  submit: null
}
export type KeyofIcons = keyof typeof icons
export type HeaderBtnProps = {
  title: string;
  id: KeyofIcons;
  disabled: boolean;
  isShow: boolean;
  onClick: () => void;
}

const props = defineProps<HeaderBtnProps>()

const onClick = () => {
  props.onClick?.()
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
