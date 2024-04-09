<template>
  <div class="flex p-5 w-full h-full">
    
    <div class="flex flex-col flex-1 pr-4 h-full relative pt-[300px]">
      <!--用户信息-->
      <div class="absolute top-0 left-0 w-full pr-4">
        <div class="flex">
          <div class="w-[calc(100%-60px)] flex bg-white h-[130px] ml-[60px] mt-4 shadow-lg rounded-md border border-border-1 border-solid relative pl-[80px]">
            <a-avatar
             class="bg-green-1 absolute top-[-10px] left-[-60px] shadow-lg rounded-md border border-border-1 border-solid" 
              style="font-size: 40px;" 
              shape="square" 
              :size="100"
              :src="indexStore.userInfo.avatar" :alt="indexStore.userInfo.name">
              <img :src="avatar" width="70%" />
            </a-avatar>
            <div class="h-full flex flex-col pr-10 max-w-[45%]">
              <h1 class="text-[25px] text-gray-900 pt-6 truncate">{{ $t(getCurrentTimeOfDay()+'好') }}，{{ indexStore.userInfo.name }}
              </h1>
              <p class="text-gray-600 pt-6 truncate">Cease to struggle and you cease to live.</p>
            </div>
            <div class="flex h-full items-center justify-start"> 
              <div class="border-l w-[0.5px] h-1/2 bg-[rgba(0,0,0,0.20)]"></div>
            </div>
            <div class="flex flex-col ml-[40px] pt-6">
              <div class="font-bold text-[18px] overflow-hidden">
                每日打卡{{ ' ' }}
                <a-tooltip 
                  placement="bottomLeft" 
                  color="#D0F0E6" 
                  :overlayInnerStyle="{color: '#0A3F64',fontSize: '12px',borderRadius: '15px',borderTopLeftRadius: '0',border: '1px solid #0A3F64', marginTop: '-20px', marginLeft: '3px', padding: '10px'}"
                >
                  <template #title>
                    <span>每日学习30分钟以上即完成当日<br/>打卡任务！加油哦！</span>
                  </template>
                  <img :src="hint" alt="hint" />
                </a-tooltip>
              </div>
              <div class="flex text-[12px] font-normal pt-3 ml-[-8px]">
                <div class="flex px-[10px] flex-col items-center" v-for="(val,i) in userStore.homeDaka" :key="val?.date">
                  <span class="w-[24px] h-[24px] daka-icon" :class="val.class">
                      <svg width="24px" height="24px" v-if="val.class==='today'">
                        <path id="fanPath" fill="#F3B84E" :d="computedStyle(val)"/>
                      </svg>
                    </span>
                  <span class="mt-1">{{ val.week_day[0] }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid w-full grid-cols-4 gap-2 h-[130px] py-4 ">
          <a-card class="h-[116px] flex items-center justify-center" v-for="(val, id) in indexStore.userTargets" :key="val.id" :style="style_bg[id]" >
            <a-card-meta >
              <template #title>
                <span v-if="val.id === 'test_due'" class="absolute right-1 top-1 w-6 h-6 cursor-pointer" @click="openCalendar">
                  <img :src="bxCalendar" />
                </span>
                <span class="flex items-center justify-center text-[34px] text-white">{{ val.val || 0 }}</span>
              </template>
              <template #description>
                <span class="text-white">{{  $t(val.desc) }}</span>
              </template>
            </a-card-meta>
          </a-card>
        </div>
      </div>
      <div class="grid grid-cols-5 grid-rows-5 gap-4 w-full h-full">
        <div class="col-span-3 overflow-hidden row-span-5 bg-white rounded-md border shadow-lg border-border-1 border-solid flex-1 px-9 pb-3">
          <div class="h-full relative pt-3">
            <a-tabs class="h-full task-tabs" v-model:activeKey="activeKey">
              <a-tab-pane key="1" tab="我的任务">
                <BaseCard :title="`${$t('今日任务')} (${indexStore.userTargetsList?.today?.length})`" :list="indexStore.userTargetsList?.today">
                </BaseCard>
                <BaseCard v-if="indexStore.userTargetsList?.wk?.length"
                  :title="`${$t('周度任务')} (${indexStore.userTargetsList.wk.length})`" :list="indexStore.userTargetsList?.wk">
                </BaseCard>
              </a-tab-pane>
              <a-tab-pane key="2" tab="个人学习诊断" >
                <template v-if="examStore?.pastScoresIsEmpty">
                  <p class="text-xs text-center text-[#999] mt-20">暂无学习诊断，快去学习吧～</p>
                </template>
                <template v-else>
                  <div v-for="(val, i) in examStore?.pastScores" class="flex w-full items-center justify-center overflow-hidden" :key="i">
                    <div class="flex mb-2 items-center justify-center w-[180px]">
                      <img :src="listIcon(i)" width="26" class="mt-3"/>
                      <div class="flex flex-col flex-1 overflow-hidden text-center">
                        <div class="text-[50px] text-[#475467] font-medium">{{ val.avg_s }}</div>
                        <div class="text-base text-[#6B7280] mt-2">近7日平均分</div>
                      </div>
                    </div>
                    <div class="border-l w-[0.5px] bg-[#D0F0E6] ml-3 h-[78px]"></div>
                    <div class="flex flex-1 flex-col p-6 overflow-hidden">
                      <div class="text-gray-500 font-bold mb-4 text-[1vw]">错误率最高的题型</div>
                      <div class="flex overflow-auto scorll-bar-hidden" v-if="val.tag"> 
                        <div v-for="(v, i) in val.tag" :key="i">
                          <div class=" text-[0.8vw] ml-2 justify-center text-gray-500 bg-white border-border-1 px-[12px] py-1" style=" border: 1px solid rgba(102, 112, 133, 1);  border-radius: 18px; width: auto; white-space: nowrap;">
                            {{ v.name }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </a-tab-pane>
            </a-tabs>
            </div>
        </div>
        <div class="bg-white rounded-md border-l col-start-4 col-span-2 row-span-2 shadow-lg flex flex-col items-center justify-center">
          <div class="flex mb-3">
            <div class="flex" style="width: 40%;">
                <img :src="NewWord"  style="width: 100%;"/>
            </div>
            <div style="width: 60%;">
              <span class=" flex flex-col items-center text-[1vw]" style="width: 100%;">您的当前词汇量为<span class="sm:text-[3vw] text-[4vw]">
                {{ wordStore.vocabs_statics_data?.vocab ? wordStore.vocabs_statics_data?.vocab : $t('未测试') }}
              </span></span>
            </div>
          </div>
          <a-button
            type="primary"
            class="bg-green-1 text-white w-2/3 h-[34px] rounded-lg border  flex items-center justify-center cursor-pointer"  
            @click="onClick('new')"
          >
            学习新单词
          </a-button>
        </div>
        <div class="col-start-4 col-span-2 row-span-3 shadow-lg overflow-y-auto scorll-bar-hidden flex flex-col overflow-hidden rounded-md bg-white">
          <div class="font-bold text-[20px] text-[#1B2559] pl-4 py-3">近七日访问次数</div>
          <div class="homeChartBox flex-1 overflow-hidden p-2">
            <div ref="HomeChart"></div>
          </div>
        </div>
      </div>
    </div>
    <AIComponent />
    <a-modal 
      class="calendar-modal"
      v-model:open="calenderOpen" 
      title=""
      :closable="false"
      :footer="null"
      width="320px"
    >
      <a-calendar 
        :fullscreen="false" 
        v-model:value="examDate" 
        :disabledDate="current => current < dayjs().startOf('day')"
        @select="onselect"
      >
        <template #headerRender="{value:current}"> 
          <div style="margin-bottom: 10px" class="h-[50px] bg-[#1B8B8C] text-white flex justify-center items-center">选择你的托福考试时间</div>
          <header class="flex justify-between items-center px-3 pb-2">
            <LeftOutlined class="cursor-pointer" @click="onclickChangeMonth(-1)" />
            <span>{{current.year()}}年{{current.month() + 1}}月</span>
            <RightOutlined class="cursor-pointer" @click="onclickChangeMonth(1)" />
          </header>
        </template>
      </a-calendar>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import bxCalendar from "@/assets/homeIcon/bx_calendar.svg"
import avatar from "@/assets/images/avatat.jpg"
import hint from "@/assets/images/hint.png"
import PersionHear from '@/assets/images/persion_hear.svg'
import PersionRead from '@/assets/images/persion_read.svg'
import PersionSpoken from '@/assets/images/persion_spoken.svg'
import PersionWrite from '@/assets/images/persion_write.svg'
import NewWord from '@/assets/images/word-new.svg'
import AIComponent from '@/components/AI/index.vue'
import BaseCard from "@/components/BaseCard/index.vue"
import { useExamStore } from '@/stores/exam'
import { useIndexStore } from '@/stores/index'
import { useUserStore } from '@/stores/user'
import { useWordStore } from '@/stores/word'
import { getCurrentTimeOfDay } from "@/utils/utils"
import {
LeftOutlined,
RightOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'
import * as echarts from 'echarts'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
const calenderOpen = ref(false)
const wordStore = useWordStore()
const examStore = useExamStore()
const userStore = useUserStore()
const activeKey = ref('1');
const indexStore = useIndexStore()
const HomeChart = ref()
const chart = ref()
const examDate = ref<Dayjs>()
const icons = {
  'read': PersionRead,
  'hear': PersionHear,
  'spoken': PersionSpoken,
  'writing': PersionWrite
}
const listIcon = (i) => {
  return icons[i]
}
const setOptions =  () => {
  console.log('userStore?.homeCharts?.length:', userStore?.homeCharts?.length)
  chart.value?.setOption({
    grid: {
      left: '28px',
      right: 0,
      top: '10px',
      bottom: '20px'
    },
    color: [ '#f1b01f'],
    xAxis: {
      data: userStore?.homeCharts?.map(item => item?.week_day[0])
    },
    yAxis: {},
    series: [{
      type: 'bar',
      data: userStore?.homeCharts?.map(item => item?.login_count)
    }]
  });
}
watch(() => userStore?.homeCharts?.length, setOptions, {
  immediate: true
})
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
  wordStore.get_vocabs_statics() 
  wordStore.get_vocabs_tasks()
  examStore.getPastResult()
  userStore.api_checkin()
  indexStore.daka()
  examDate.value = dayjs()
  const box = document.querySelector('.homeChartBox')
  console.log('onMounted::::', box)
  HomeChart.value.style.width = box?.offsetWidth - 20 + 'px'
  HomeChart.value.style.height = box?.offsetHeight - 20 + 'px'
  chart.value = echarts.init(HomeChart.value);
  setOptions()
  window.addEventListener('resize', () => {
    const chart = echarts.getInstanceByDom(HomeChart.value);
    if (chart) {
      chart.resize();
    }
  });
})
const openCalendar = () => {
  calenderOpen.value = true
}
const computedStyle = computed(() => {
  return (data) => {
    const percentage = data.count_process / data.count_target * 100;
    // const percentage = 30;
    const startAngle = -90; // 从12点钟方向开始
    const endAngle = startAngle + percentage * 360 / 100;

    const startX = 12 + Math.cos(startAngle * Math.PI / 180) * 12;
    const startY = 12 + Math.sin(startAngle * Math.PI / 180) * 12;
    const endX = 12 + Math.cos(endAngle * Math.PI / 180) * 12;
    const endY = 12 + Math.sin(endAngle * Math.PI / 180) * 12;

    const largeArcFlag = percentage > 50 ? 1 : 0;
    return `M12,12 L${startX},${startY} A12,12 0 ${largeArcFlag},1 ${endX},${endY} Z`
  }
})
watchEffect(() => {
  // indexStore.userTargets[2].val 是多少天之后考试
  if (indexStore.userTargets[2].val) {
    examDate.value = dayjs().add(indexStore.userTargets[2].val, 'day')
  }
})
const onclickChangeMonth = (type) => {
  examDate.value = examDate.value.add(type, 'month')
}
const onselect = async (val) => {
  await indexStore.set_update_questionnaire({
    next_exam_date: val.format('YYYY-MM-DD')
  })
  calenderOpen.value = false
  await userStore.api_checkin()
  message.success('设置成功')
}
</script>
<style scoped>
:global(.ant-picker-calendar) {
  overflow: hidden;
}
:global(.ant-tabs-content-holder) {
  overflow-y: auto;
}
:global(.calendar-modal .ant-modal-content) {
  padding: 0;
}
:global(.calendar-modal .ant-picker-calendar-date-content) {
  display: none;
}
:global(.calendar-modal .ant-picker-calendar.ant-picker-calendar-full .ant-picker-calendar-date) {
  width: 17px;
  height: 17px;
  padding: 0;
}
:global(.calendar-modal .ant-picker-calendar .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner) {
  background: #F3B84E;
  border-radius: 100%;
}
:global(.calendar-modal .ant-picker-calendar .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before) {
  border: none;
}
:global(.calendar-modal .ant-picker-content>tbody) {
  margin-top: 10px!important;
}
.scorll-bar-hidden {
  scrollbar-width: none;
}
.daka-icon {
  border-radius: 50%;
  overflow: hidden;
}
.daka-icon.success {
  background-color: #F3B84E;
  background-image: url('@/assets/images/signed.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
}
.daka-icon.fail {
  background-color: #D0D5DD;
  background-image: url('@/assets/images/sing-fail.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
}
.daka-icon.today {
  background-color: #FFEAA4;
  position: relative;
}
.daka-icon.lock {
  background-color: #D0D5DD;
  background-image: url('@/assets/images/unsign.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>




