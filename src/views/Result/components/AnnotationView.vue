<template>
  <div class="flex-1 w-full h-full overflow-hidden relative z-20 flex flex-col">
    <b-header :title="curData.name">
      <template #center>
        <img :src="resultIcon" alt="logo" width="184px" class="-top-2 fixed left-1/2 -translate-x-1/2"/>
      </template>
      <template #right>
        <div class="flex">
          <a-button 
            type="primary" 
            class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center"
          >
            <span><EyeInvisibleOutlined class="mr-1.5"/> 隐藏批注</span>
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
    <div class="h-[50px] bg-[#F0F7F7] w-full"></div>
    <div class="flex-1 overflow-hidden bg-white w-full flex">
      <div class="w-1/2 relative flex flex-col" :style="{borderRight: '1px solid #D0D5DD'}">
        <h2 class="text-[#667085] font-base py-4 pl-[128px] text-base">原版</h2>
        <div class="overflow-y-auto flex-1 w-full pl-[128px] pr-[68px]">
          <div v-for="(val,i) in curData?.model_answer_content?.Content" :key="i" class="mb-2 text-base relative">
            <span class="absolute -left-[34px] top-[3px] text-[#1B8B8C] w-[20px] h-[20px] text-xs border border-[#1B8B8C] border-solid rounded-full flex justify-center items-center">{{ i }}</span>
            {{ val }}
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <a-tabs v-model:activeKey="curAiIndex" class="my-table">
          <a-tab-pane :key="0" tab="AI 批改">
            <div v-for="(val,i) in curData?.model_answer_content?.['Sentence Feedback']" :key="i" class="mb-2 text-base relative">
              <span class="absolute -left-[34px] top-[3px] text-[#1B8B8C] w-[20px] h-[20px] text-xs border border-[#1B8B8C] border-solid rounded-full flex justify-center items-center">{{ i }}</span>
              {{ val?.['Edited'] }}
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
          <div v-for="val in types" :key="val.id" class="flex text-base">
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
import { AuditOutlined, EyeInvisibleOutlined, RightOutlined } from '@ant-design/icons-vue';
import { computed, defineProps, ref } from "vue";
import { useRoute } from "vue-router";
const props = defineProps<{
  data: any[]
  onViewOrigin: (curdata:any) => void
  onBack: () => void
}>()
const curIndex = ref(0)
const curAiIndex = ref(0)
const {query} = useRoute()
const curData = computed(() => {
  console.log(props.data[curIndex.value])
  return props.data[curIndex.value]
})
const writingTypes = [
  {
    type: '内容与细节',
    id: 1,
    style: {
      color: '#667085',
      background: '#FDD44E',
    } 
  },
  {
    type: '结构与流畅度',
    id: 2,
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-color': '#667085'
    } 
  },
  {
    type: '语法',
    id: 3,
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-style': 'dashed',
      'text-decoration-color': '#C33473'
    } 
  },
  {
    type: '优秀用句',
    id: 4,
    style: {
      color: '#667085',
      background: '#B7D972',
    } 
  }
]
const spokenTypes = [
  {
    type: '内容',
    id: 1,
    style: {
      color: '#667085',
      background: '#FDD44E',
    } 
  },
  {
    type: '连贯性',
    id: 2,
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-color': '#667085'
    } 
  },
  {
    type: '语法',
    id: 3,
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-style': 'dashed',
      'text-decoration-color': '#C33473'
    } 
  },
  {
    type: '优秀用句',
    id: 4,
    style: {
      color: '#667085',
      background: '#B7D972',
    } 
  }
]
const types = computed(() => {
  return query.type === 'writing' ? writingTypes : spokenTypes
})
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
</style>