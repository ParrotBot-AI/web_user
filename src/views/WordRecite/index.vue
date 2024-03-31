<template>
  <div class="flex flex-col w-full h-full p-14 overflow-y-auto">
    <h1 class="font-inter text-3xl font-semibold leading-9 mb-10">{{ $t('学习记录') }}</h1>
    <div class="grid grid-cols-6 gap-2 h-[140px]">
      <a-card
        class="col-span-2 shadow-lg border-solid relative bg-gradient-to-r from-blue-3 to-blue-4"
      >
        <div class="w-[77px] h-[83px] absolute top-[-9px] right-6">
          <img :src="WordTest" class="ml-[20px] mt-[2px]" />
        </div>
        <a-card-meta>
          <template #title>
            <span class="text-white text-5xl font-normal leading-30 tracking-normal text-left"
              >{{ wordStore.vocabs_statics_data?.vocab ? wordStore.vocabs_statics_data?.vocab : $t('未测试') }}</span
            >
          </template>
          <template #description><span class="text-white">{{ $t('当前词汇量') }}</span></template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg h-[140px]">
        <a-card-meta>
          <template #title>
            <span class="text-gray-600 text-5xl leading-30 tracking-normal text-left font-bold">{{
              wordStore.vocabs_statics_data.today_day_study
            }}</span>
          </template>
          <template #description
            ><span class="text-gray-600 text-[1vw] font-seminormal">{{ $t('今日学习') }}</span
            > <img :src="wordStore.vocabs_statics_data.today_day_study >= wordStore.vocabs_statics_data.last_day_study ? up : down" class="ml-[20px] mt-[2px]" />
          </template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg h-[140px]">
        <a-card-meta>
          <template #title>
            <span class="text-gray-600 text-5xl leading-30 tracking-normal text-left font-bold">{{
              wordStore.vocabs_statics_data.today_day_review
            }}</span>
          </template>
          <template #description
            ><span class="text-gray-600 font-seminormal text-[1vw]">{{ $t('今日复习') }}</span
            ><img :src="wordStore.vocabs_statics_data.today_day_review >= wordStore.vocabs_statics_data.last_day_review ? up : down" class="ml-[20px] mt-[2px]"
          /></template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg h-[140px]">
        <a-card-meta>
          <template #title>
            <span class="text-gray-600 text-5xl leading-30 tracking-normal text-left font-bold">{{
              wordStore.vocabs_statics_data.total_study
            }}</span>
          </template>
          <template #description
            ><span class="text-gray-600 font-seminormal text-[1vw]">{{ $t('总计学习') }}</span></template
          >
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg h-[140px]">
        <a-card-meta>
          <template #title>
            <span class="text-gray-600 text-5xl leading-30 tracking-normal text-left font-bold">{{
              wordStore.vocabs_statics_data.total_review
            }}</span>
          </template>
          <template #description
            ><span class="text-gray-600 font-seminormal text-[1vw]">{{ $t('总计复习') }}</span></template
          >
        </a-card-meta>
      </a-card>
    </div>
    <div class="flex-1 grid grid-rows-3 grid-cols-10 gap-4 mt-12 w-full">
      <a-card class="text-gray-500 text-2xl font-bold col-span-5 row-span-3 shadow-lg" >
        {{ $t('单词学习曲线') }}
        <div id="main" style="height: 400px; width: 100%; margin-top: 30px;"></div>
      </a-card>
      <a-card class="text-gray-500 text-2xl font-bold col-start-6 col-span-3 row-span-3 shadow-lg">
        {{ $t('单词学习进度') }}
        <div class="text-green-1 mt-[20px] text-[16px]">{{ 'lv' + wordStore.vocabs_statics_data.status_book?.current_level }} {{ (wordStore.vocabs_statics_data.status_book?.level_status /  wordStore.vocabs_statics_data.status_book?.level_total * 100).toFixed(1) }}% </div>
        <a-progress strokeColor="#1B8B8C" :percent="30" :showInfo="false"/>
        <div class="flex w-full mt-[-10px]" >
          <div class="text-sm font-normal">{{ wordStore.vocabs_statics_data.status_book?.level_status }}</div>
          <div class="text-sm font-normal ml-auto" >{{ wordStore.vocabs_statics_data.status_book?.level_total }}</div>
        </div>
        <div v-for="(val,i) in wordStore.vocabs_statics_data.status_book.level_book" :key="i">
          <div class="flex mt-6 px-3 w-full items-start" >
            <img :src="Tick" alt="layout" class="w-5 h-5 mt-2" v-show="val.id < wordStore.vocabs_statics_data.status_book.current_level"/>
            <img :src="sum" alt="layout" class="w-5 h-5 mt-2" v-show="val.id === wordStore.vocabs_statics_data.status_book.current_level"/>
            <img :src="Lock" alt="layout" class="w-5 h-5 mt-2" v-show="val.id > wordStore.vocabs_statics_data.status_book.current_level"/>
            <div class="mx-5 flex-1 w-[100px] text-nowrap">
              <div class="text-sm">{{ $t(val.name) }}</div>
              <div class="text-sm font-normal">{{ $t('总计')+ val.counts +$t('个') }}</div>
            </div>
            <span class="text-base text-[#1B8B8C] font-noraml cursor-pointer" v-if="isshowJump(val)" @click="onShowDialog(i+1)">跳过</span>
            <span class="text-base text-[#1B8B8C] font-noraml cursor-pointer" v-if="val.id > wordStore.vocabs_statics_data.status_book?.current_level"  @click="onShowDialog(i)">跳到</span>
          </div>
        </div>
      </a-card>
      <div class="col-span-2 row-span-3 flex flex-col  justify-center w-full">
      <a-card class="col-start-8 col-span-2 shadow-lg flex items-end justify-center h-[180px] mb-[70px] ">
        <a-card-meta>
          <template #description >
            <img :src="NewWord" class="absolute top-[-40px]  " />
            <div
              class="bg-green-1 text-white w-[150px] h-[40px] rounded-lg border mb-[15px]  flex items-center justify-center cursor-pointer"
              @click="onClick('new')"
            >
              {{ $t('学习新单词') }}
            </div>
          </template>
        </a-card-meta>
      </a-card>
      <a-card class="col-start-8 col-span-2 shadow-lg flex items-end justify-center h-[180px]">
        <a-card-meta >
          <template #description class="flex">
            <img :src="OldWord"  class="absolute top-[-30px]  " />
            <div
              class="bg-green-1 text-white w-[150px] h-[40px] mb-[15px] rounded-lg border flex items-center justify-center cursor-pointer"
              @click="onClick('old')"
            >
             {{ $t('复习旧单词') }}
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>
    </div>
  </div>
  <a-modal 
    title="" 
    v-model:open="dislogOpen" 
    cancelText="取消"
    okText="依然跳过"
    class="word-dialog"
    @ok="() => wordStore.dialogEvent(true)"
    @cancel="() => wordStore.dialogEvent(false)"
  >
    <span class="-mt-[80px] w-[200px] block mx-auto"><img :src="WordIcon1" alt="dialog" class="w-full" /></span>
    <p class="pt-7 text-base text-center px-3">这座小山已经容不下你了 <br /> <br /> 您的正确率过高，推荐您跳级下一个词库</p>
  </a-modal>
  <a-modal 
    title="" 
    cancelText="取消"
    v-model:open="jumpDialog"
    okText="依然跳过"
    class="word-dialog"
    @ok="onJump"
  >
    <span class="-mt-[80px] w-[200px] block mx-auto"><img :src="WordIcon" alt="dialog" class="w-full" /></span>
    <p class="pt-7 text-base text-center px-3">自行跳过词库可能让您词汇掌握不扎实，且不能跳回原来的等级。为保证快速提升成绩，我们会从最基础的词库开始查漏补缺。当我们发现您已经掌握这个词库时，会主动提醒您更新到更高级的词汇库。</p>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect, computed} from 'vue'
import * as echarts from 'echarts'
import up from '@/assets/images/up.svg'
import down from '@/assets/images/down.svg'
import WordTest from '@/assets/images/word-test.svg'
import NewWord from '@/assets/images/word-new.svg'
import OldWord from '@/assets/images/word-old.svg'
import Tick from '@/assets/images/word-tick.svg'
import sum from "@/assets/images/1.jpg"
import Lock from '@/assets/images/word-lock.svg'
import WordIcon from "@/assets/images/word-icon.png"
import WordIcon1 from "@/assets/images/word-icon-1.png"
import { useWordStore } from '@/stores/word'
const wordStore = useWordStore()
const myChart = ref()
const jumpDialog = ref(false)
const jumpDialogIndex = ref(-1)

let Chart :any
let clickPoint: any = null; // 用于保存点击位置信息
const isshowJump = computed(() => {
  const level_book = wordStore.vocabs_statics_data.status_book.level_book
  return (val) => {
    return wordStore.vocabs_statics_data.status_book?.current_level === val.id && wordStore.vocabs_statics_data.status_book?.current_level < level_book[level_book.length - 1].id
  }
})
const dislogOpen = computed(() => {
  return wordStore.vocabs_statics_data.is_skip_remind === 1 && !wordStore.vocabs_statics_data.refuse_skip
})
const formatData = (key: string) => {
  const series = wordStore.vocabs_statics_data?.series
  if(key === 'day') {
    return Object.keys(series)
  }
  return series ? Object.keys(series).map((item) => series[item][key]).flat() : []
}
const onShowDialog = (index: number) => {
  jumpDialogIndex.value = index
  jumpDialog.value = true
}
const onJump = () => {
  wordStore.on_jump_vocabs(jumpDialogIndex.value)
  jumpDialog.value = false
}
watchEffect (() => {
  let options = {
    backgroundColor: '#ffffff',
    color: ['#FDD44E', '#1B9f8f'],
    tooltip: {
      trigger: 'axis',
      position: function (point:any, params:any, dom:any, rect:any, size:any) {
        return [point[0]-50, point[1] - size.contentSize[1]-10];
      },
      axisPointer: {
        type: 'line',

        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: function(params:any) {
        console.log(params)
        var tooltipHtml = '<div class="custom-tooltip">';
        tooltipHtml += '<div class="arrow"></div>'; 
        tooltipHtml += '<div class="content">'; 
        tooltipHtml += '<div class="tooltip-title">' + '<div class="tooltip-title-study">'+'</div>'+'学习' + params[0].value + '</div>'; // Example: Axis label
        tooltipHtml += '<div class="tooltip-title">' + '<div class="tooltip-title-forget">'+'</div>'+'遗忘' + params[1].value + '</div>'; // Example: Axis label
        return tooltipHtml;
      },
      extraCssText: 'pointer-events: none;'
    },
    legend: {
      right: 10,
      data: ['学习单词', '遗忘单词'],
      icon: 'circle'
      
    },
    toolbox: {
      feature: {
        saveAsImage: {
          show: false
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: formatData('day')
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '学习单词',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(253, 212, 78, 0.5)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: formatData('correct_words')
      },
      {
        name: '遗忘单词',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(178, 218, 200, 1)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: formatData('wrong_words')
      }
    ]
  }
  Chart?.setOption(options);
}, {
  flush: 'post'
})

onMounted(() => {
  wordStore.get_vocabs_statics() 
  wordStore.get_vocabs_tasks()
  Chart = echarts.init(document.getElementById("main"));
  window.addEventListener('resize', () => {
    Chart.resize();
  });
  
  Chart.on('click', (params: any) => {
    // 获取点击位置信息
    clickPoint = params.event;
    // 重新绘制图表
    Chart.setOption({});
  });

})

const onClick = (type: 'new' | 'old') => {
  wordStore.to_task(type)
}
</script>

<style scoped>

.custom-tooltip{
  width: 100px;
  height: 60px;
  display: flex;
  align-items: center;

}
.tooltip-title {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}
.tooltip-title-study {
  width: 14px;
  height: 14px;
  gap: 0px;
  opacity: 0.5px;
  border-radius: 50%;
  background: rgba(249, 206, 104, 1);
  margin-right:10px ;
}
.tooltip-title-forget {
  width: 14px;
  height: 14px;
  gap: 0px;
  opacity: 0.5px;
  border-radius: 50%;
  margin-right:10px ;
  background: rgba(27, 139, 140, 1);

}
:global(.word-dialog.ant-modal) {
  top: 230px;
}
:global(.word-dialog.ant-modal .ant-modal-footer) {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
:global(.word-dialog.ant-modal .ant-modal-footer .ant-btn.ant-btn-default){
  background: #D0F0E6;
  color: #1B8B8C;
  border-color: transparent;
}
:global(.word-dialog .ant-modal-footer > button) {
  height: 44px;
  width: 150px;
}
</style>