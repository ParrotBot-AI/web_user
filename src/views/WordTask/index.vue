<template>
  <div class="h-full w-full fixed top-0 left-0 z-[100] bg-[#edf6f6]" v-show="showHelp">
    <b-header title="单词练习" :onClickBack="onClickHelp">
      <template #right>
        <div class="flex items-center">
          <a-button type="primary" class="mx-2 flex items-center justify-center h-[40px]" @click="onClickHelp"><img :src="left" class="pr-2" />{{ $t('返回') }}</a-button>
        </div>
      </template>
    </b-header>
    <div class="help-container">
      <h2 class="text-center mb-6">{{ $t('鹦鹉智学AI单词背诵') }}</h2>
      <p class="text-[#667085]">{{ $t('鹦鹉智学AI单词背诵会使用生词用AI生成文章来辅助背诵。这种背诵方式功能会让你的背诵记忆更加牢固、快速，也更加适应托福考试的要求。在我们过去做的实验中，100%的学生认为背诵效果提升，100%的学生认为这让单词背诵变得有趣。') }}</p>
      <h3 class="text-center mt-16">{{ $t('鹦鹉智学 4步AI背诵法') }}</h3>
      <ul class="help-block">
        <li>
          <span>1</span>
          <img :src="helpicon1" />
          <h1>{{ $t('AI筛选生词') }}</h1>
        </li>
        <li>
          <span>2</span>
          <img :src="helpicon2" />
          <h1>{{ $t('AI生词生成文章') }}</h1>
        </li>
        <li>
          <span>3</span>
          <img :src="helpicon3" />
          <h1>{{ $t('语境单词背诵') }}</h1>
        </li>
        <li class="review">
          <span>4</span>
          <img :src="helpicon4" />
          <h1>{{ $t('AI模考复习') }}</h1>
        </li>
      </ul>
    </div>
  </div>
  <div class="h-full w-full flex flex-col">
    <b-header title="单词练习" :onClickBack="() => router.push('/wordRecite')">
      <template #right>
        <div class="flex items-center">
          <p class="text-xs text-[#1B8B8C] mr-3 flex" v-if="curTask?.payload?.word && !curTask?.payload?.after_model">
            <span class="mx-2 flex items-center"><img :src="icon1" class="mx-1"/>{{ $t('已学习单词') }} {{ curTask.payload?.today_study || 0}}</span>
            <span class="flex items-center"><img :src="icon2" class="mx-1"/>{{ $t('发现生词') }} {{ curTask.payload?.process?.c || 0}}/{{ curTask.payload?.process?.t || 0}}</span>
          </p>
          <p class="text-xs text-[#1B8B8C] mr-3 flex" v-else>
            <span class="mx-2 flex items-center"><img :src="icon1" class="mx-1"/>{{ $t('已学习单词') }} {{ curTask.payload?.process?.c || 0}}/{{ curTask.payload?.process?.t || 0}}</span>
          </p>
          <a-button type="primary" class="mx-2 flex items-center justify-center h-[40px]" @click="onClickHelp"><img :src="help" class="pr-2" />{{ $t('帮助') }}</a-button>
          <a-button type="primary" class="mx-2 flex items-center justify-center h-[40px]" @click="wordStore.submit_Study()" v-if="curTask?.payload?.word && !curTask?.payload?.after_model">{{ $t('直接进入背诵') }} <img :src="right" class="pl-2" /></a-button>
        </div>
      </template>
    </b-header>
    <div class="bg-[#edf6f6] flex flex-1 overflow-hidden" v-if="!wordStore.finished">
      <a-spin v-if="loading" size="large" tip="试题加载中..." class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"/>
      <template v-else>
        <!--单词背诵-->
        <div class="flex w-full items-center flex-col bg-[#edf6f6] pt-44" :class="{'!pt-20': curTask?.payload?.hint }" v-if="curTask?.payload?.word">
          <p v-if="curTask?.payload?.hint" class="text-[#667085] text-[18px] font-medium pb-5 w-[500px]"> {{ curTask?.payload?.hint }} </p>
          <h2 class="pb-20">{{curTask?.payload?.word}}{{ $t('的意思是？') }}</h2>
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
          <a-button type="primary" class="mt-10 w-[270px] h-11" @click="wordStore.error_next()" v-if="curTask?.is_error">{{ $t('下一步') }}</a-button>
          <a-button type="primary" class="mt-10 w-[270px] h-11" @click="wordStore.submit_unknown()" v-else>{{ $t('不认识该词') }}</a-button>
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
            <a-button type="primary" class="w-[300px] h-[44px] shrink-0 mt-6" @click="onClickAINext" v-if="curTask?.is_end">{{ $t('下一步') }}</a-button>
          </div>
        </div>
      </template>
    </div>
    <div class="bg-[#edf6f6] flex flex-1 overflow-hidden items-center justify-center" v-else>
      <div class="flex flex-col items-center justify-center h-full">
        <h2 class="text-2xl">{{ $t('恭喜你完成了今天的任务') }}</h2>
        <a-button type="primary" class="mt-10 w-[300px] h-[44px]" @click="router.push('/wordRecite')">{{ $t('返回单词首页') }}</a-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import help from '@/assets/images/help.svg'
import left from '@/assets/images/left.svg'
import right from '@/assets/images/right.svg'
import helpicon1 from "@/assets/images/word-icon-1-1.png"
import icon1 from "@/assets/images/word-icon-1.svg"
import helpicon2 from "@/assets/images/word-icon-2.png"
import icon2 from "@/assets/images/word-icon-2.svg"
import helpicon3 from "@/assets/images/word-icon-3.png"
import helpicon4 from "@/assets/images/word-icon-4.png"
import BAutoWord from '@/components/BaseAutoWord/index.vue'
import { useWordStore } from '@/stores/word'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from "vue-router"
const showHelp = ref(false)
const loading = ref(true)
const wordStore = useWordStore()
const router = useRouter()

const curTask = computed(() => wordStore.wordTaskData)

const onClickAINext = () => {
  wordStore.aiNext()
}

const onClickHelp = () => {
  showHelp.value = !showHelp.value
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
  .help-container {
    width: 90%;
    margin: 0 auto;
    min-height: 200px;
    border-radius: 8px;
    background: #FFF;
    padding: 66px 74px;
    box-shadow: 0px 4px 20px 0px rgba(27, 139, 140, 0.20);
  }
  .help-block {
    display: flex;
    margin-top: 30px;
  }
  .help-block li {
    flex: 1;
    height: 200px;
    border-radius: 8px;
    margin: 0 25px;
    list-style: none;
    border: 1px solid #D0D5DD;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .help-block li span {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background: #FDD44E;
    text-align: center;
    line-height: 40px;
    color: rgba(0,0,0,.6);
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    position: absolute;
    top: -20px;
    left: -20px;
  }
  .help-block li img {
    width: 40%;
    display: block;
    margin: 20px auto;
  }
  .help-block li h1 { 
    color: #667085;
    font-weight: normal;
    font-size: 18px;
    text-align: center;
    padding-bottom: 20px;
  }
  .help-block li.review {
    background-color: #4CAAAF;
  }
  .help-block li.review h1 {
    color: #fff;
  }
</style>