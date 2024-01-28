<template>
  <div class="flex">
    <a-button 
      type="primary" 
      v-for="val in config" 
      :key="val.id" 
      class="pl-1 pr-3 text-[16px] mx-1.5 flex items-center justify-center"
      :class="{ 'flex-row-reverse !pr-1 !pl-3': val.id === 'next' }"
    >
      <img :src="val.icon" class="px-2"/>
      <span>{{ val.title }}</span>
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import progress from '@/assets/images/progress.svg'
import help from '@/assets/images/help.svg'
import left from '@/assets/images/left.svg'
import right from '@/assets/images/right.svg'
const config = [
  {
    title: '进度',
    id: 'progress',
    icon: progress,
  },
  {
    title: '帮助',
    id: 'help',
    icon: help,
  },
  {
    title: '上一步',
    id: 'prev',
    icon: left,
  },
  {
    title: '下一步',
    id: 'next',
    icon: right,
  },
]
</script>
