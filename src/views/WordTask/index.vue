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
    <div class="bg-[#edf6f6] flex flex-1 overflow-hidden" v-if="!wordStore.finished">
      <a-spin v-if="loading" size="large" tip="试题加载中..." class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"/>
      <template v-else>
        <!--单词背诵-->
        <div class="flex w-full items-center flex-col bg-[#edf6f6]" v-if="curTask?.payload?.word">
          <p v-if="curTask?.payload?.hint" class="text-[#667085] text-[18px] font-medium mb-2"> {{ curTask?.payload?.hint }} </p>
          <h2 class="pb-20 pt-44">{{curTask?.payload?.word}}的意思是？</h2>
          <div class="grid grid-cols-2 gap-8">
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
        <!--AI文章-->
        <div class="flex w-full h-full items-center flex-col bg-[#edf6f6] md:px-40 px-12 py-14" v-else>
          <div class="w-full h-[calc(100%-60px)] max-w-[1200px] relative bg-wrap flex flex-col items-center">
            <div class="bg-white rounded-md w-full h-[98%] relative z-20 pt-20 pb-4 shrink-0" :style="{boxShadow: '0 4px 20px rgba(27, 139, 140, 0.2)'}">
              <h3 class="inline-block bg-[rgba(243,184,78,0.2)] rounded-tr-xl rounded-br-xl text-[#C79741] px-4 py-1 text-base font-normal absolute left-0 top-3">Genrated by AI</h3>
              <BAutoWord 
                :data="curTask?.payload?.response!"
              />
            </div>
            <a-button type="primary" class="w-[300px] h-[44px] shrink-0 mt-6" @click="onClickAINext" v-if="curTask?.is_end">下一步</a-button>
          </div>
        </div>
      </template>
    </div>
    <div v-else>
      <div class="flex flex-col items-center justify-center h-full">
        <h2 class="text-2xl">恭喜你完成了今天的任务</h2>
        <a-button type="primary" class="mt-10 w-[300px] h-[44px]" @click="router.push('/wordRecite')">返回单词首页</a-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from "vue-router"
import BAutoWord from '@/components/BaseAutoWord/index.vue'
import help from '@/assets/images/help.svg'
import right from '@/assets/images/right.svg'
import { useWordStore } from '@/stores/word'
const loading = ref(true)
const wordStore = useWordStore()
const router = useRouter()

const curTask = computed(() => wordStore.wordTaskData)

const onClickAINext = () => {
  wordStore.aiNext()
}

onMounted(async () => {
  await wordStore.start_task()
  loading.value = false
})

</script>
<style scoped>
.bg-wrap {
  position: relative;
}
.bg-wrap:after, .bg-wrap:before{
  content: '';
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 0;
}
.bg-wrap:before {
  width: 222px;
  height: 419px;
  background-image: url('@/assets/images/r-l.png');
  left: -177px;
  bottom: -70px;
}
.bg-wrap:after {
  width: 165px;
  height: 268px;
  background-image: url('@/assets/images/r-r.png');
  right: -123px;
  bottom: -68px;
}
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