<template>
  <div class="flex">
    <template v-for="val in config" :key="val.id">
      <a-button type="primary" v-if="val.isShow()"
        class="pl-1 pr-3 text-[16px] mx-1.5 flex items-center justify-center"
        :class="{ 'flex-row-reverse !pr-1 !pl-3': val.id === 'next' }" @click="val.onClick(val.id)">
        <img :src="val.icon" class="px-2" />
        <span>{{ val.title }} </span>
      </a-button>
    </template>
  </div>
</template>
<script lang="ts" setup>
import progress from '@/assets/images/progress.svg'
import help from '@/assets/images/help.svg'
import left from '@/assets/images/left.svg'
import right from '@/assets/images/right.svg'
import { useExamStore } from '@/stores/exam'
const examStore = useExamStore()

const config = [
  {
    title: '进度',
    id: 'progress',
    isShow: () => true,
    icon: progress,
    onClick: () => {
      console.log('progress')
    }
  },
  {
    title: '帮助',
    id: 'help',
    isShow: () => true,
    icon: help,
    onClick: () => {
      console.log('help')
    }
  },
  {
    title: '上一步',
    id: 'prev',
    isShow: () => true,
    icon: left,
    onClick: () => {
      examStore.changeQuestion(-1)
    }
  },
  {
    title: '下一步',
    id: 'next',
    isShow: () => !examStore.isExamEnding,
    icon: right,
    onClick: () => {
      examStore.changeQuestion(1)
    }
  },
  {
    title: '提交',
    id: 'submit',
    isShow: () => examStore.isExamEnding,
    icon: help,
    onClick: () => {
      // examStore.changeQuestion(1)
      console.log("提交");
    }
  },
]
</script>
