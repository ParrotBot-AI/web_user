<template>
  <div class="h-full w-full flex flex-col">
    <b-header title="单词练习">
      <template #right>
        <div class="flex items-center">
          <p class="text-xs">已学习单词 16</p>
          <a-button type="primary" class="mx-2 flex items-center justify-center"><img :src="help" class="pr-2" />HELP</a-button>
          <a-button type="primary" class="mx-2 flex items-center justify-center">CONTINUE <img :src="right" class="pl-2" /></a-button>
        </div>
      </template>
    </b-header>
    <div class="flex flex-1 items-center flex-col bg-[#edf6f6]">
      <h2 class="pb-20 pt-44">{{curTask?.payload?.word}}的意思是？</h2>
      <div class="grid grid-cols-2 gap-4">
        <div 
          v-for="(val, i) in curTask?.payload?.stem" :key="i" 
          class="w-[220px] wordBlock p-2"
          :class="{
            success: curTask.is_answer && curTask?.payload?.correct_answer[i] === 1,
            error: curTask.is_answer && curTask?.payload?.answer[i] === 1 && curTask?.payload?.correct_answer[i] === 0
          }"
          @click="wordStore.submit_task(i)"
        >
          {{val}}
        </div>
      </div>
      <a-button type="primary" class="mt-10 px-24 h-11" @click="wordStore.submit_unknown()">不认识该词</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import help from '@/assets/images/help.svg'
import right from '@/assets/images/right.svg'
import { useWordStore } from '@/stores/word'
import type { error } from 'echarts/types/src/util/log.js';
const wordStore = useWordStore()

const curTask = computed(() => wordStore.wordTaskData)

onMounted(() => {
  wordStore.start_task()
})

</script>
<style scoped>
  .wordBlock {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #D0D5DD;
    min-height: 60px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
  }
  .wordBlock.success:after, .wordBlock.error:after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 100%;
    border: 2px solid #fff;
    right: -12px;
    top: -12px;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .wordBlock.success:after {
    background-image: url('@/assets/images/error.png');
    background-color: #1B8B8C;
  }
  .wordBlock.error:after {
    background-image: url('@/assets/images/success.png');
    background-color: #C54356;
  }
  .wordBlock.success {
    background: rgba(76, 170, 175, 0.1);
    border: 1px solid #1B8B8C;
    color: #1B8B8C;
  }
  .wordBlock.error {
    background: rgba(197, 67, 86, 0.1);
    border: 1px solid #C54356;
    color: #C54356;
  }
</style>