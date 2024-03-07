<template>
  <!-- <div v-if="isJumpWordTest">
    <a-modal v-model:open="modal2Visible" title="Vertically centered modal dialog" centered @ok="modal2Visible = false">
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </div> -->
  <div class="flex flex-col w-full h-full p-14 overflow-y-auto">
    <h1 class="font-inter text-3xl font-semibold leading-9 mb-10">学习记录</h1>
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
              >未测试</span
            >
          </template>
          <template #description><span class="text-white">当前词汇量</span></template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta>
          <template #title>
            <span class="text-gray-600 text-5xl leading-30 tracking-normal text-left font-bold">{{
              wordStore.vocabs_statics_data.today_day_study
            }}</span>
          </template>
          <template #description
            ><span class="text-gray-600 font-seminormal">今日学习</span
            ><img :src="up" class="ml-[20px] mt-[2px]"
          /></template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta>
          <template #title>
            <span class="text-gray-600 text-5xl leading-30 tracking-normal text-left font-bold">{{
              wordStore.vocabs_statics_data.today_day_review
            }}</span>
          </template>
          <template #description
            ><span class="text-gray-600 font-seminormal">今日复习</span
            ><img :src="down" class="ml-[20px] mt-[2px]"
          /></template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta>
          <template #title>
            <span class="text-gray-600 text-5xl leading-30 tracking-normal text-left font-bold">{{
              wordStore.vocabs_statics_data.total_review
            }}</span>
          </template>
          <template #description
            ><span class="text-gray-600 font-seminormal">总计学习</span></template
          >
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta>
          <template #title>
            <span class="text-gray-600 text-5xl leading-30 tracking-normal text-left font-bold">{{
              wordStore.vocabs_statics_data.total_study
            }}</span>
          </template>
          <template #description
            ><span class="text-gray-600 font-seminormal">总计复习</span></template
          >
        </a-card-meta>
      </a-card>
    </div>
    <div class="flex-1 grid grid-rows-3 grid-cols-9 gap-4 mt-12">
      <a-card class="text-gray-500 text-2xl font-bold col-span-5 row-span-3 shadow-lg">
        单词学习曲线
        <div ref="myChart" class="h-[400px] mt-20px"></div>
      </a-card>
      <a-card class="text-gray-500 text-2xl font-bold col-start-6 col-span-2 row-span-3 shadow-lg">
        单词学习进度
        <a-progress strokeColor="#1B8B8C" :percent="30" class="mt-[50px]">
          <template #format="{ percent }">
            <span class="text-green-1 block mt-[-40px] ml-[-215px]">lv2 进度{{ percent }}%</span>
          </template>
        </a-progress>
        <div class="flex mt-4 px-3 w-full items-center">
          <img :src="Tick" alt="layout" class="w-5 h-5" />
          <div class="mx-5 flex-1">
            <div class="text-sm">4/6级单词</div>
            <div class="text-sm font-normal">总计323个</div>
          </div>
          <div class="text-sm text-green-1 cursor-pointer">重选</div>
        </div>
        <div class="flex mt-4 px-3 w-full items-center">
          <img :src="Tick" alt="layout" class="w-5 h-5" />
          <div class="mx-5 flex-1">
            <div class="text-sm">托福核心词</div>
            <div class="text-sm font-normal">总计687个</div>
          </div>
          <div class="text-sm text-green-1 cursor-pointer">重选</div>
        </div>
        <div class="flex mt-4 px-3 w-full items-center">
          <img :src="RightArrow" alt="layout" class="w-5 h-5" />
          <div class="mx-5 flex-1">
            <div class="text-sm">托福高频词</div>
            <div class="text-sm font-normal">总计1234个</div>
          </div>
          <div class="text-sm text-green-1 cursor-pointer">跳过</div>
        </div>
        <div class="flex mt-4 px-3 w-full items-center">
          <img :src="Lock" alt="layout" class="w-5 h-5" />
          <div class="mx-5 flex-1">
            <div class="text-sm">托福真题词</div>
            <div class="text-sm font-normal">总计323个</div>
          </div>
          <div class="text-sm cursor-pointer">选择</div>
        </div>
        <div class="flex mt-4 px-3 w-full items-center">
          <img :src="Lock" alt="layout" class="w-5 h-5" />
          <div class="mx-5 flex-1">
            <div class="text-sm">托福学科词</div>
            <div class="text-sm font-normal">总计4321个</div>
          </div>
          <div class="text-sm cursor-pointer">选择</div>
        </div>
      </a-card>
      <a-card class="col-start-8 col-span-2 shadow-lg">
        <a-card-meta>
          <template #description>
            <img :src="NewWord" class="mt-[2px] w-[140px] h-[93px] absolute top-[-33px] left-16" />
            <div
              class="bg-green-1 text-white w-40 h-9 mt-[90px] ml-[35px] p-2.5 px-4 rounded-lg border gap-2 flex items-center justify-center"
            >
              学习新单词
            </div>
          </template>
        </a-card-meta>
      </a-card>
      <a-card class="col-start-8 col-span-2 shadow-lg">
        <a-card-meta>
          <template #description>
            <img :src="OldWord" class="mt-[2px] w-[140px] h-[93px] absolute top-[-33px] left-16" />
            <div
              class="bg-green-1 text-white w-40 h-9 mt-[90px] ml-[35px] p-2.5 px-4 rounded-lg border gap-2 flex items-center justify-center"
            >
              复习旧单词
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import up from '@/assets/images/up.svg'
import down from '@/assets/images/down.svg'
import WordTest from '@/assets/images/word-test.svg'
import NewWord from '@/assets/images/word-new.svg'
import OldWord from '@/assets/images/word-old.svg'
import Tick from '@/assets/images/word-tick.svg'
import RightArrow from '@/assets/images/word-right.svg'
import Lock from '@/assets/images/word-lock.svg'
import { useWordStore } from '@/stores/word'
const wordStore = useWordStore()
const $router = useRouter()
const modal2Visible = ref<boolean>(false)
const myChart = ref(null)
type EChartsOption = echarts.EChartsOption
var option: EChartsOption
// let wrong_words_number: number[] = [];
// let date_number: string[] = [];
const get_vocabs_static = async () => {
  await wordStore.get_vocabs_statics()
  option = {
    backgroundColor: '#ffffff',
    color: ['#FDD44E', '#B2DAC8'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#000000'
        }
      }
    },

    legend: {
      data: ['学习单词', '遗忘单词']
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
        data: wordStore.vocabs_statics_data.series.map((item) => item.day)
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
        data: wordStore.vocabs_statics_data.series.map((item) => item.correct_words)
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
        data: wordStore.vocabs_statics_data.series.map((item) => item.wrong_words)
      }
    ]
  }
  const chart = echarts.init(myChart.value, 'main')
  chart.setOption(option)
}

onMounted(() => {
  modal2Visible.value = true
  // wordStore.get_vocabs_statics()
  get_vocabs_static()
})
</script>
