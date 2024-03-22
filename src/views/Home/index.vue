<template>
  <div class="flex p-5 w-full h-full">
    
    <div class="flex flex-col flex-1 pr-4 overflow-hidden">
      <!--用户信息-->
      <div class="pb-7">
        <div class="flex">
          <div class="flex  bg-white w-full h-[150px] ml-12 mt-4 shadow-lg rounded-md border border-border-1 border-solid">
            <a-avatar class="bg-green-1  top-[-10px] left-[-50px] shadow-lg  rounded-md border border-border-1 border-solid" style="font-size: 40px;" shape="square" :size="100"
              :src="indexStore.userInfo.avatar" :alt="indexStore.userInfo.name">
              {{ indexStore.userInfo.name[0] || '' }}
            </a-avatar>
            <div class="overflow-hidden h-full flex flex-col items-start" style="width: 40%;">
              <h1 class="text-[25px] text-gray-900 pt-6">{{ $t(getCurrentTimeOfDay()+'好') }}，{{ indexStore.userInfo.name }}
              </h1>
              <p class="text-gray-600 pt-4">Cease to struggle and you cease to live.</p>
            </div>
            <div class="flex h-full items-center justify-start"> 
              <div class="border-l w-[0.5px] h-1/2 bg-gray-500  "></div>
            </div>
            <div class="flex flex-col ml-[20px] pt-8">
              <div class="font-bold text-[18px]">每日打卡</div>
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
      <div class="grid grid-cols-5 grid-rows-5 gap-4 flex-1 overflow-hidden">
        <div class="col-span-3 overflow-hidden row-span-5 bg-white rounded-md border border-border-1 border-solid flex-1 px-9 pb-3">
          <div class="h-full relative pt-3">
            <a-tabs class="h-full" v-model:activeKey="activeKey">
              <a-tab-pane key="1" tab="我的任务">
                <BaseCard :title="`${$t('今日任务')} (${indexStore.userTargetsList.today.length})`" :list="indexStore.userTargetsList.today">
                </BaseCard>
                <div class="flex items-center flex-col text-gray-500 pt-20" v-if="!indexStore.userTargetsList.tomorrow.length">
                  <p>{{ $t('暂无当日任务，请先完成模拟考试获取定制任务') }}</p>
                  <a-button type="primary" class="mt-5 w-[220px] h-10">{{ $t('开始模考 ') }}</a-button>
                </div>
                <BaseCard v-if="indexStore.userTargetsList.tomorrow.length"
                  :title="`${$t('明日任务')} (${indexStore.userTargetsList.tomorrow.length})`" :list="indexStore.userTargetsList.today">
                </BaseCard>
              </a-tab-pane>
              <a-tab-pane key="2" tab="个人学习诊断" >
                <div class="flex w-full items-center justify-center overflow-hidden">
                  <div class="mt-5" style="width: 20%;">
                    <img :src="PersionRead" />
                  </div>
                  <div class="flex flex-col mb-2" style="width: 20%">
                    <div class="text-[4vw]">{{ examStore.pastScores.read }}</div>
                    <div class="text-[0.8vw] text-gray-500">近7日平均分</div>
                  </div>
                  <div class="border-l  w-[0.5px] h-20 bg-green-1 ml-3"></div>
                  <div class="flex flex-col p-6 overflow-auto" style="width: 60%;">
                    <div class="text-gray-500 font-bold mb-4 text-[1vw]">错误率最高的题型</div>
                    <div class="flex "> 
                      <div v-for="(val, id) in question_list">
                        <div class=" text-[0.8vw] ml-2 justify-center text-gray-500 bg-white border-border-1 px-[12px] py-1" style=" border: 1px solid rgba(102, 112, 133, 1);  border-radius: 18px; width: auto; white-space: nowrap;">
                          {{ val }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex w-full items-center justify-center overflow-hidden">
                  <div class="mt-5" style="width: 20%;">
                    <img :src="PersionHear" />
                  </div>
                  <div class="flex flex-col mb-2" style="width: 20%">
                    <div class="text-[4vw]">{{ examStore.pastScores.hear }}</div>
                    <div class="text-[0.8vw] text-gray-500">近7日平均分</div>
                  </div>
                  <div class="border-l  w-[0.5px] h-20 bg-green-1 ml-3"></div>
                  <div class="flex flex-col p-6 overflow-auto" style="width: 60%;">
                    <div class="text-gray-500 font-bold mb-4 text-[1vw]">错误率最高的题型</div>
                    <div class="flex "> 
                      <div v-for="(val, id) in hear_list">
                        <div class=" text-[0.8vw] ml-2 justify-center text-gray-500 bg-white border-border-1 px-[12px] py-1" style=" border: 1px solid rgba(102, 112, 133, 1);  border-radius: 18px; width: auto; white-space: nowrap;">
                          {{ val }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex w-full items-center justify-center overflow-hidden">
                  <div class="mt-5" style="width: 20%;">
                    <img :src="PersionSpoken" />
                  </div>
                  <div class="flex flex-col mb-2" style="width: 20%">
                    <div class="text-[4vw]">{{ examStore.pastScores.spoken }}</div>
                    <div class="text-[0.8vw] text-gray-500">近7日平均分</div>
                  </div>
                  <div class="border-l  w-[0.5px] h-20 bg-green-1 ml-3"></div>
                  <div class="flex flex-col pd-2 p-6 overflow-auto" style="width: 60%;">
                    <div class="text-gray-500 font-bold mb-4 text-[1vw]">最需要提升的部分</div>
                    <div class="flex "> 
                      <div v-for="(val, id) in question_list">
                        <div class=" text-[0.8vw] ml-2 justify-center text-gray-500 bg-white border-border-1 px-[12px] py-1" style=" border: 1px solid rgba(102, 112, 133, 1);  border-radius: 18px; width: auto; white-space: nowrap;">
                          {{ val }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex w-full items-center justify-center overflow-hidden">
                  <div class="mt-5" style="width: 20%;">
                    <img :src="PersionWrite" />
                  </div>
                  <div class="flex flex-col mb-2" style="width: 20%">
                    <div class="text-[4vw]">{{ examStore.pastScores.writing }}</div>
                    <div class="text-[0.8vw] text-gray-500">近7日平均分</div>
                  </div>
                  <div class="border-l  w-[0.5px] h-20 bg-green-1 ml-3"></div>
                  <div class="flex flex-col pd-2 p-6 overflow-auto" style="width: 60%;">
                    <div class="text-gray-500 font-bold mb-4 text-[1vw]">错误率最高的题型</div>
                    <div class="flex "> 
                      <div v-for="(val, id) in question_list">
                        <div class=" text-[0.8vw] ml-2 justify-center text-gray-500 bg-white border-border-1 px-[12px] py-1" style=" border: 1px solid rgba(102, 112, 133, 1);  border-radius: 18px; width: auto; white-space: nowrap;">
                          {{ val }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </a-tab-pane>
            </a-tabs>
            </div>
        </div>
        <div class="bg-white rounded-md border-l col-start-4 col-span-2 row-span-2 shadow-lg flex flex-col items-center justify-center">
          <div class="flex mb-3">
            <div class="flex  " style="width: 40%;">
                <img :src="NewWord"  style="width: 100%;"/>
            </div>
            <div style="width: 60%;">
              <span class=" flex flex-col items-center text-[1vw]" style="width: 100%;">您的当前词汇量为<span class="text-[4vw]">0</span></span>
            </div>
          </div>
          <div
            class="bg-green-1 text-white w-2/3 h-[34px] rounded-lg border  flex items-center justify-center cursor-pointer max-w-full"  @click="onClick('new')"
          >
            {{ $t('学习新单词') }}
          </div>
        </div>
        <a-card class="col-start-4 col-span-2 row-span-3 shadow-lg overflow-y-auto">
          <div class="font-bold text-[20px]">近七日学习时长</div>
          <div ref="HomeChart" style="height: 300px; width: 100%;"></div>
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
import PersionRead from '@/assets/images/persion_read.svg'
import PersionHear from '@/assets/images/persion_hear.svg'
import PersionSpoken from '@/assets/images/persion_spoken.svg'
import PersionWrite from '@/assets/images/persion_write.svg'
import Lock from '@/assets/images/word-lock.svg'
import { useWordStore } from '@/stores/word'
import { useExamStore } from '@/stores/exam'
import { useRoute } from "vue-router"
const wordStore = useWordStore()
const examStore = useExamStore()
import * as echarts from 'echarts';
import { ref, onMounted, watchEffect} from 'vue'
const activeKey = ref('1');
const indexStore = useIndexStore()
const HomeChart = ref()
const chart = ref()
const $route = useRoute()
watchEffect (() => {
  chart.value?.setOption({
    color: [ '#f1b01f'],
    // legend: {
    //   data:['时长']
    // },
    xAxis: {
      data: ["M","T","W","T","F","S","S"]
    },
    yAxis: {},
    series: [{

      type: 'bar',
      data: [5, 20, 36, 10, 10, 20,10]
    }]
  });
}, {
  flush: 'post'
})
const style_bg = [
  'background: linear-gradient(256.27deg, #3E8AB3 -8.38%, #166195 128.6%)',
  'background: linear-gradient(250.22deg, #52CDD3 36.77%, #009ED0 117.42%)',
  'background: linear-gradient(250.75deg, #59DEA2 37.06%, #39C0A8 127.79%)',
  'background: linear-gradient(254.37deg, #27B170 -16.85%, #49BD86 96.58%)'
]

const question_list = ref(['基础题', '强化题', '文章小结题', '逻辑思考题'])
const hear_list = ref(['基础题', '强化题', '文章小结题', '逻辑思考题'])

const onClick = (type: 'new' ) => {
  wordStore.to_task(type)
}
onMounted(() => {
  wordStore.get_vocabs_tasks()
  examStore.getPastResult()
  console.log(examStore.pastScores)
  // HomeChart.value = echarts.init(document.getElementById('main'));
  // myEcharts()
  chart.value = echarts.init(HomeChart.value, 'main');
  window.addEventListener('resize', () => {
    const chart = echarts.getInstanceByDom(HomeChart.value);
    if (chart) {
      chart.resize();
    }
  });
})
</script>
<style scoped>
:global(.ant-tabs-content-holder) {
  overflow-y: auto;
}
</style>




