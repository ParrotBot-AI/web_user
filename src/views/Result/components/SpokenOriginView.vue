<template>
  <div class="w-full h-full overflow-hidden fixed top-0 left-0 z-30 flex flex-col bg-white">
    <b-header :title="props.data?.name">
      <template #right>
        <div class="flex">
          <a-button 
            type="primary" 
            class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center"
            @click="props.onExit"
          >
            <span><AuditOutlined class="mr-1.5"/>查看批注</span>
          </a-button>
        </div>
      </template>
    </b-header>
    <BQuesTitle 
      :title="'口语听力原文'" 
      :index="props.data?.curIndex" 
      :length="props.data?.length"
    > 
    </BQuesTitle>
    <div class="flex flex-1 overflow-hidden">
      <div class="w-1/2 text-base h-full overflow-y-auto px-10 pt-10" :style="{borderRight: '1px solid #D0D5DD'}">
        <div v-if="props.data?.question?.voice_content">
          <p v-for="val in props.data?.question?.voice_content?.split('\n')" class="text-base mb-4 text-[#475467]">
              {{ val }}
          </p>
        </div>
        <h4 class="text-[#667085] font-normal text-base mb-4">播放听力材料</h4>
        <BaseResAudio :src="props.data?.question.answer_voice_link" />
      </div>
      <div class="w-1/2 flex flex-col overflow-y-auto px-[80px] pt-[20px] text-[#475467] text-base">
        <p class="my-6">
          <b>Question：</b> {{ props.data?.question.question_title }}
        </p>
        <div v-if="props.data?.question?.question_content">
          <b class="mb-2 block">口语阅读原文</b>
          <p v-for="(val,i) in props.data?.question?.question_content?.split('\n')" class="mb-4" :key="i">
              {{ val }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { AuditOutlined } from '@ant-design/icons-vue'
import BaseResAudio from "@/components/BaseResAudio/index.vue"
import { defineProps } from "vue"
const props = defineProps<{
  data: any[]
  onExit: () => void
}>()
console.log(props.data)

</script>
<style scoped>
  
</style>