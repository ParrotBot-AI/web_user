<template>
  <div class="flex-1 w-full h-full overflow-hidden relative z-20 flex flex-col">
    <b-header :title="curData.name" :onClickBack="props.onBack">
      <template #center>
        <img :src="resultIcon" alt="logo" width="184px" class="-top-2 fixed left-1/2 -translate-x-1/2"/>
      </template>
      <template #right>
        <div class="flex">
          <a-button 
            type="primary" 
            class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center"
          >
            <span @click="toggle_mark"><EyeInvisibleOutlined v-show="showmark" class="mr-1.5" /> <EyeOutlined v-show="!showmark" class="mr-1.5" /> {{ showmark ? '隐藏批注' : '查看批注' }}</span>
          </a-button>
          <a-button 
            type="primary" 
            class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center"
            @click="() => props.onViewOrigin(curData)"
          >
            <span>查看原题<RightOutlined class="ml-1.5"/></span>
          </a-button>
          <a-button 
            type="primary" 
            class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center"
            @click="props.onBack"
          >
            <span><AuditOutlined class="mr-1.5"/>查看报告</span>
          </a-button>
        </div>
      </template>
    </b-header>
    <!--中间内容-->
    <div class="h-[50px] bg-[#F0F7F7] w-full pl-[128px] pr-[100px]">
      <p v-if="query.type === 'spoken'" class="text-[#475467] truncate mt-1"><b>Question: </b>{{ curData?.question?.question_title }}</p>
    </div>
    <div 
      class="w-[80px] h-[80px] bg-white fixed right-[calc(50vw+20px)] z-100 rounded-full flex flex-col justify-center items-center" 
      :style="{
        border: '10px solid #F0F7F7',
        top: query.type === 'spoken' ? `95px` : `82px`
      }">
      <span class="text-xs text-[rgba(0,0,0,0.50)]">评分</span>
      <p class="text-[#475467] text-[14px]"><span class="text-[20px]">{{ curData?.model_answer_content?.Overall }}</span> / {{ curData?.mockScoreTotal }}</p>
    </div>
    <div 
      class="w-[80px] h-[80px] bg-white fixed right-[20px] z-100 rounded-full flex flex-col justify-center items-center" 
      :style="{
        border: '10px solid #F0F7F7',
        top: query.type === 'spoken' ? `95px` : `82px`
      }">
      <span class="text-xs text-[rgba(0,0,0,0.50)]">评分</span>
      <p class="text-[#475467] text-[14px]"><span class="text-[20px]">{{ curData?.model_answer_content?.['Edited Overall'] || curData?.mockScoreTotal }}</span> / {{ curData?.mockScoreTotal }}</p>
    </div>
    <div class="flex-1 overflow-hidden bg-white w-full flex">
      <div class="w-1/2 relative flex flex-col relative" :style="{borderRight: '1px solid #D0D5DD'}">
        <h2 class="text-[#667085] font-base py-4 pl-[128px] text-base" v-if="query.type === 'writing'">原版</h2>
        <h2 class="text-[#667085] font-base py-4 pl-[128px] text-base flex items-center overflow-hidden" v-else >
          <span class="mr-4 mt-4">原版录音与文字转换</span>
          <BaseResAudio :src="curData?.question.answer_voice_link" class="my-audio"/>
        </h2>
        <div class="overflow-y-auto flex-1 w-full pl-[128px] pr-[68px]" ref="all_p">
          <div v-for="(val,i) in curData?.model_answer_content?.sent_back" :key="i" class="mb-4 text-base relative all-ps">
            <p 
              v-for="(v,k) in val" :key="k" class="relative text-base inline" 
              @mouseover="() => onShowCurMark(k, i, 'hover')"
              @mouseleave="() => onShowCurMark(k, i, 'leave')"
            >
              <span 
                class="bg-[#1B8B8C] text-[#fff] w-[20px] h-[20px] text-xs border border-[#1B8B8C] border-solid rounded-full inline-block text-center mx-1"
                :style="{lineHeight: '20px'}"
                v-show="showmark"
              >{{ k }}</span>
              <a-tooltip 
                placement="bottomRight" 
                :overlayInnerStyle="{'margin-top':'-10px', background: '#D0F0E6', color: '#0A3F64',fontSize: '12px',borderRadius: '15px',borderTopLeftRadius: '0',border: '1px solid #0A3F64', marginTop: '-20px', marginLeft: '3px', padding: '10px'}"
              >
                  <template #title>
                    <div>{{ v.Feedback }}</div>
                  </template>
                  <span :style="showmark ? v.curStyle : {}">{{ v.original }}</span>
              </a-tooltip>
            </p>
          </div>
        </div>
      </div>
      <div class="w-1/2 relative">
        <a-tabs v-model:activeKey="curAiIndex" class="my-table">
          <a-tab-pane :key="0" tab="AI 批改">
            <div v-for="(val,i) in curData?.model_answer_content?.sent_back" :key="i" class="text-base relative mb-5">
              <p v-for="(v,k) in val" :key="k" class="relative text-base inline">
                <span 
                  :style="{lineHeight: '20px'}"
                  v-show="showmark"
                  class="text-[#fff] bg-[#1B8B8C] w-[20px] h-[20px] text-xs border border-[#1B8B8C] border-solid rounded-full inline-block text-center mx-1"
                >{{ k }}</span>
                <span :style="showmark ? v.curStyle : {}">{{ v.Edited === 'No Change' ? v.original : v.Edited }}</span>
              </p>
            </div>
          </a-tab-pane>
          <a-tab-pane :key="1" tab="AI 点评">
            <div v-for="(val,i) in curData?.model_answer_content?.format_G_F" :key="i" class="text-base mb-4 text-[#667085]">
              <h4>{{ i }}</h4>
              <p>{{ val }}</p>
            </div>
            <h4 class="text-base text-[#667085]">Mind Map</h4>
            <p 
              v-for="(val,i) in curData?.model_answer_content?.format_M_M" 
              :key="i" 
              class="text-base mb-4 text-[#667085]"
            >{{ val }}</p>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <!---footer-->
    <footer class="bg-[#F0F7F7] h-[124px] flex justify-between items-center px-10">
      <div>
        <h2 class="text-[#667085] text-base pb-2">问题标注</h2>
        <div class="flex">
          <div v-for="val in curData?.ques_mark" :key="val.id" class="flex text-base">
            <p :style="val.style">Aa</p>
            <b class="mx-2 font-normal text-[#667085]">{{ val.type }}</b>
          </div>
        </div>
      </div>
      <div class="h-[70px] bg-white shadow-[0px_4.4px_22px_0px_rgba(0,0,0,0.10)] flex px-5 py-2 rounded-xl">
        <div 
          v-for="(val,i) in props.data" 
          @click="curIndex = i"
          :key="i" 
          class="h-full flex items-center justify-center px-8 cursor-pointer text-[#2C285B] rounded-xl"
          :class="{
            'bg-[rgba(208,240,230,0.50)] font-medium': curIndex === i
          }"
        >{{ val.name }}</div>
      </div>
    </footer>
  </div>
  <FloatAI :data="curData" />
</template>
<script setup lang="ts">
import resultIcon from "@/assets/images/result-icon.png";
import FloatAI from "@/components/AI/float.vue";
import BaseResAudio from "@/components/BaseResAudio/index.vue";
import { useResultStore } from "@/stores/result";
import { AuditOutlined, EyeInvisibleOutlined, EyeOutlined, RightOutlined } from '@ant-design/icons-vue';
import { computed, defineProps, ref } from "vue";
import { useRoute } from "vue-router";
const showmark = ref(true)
const resultStore = useResultStore()
const all_p = ref(null)
const props = defineProps<{
  data: any[]
  onViewOrigin: (curdata:any) => void
  onBack: () => void
}>()
const curIndex = ref(0)
const curAiIndex = ref(0)
const {query} = useRoute()
const curData = computed(() => {
  return props.data[curIndex.value]
})

const toggle_mark = () => {
  showmark.value = !showmark.value
}
const onShowCurMark = (key, index, type) => {
  if(!showmark.value) return
  resultStore.showHoverMark(key, index, curIndex.value, type)
}
</script>
<style scoped>
  .my-table {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  :global(.my-table .ant-tabs-nav){
    margin: 0 80px;
  }
  :global(.my-table .ant-tabs-content-holder){
    width: 100%;
    margin-top: 10px;
  }
  :global(.ant-tabs .ant-tabs-content) {
    height: 100%;
  }
  :global(.ant-tabs-tabpane){
    overflow-y: auto;
    height: 100%;
    padding: 0 80px;
  }
  :global(.ant-tabs-top >.ant-tabs-nav::before) {
    display: none;
  }
  :global(.my-audio .audio-bar){
    width: 190px;
    position: relative;
    padding-right: 45px;
  }
  :global(.my-audio .times>span:nth-child(1)){
    display: none;
  }
  :global(.my-audio .times>span:nth-child(2)){
    position: absolute;
    top: -3px;
    right: 0;
    font-size: 12px;
    font-weight: normal;
  }
  :global(.ant-tooltip-arrow) {
    display: none!important;
  }
</style>