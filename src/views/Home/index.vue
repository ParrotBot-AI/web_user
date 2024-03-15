<template>
  <div class="flex p-5 w-full h-full">
    
    <div class="flex flex-col flex-1 pr-4 overflow-hidden">
      <!--用户信息-->
      <div class="pb-7">
        <div class="flex">
          <a-avatar class="bg-green-1 absolute shadow-lg" style="font-size: 40px;" shape="square" :size="100"
            :src="indexStore.userInfo.avatar" :alt="indexStore.userInfo.username">
            {{ indexStore.userInfo.username[0] || '' }}
          </a-avatar>
          <div class="flex items-center justify-center bg-white w-full ml-12 mt-4 shadow-lg rounded-md border border-border-1 border-solid overflow-hidden pb-9 pr-10">
            <div class=" overflow-hidden pl-9 ">
              <h1 class="text-[30px] text-gray-900 pt-6">{{ $t(getCurrentTimeOfDay()+'好') }}，{{ indexStore.userInfo.username }}
              </h1>
              <p class="text-gray-600 pt-2">Cease to struggle and you cease to live.</p>
            </div>
            <div class="border-l w-[0.5px] h-full bg-gray-500 ml-[60px] mt-10"></div>
            <div class="flex flex-col ml-[60px] pt-8">
              <div class="font-bold text-[20px]">每日打卡</div>
              <div class="flex text-[12px] font-normal pt-3 ml-[-8px]">
                <div class="flex px-[10px] flex-col items-center"><img :src="Signed" class=" w-4/5 " />M</div>
                <div class="flex px-[10px] flex-col items-center"><img :src="Signed" class=" w-4/5 " />T</div>
                <div class="flex px-[10px] flex-col items-center"><img :src="Signed" class=" w-4/5 " />W</div>
                <div class="flex flex-col px-[10px] items-center"><img :src="Signing" class=" w-4/5 " />T</div>
                <div class="flex flex-col px-[10px] items-center"><img :src="Unsign" class=" w-11/12"  />F</div>
                <div class="flex flex-col px-[10px] items-center"><img :src="Unsign" class=" w-11/12 " />S</div>
                <div class="flex flex-col px-[10px] items-center"><img :src="Unsign" class=" w-11/12" />S</div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid w-full grid-cols-4 gap-2 h-[130px] py-4 ">
          <a-card class="h-[116px] flex items-center justify-center"  v-for="(val, id) in indexStore.userTargets" :key="val.id" :style="style_bg[id]" >
            <a-card-meta >
              <template #title>
                <span class="flex items-center justify-center text-[34px] text-white">{{ 
                  // val.val 
                  0
                  }}</span>
              </template>
              <template #description>
                <span class="text-white">{{ 
                  $t(val.desc) 
                  }}</span>
              </template>
            </a-card-meta>
          </a-card>
          <a-card class="h-[116px] flex items-center justify-center"   :style="style_bg[3]" >
            <a-card-meta >
              <template #title>
                <span class="flex items-center justify-center text-[34px] text-white">{{ 
                  // val.val 
                  0
                  }}</span>
              </template>
              <template #description>
                <span class="text-white">
                  VIP到期天数
                  </span>
              </template>
            </a-card-meta>
          </a-card>
          
        </div>
      </div>
      <div class="grid grid-cols-5 grid-rows-5 gap-4 h-full">
        <div class="col-span-3 row-span-5 bg-white rounded-md border border-border-1 border-solid flex-1 px-9 overflow-hidden pb-3">
          <div class="overflow-y-auto h-full relative">
            <a-tabs class="mt-3" v-model:activeKey="activeKey">
              <a-tab-pane key="1"  tab="我的任务">
                <BaseCard  :title="`${$t('今日任务')} (${indexStore.userTargetsList.today.length})`" :list="indexStore.userTargetsList.today">
                </BaseCard>
                <div class="flex items-center flex-col text-gray-500 pt-20" v-if="!indexStore.userTargetsList.tomorrow.length">
                  <p>{{ $t('暂无当日任务，请先完成模拟考试获取定制任务') }}</p>
                  <a-button type="primary" class="mt-5 w-[220px] h-10">{{ $t('开始模考 ') }}</a-button>
                </div>
                <BaseCard  v-if="indexStore.userTargetsList.tomorrow.length"
                  :title="`${$t('明日任务')} (${indexStore.userTargetsList.tomorrow.length})`" :list="indexStore.userTargetsList.today">
                </BaseCard>
              </a-tab-pane>
              <a-tab-pane key="2" tab="个人学习诊断" force-render></a-tab-pane>
            </a-tabs>
            </div>
        </div>
        <div class="bg-white rounded-md border-l col-start-4 col-span-2 row-span-2 shadow-lg flex flex-col items-center justify-center">
          <div class="flex mb-[20px]">
            <img :src="NewWord" class=" w-1/2 " />
              <span class="font-bold flex flex-col items-center ">您的当前词汇量为<span class="flex text-[60px]">0</span></span>
          </div>
          <div
              class="bg-green-1 text-white w-2/3 h-[40px] rounded-lg border mt-[5px]  flex items-center justify-center cursor-pointer"  @click="onClick('new')"
            >
              {{ $t('学习新单词') }}
              
            </div>
        </div>
        <a-card class="col-start-4 col-span-2 row-span-3 shadow-lg">
          <div class="font-bold text-[20px]">近七日学习时长</div>
          <div id="main" style="height: 300px; width: 100%;"></div>
        </a-card>
      </div>
    </div>
    <AIComponent />
  </div>
</template>
<script setup lang="ts">
import AIComponent from '@/components/AI/index.vue'
import { useIndexStore } from '@/stores/index'
import BaseCard from "@/components/BaseCard/index.vue"
import { getCurrentTimeOfDay } from "@/utils/utils"
import NewWord from '@/assets/images/word-new.svg'
import Signed from '@/assets/images/signed.svg'
import Signing from '@/assets/images/signing.svg'
import Unsign from '@/assets/images/unsign.svg'
import Lock from '@/assets/images/word-lock.svg'
import { useWordStore } from '@/stores/word'
const wordStore = useWordStore()
import * as echarts from 'echarts';
import { ref, onMounted, watchEffect} from 'vue'
const activeKey = ref('1');
const indexStore = useIndexStore()
const myChart = ref()
const myEcharts = () => {
  const option = {
    color: [ '#f1b01f'],
    legend: {
      data:['时长']
    },
    xAxis: {
      data: ["M","T","W","T","F","S","S"]
    },
    yAxis: {},
    series: [{

      type: 'bar',
      data: [5, 20, 36, 10, 10, 20,10]
    }]
  };


  myChart.value.setOption(option);
};

const style_bg = [
  'background: linear-gradient(256.27deg, #3E8AB3 -8.38%, #166195 128.6%)',
  'background: linear-gradient(250.22deg, #52CDD3 36.77%, #009ED0 117.42%)',
  'background: linear-gradient(250.75deg, #59DEA2 37.06%, #39C0A8 127.79%)',
  'background: linear-gradient(254.37deg, #27B170 -16.85%, #49BD86 96.58%)'
]

const onClick = (type: 'new' ) => {
  wordStore.to_task(type)
}
onMounted(() => {
  wordStore.get_vocabs_tasks()
  myChart.value = echarts.init(document.getElementById('main'));
  myEcharts()
})
</script>




