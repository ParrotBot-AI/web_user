<template>
  <!-- <div v-if="isJumpWordTest">
    <a-modal v-model:open="modal2Visible" title="Vertically centered modal dialog" centered @ok="modal2Visible = false">
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </a-modal>
  </div> -->
  <div class="flex flex-col w-full h-full p-14 overflow-y-auto">
    <h1 class="font-inter text-3xl font-semibold leading-9 mb-10 ">学习记录</h1>
    <div class="grid grid-cols-6 gap-2 h-[140px] ">
      <a-card class="col-span-2 shadow-lg border-solid relative bg-gradient-to-r from-blue-3  to-blue-4 ">
        <div class="w-[77px] h-[83px] absolute top-[-9px] right-6"><img :src="WordTest" class="ml-[20px] mt-[2px]" />
        </div>
        <a-card-meta>
          <template #title>
            <span class="text-white text-5xl font-normal leading-30 tracking-normal text-left " >未测试</span>
          </template>
          <template  #description ><span class="text-white">当前词汇量</span></template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta >
          <template #title>
            <span class="text-gray-600 text-5xl  leading-30 tracking-normal text-left font-bold" >64</span>
          </template>
          <template  #description ><span class="text-gray-600 font-seminormal">今日学习</span><img :src="up" class="ml-[20px] mt-[2px]" /></template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta >
          <template #title>
          <span class="text-gray-600 text-5xl  leading-30 tracking-normal text-left font-bold">54</span>
          </template>
          <template  #description ><span class="text-gray-600 font-seminormal">今日复习</span><img :src="down" class="ml-[20px] mt-[2px]" /></template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta >
          <template #title>
          <span class="text-gray-600 text-5xl  leading-30 tracking-normal text-left font-bold">1164</span>
          </template>
          <template  #description ><span class="text-gray-600 font-seminormal">总计学习</span></template>
        </a-card-meta>
      </a-card>
      <a-card class="shadow-lg">
        <a-card-meta >
          <template #title>
          <span class="text-gray-600 text-5xl  leading-30 tracking-normal text-left font-bold">690</span>
          </template>
          <template  #description ><span class="text-gray-600 font-seminormal">总计复习</span></template>
        </a-card-meta>
      </a-card>
    </div>
    <div class="flex-1 grid grid-rows-3 grid-cols-9 gap-4 mt-12">
      <a-card class="text-gray-500 text-2xl font-bold col-span-5 row-span-3 shadow-lg"> 
        单词学习曲线
        <div ref="myChart" style="height: 400px;"></div>
      </a-card>
      
      <a-card class="text-gray-500 text-2xl font-bold col-start-6 col-span-2 row-span-3 shadow-lg">
        单词学习进度
      </a-card>
      <a-card class="col-start-8 col-span-2 shadow-lg">
        <a-card-meta>
          <template #description><img :src="NewWord" class=" mt-[2px] w-[140px] h-[93px] absolute top-[-33px] left-16" /></template>
         
        </a-card-meta>
      </a-card>
      <a-card class="col-start-8 col-span-2 shadow-lg">
        <a-card-meta >
          <template #description><img :src="OldWord" class=" mt-[2px] w-[140px] h-[93px] absolute top-[-33px] left-16" /></template>
        </a-card-meta>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts';
import up from '@/assets/images/up.svg'
import down from '@/assets/images/down.svg'
import WordTest from '@/assets/images/word-1.svg'
import NewWord from '@/assets/images/word-2.svg'
import OldWord from '@/assets/images/word-3.svg'
import {useWordStore} from "@/stores/word" 
const wordStore = useWordStore()
const $router = useRouter()
// const isJumpWordTest = ref<boolean>(true)
const modal2Visible = ref<boolean>(false);
type EChartsOption = echarts.EChartsOption;
var chartDom = document.getElementById('chartDom')!;

const myChartRef = ref<HTMLElement | null>(null);
var option: EChartsOption;
option = {
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  title: {
    text: 'Gradient Stacked Area Chart'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Line 1',
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
            color: 'rgb(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [140, 232, 101, 264, 90, 340, 250]
    },
    {
      name: 'Line 2',
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
            color: 'rgb(0, 221, 255)'
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 282, 111, 234, 220, 340, 310]
    },
    {
      name: 'Line 3',
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
            color: 'rgb(55, 162, 255)'
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 132, 201, 334, 190, 130, 220]
    },
    {
      name: 'Line 4',
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
            color: 'rgb(255, 0, 135)'
          },
          {
            offset: 1,
            color: 'rgb(135, 0, 157)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 402, 231, 134, 190, 230, 120]
    },
    {
      name: 'Line 5',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top'
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 191, 0)'
          },
          {
            offset: 1,
            color: 'rgb(224, 62, 76)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 302, 181, 234, 210, 290, 150]
    }
  ]
};

onMounted(() => {
  modal2Visible.value = true
  if (myChartRef.value) {
    const myChart = echarts.init(myChartRef.value);
    // ... 其他代码 ...
    myChart.setOption(option);
  }
  wordStore.get_vocabs_statics()
})
</script>
