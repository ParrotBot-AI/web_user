<template>
  <div class="h-full w-full flex flex-col">
    <b-header title="单词练习">
      <template #right>
        <div class="flex items-center">
          <p class="text-xs">已学习单词 16</p>
          <a-button type="primary" class="mx-2 flex items-center justify-center"><img :src="help" class="pr-2" />帮助</a-button>
          <a-button type="primary" class="mx-2 flex items-center justify-center">直接进入背诵 <img :src="right" class="pl-2" /></a-button>
        </div>
      </template>
    </b-header>
    <div class="bg-[#edf6f6] flex flex-1 overflow-hidden">
      <a-spin v-if="loading" size="large" tip="试题加载中..." class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"/>
      <template v-else>
        <div class="flex w-full items-center flex-col bg-[#edf6f6]" v-if="curTask?.payload?.word">
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
        <div class="flex w-full h-full items-center flex-col bg-[#edf6f6] md:px-40 px-12 py-14 " v-else>
          <div class="bg-white w-full h-full rounded-md max-w-[1000px] relative pt-20 pb-4" :style="{boxShadow: '0 4px 20px rgba(27, 139, 140, 0.2)'}">
            <h3 class="inline-block bg-[rgba(243,184,78,0.2)] rounded-tr-xl rounded-br-xl text-[#C79741] px-4 py-1 text-base font-normal absolute left-0 top-3">Genrated by AI</h3>
            <BAutoWord 
              :data="curTask?.payload?.response!"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import BAutoWord from '@/components/BaseAutoWord/index.vue'
import help from '@/assets/images/help.svg'
import right from '@/assets/images/right.svg'
import { useWordStore } from '@/stores/word'
const loading = ref(true)
const wordStore = useWordStore()

const curTask = computed(() => wordStore.wordTaskData)

onMounted(async () => {
  await wordStore.start_task()
  loading.value = false
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