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
      <h2 class="pb-20 pt-44">{{curTask?.word}}的意思是？</h2>
      <div class="grid grid-cols-2 gap-4">
        <div 
          v-for="(val, i) in curTask?.stem" :key="i" 
          class="w-[200px] wordBlock"
          @click="wordStore.submit_task(i)"
        >
          {{val}}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import help from '@/assets/images/help.svg'
import right from '@/assets/images/right.svg'
import { useWordStore } from '@/stores/word'
const wordStore = useWordStore()

const curTask = computed(() => wordStore.wordTaskData.payload)

onMounted(() => {
  wordStore.start_task()
})

</script>
<style scoped>
  .wordBlock {
    background: #fff;
    border-radius: 8px;
    border: 1px solid #D0D5DD;
    height: 60px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>