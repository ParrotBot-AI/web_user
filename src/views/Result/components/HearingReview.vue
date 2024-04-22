<template>
  <div class="flex flex-1 overflow-hidden bg-white">
    <div class="flex-1 h-full overflow-hidden pt-2" :style="{ borderRight: `1px solid #D0D5DD` }">
      <div ref="contentDiv" id="content" class="content-box h-[70%] overflow-y-auto w-full">
        <p class="px-8 text-gray-500 text-[18px] leading-7 pb-4 indent-8" :class="'read-mock-content-' + (i + 1)"
          v-for="(val, i) in props.answerData?.question_parent.voice_content.split(/\n/)" v-html="val" :key="i"></p>
      </div>
      <div class="mt-4 mx-8">
        <h4 class="text-[#667085] font-normal text-base mb-4">播放听力材料</h4>
        <BaseResAudio :src="props.answerData?.question_parent.voice_link" />
      </div>
    </div>
    <div class="flex-1 h-full overflow-h-auto overflow-x-hidden px-12 py-7">
      <h1 class="text-gray-500 text-[18px] pb-10 font-bold">
        <p v-html="props.answerData?.question_content"></p>
      </h1>
      <div>
        <div v-for="( item, index ) in  props.answerData?.detail " :key="index" :value="index"
          class="flex pb-7 text-gray-500">
          <span class="w-5 h-5 rounded-full mr-4 opt-status" :class="{
            error: props.answerData?.answer[index] !== props.answerData?.answer_weight[index] && props.answerData?.answer[index] === 1,
            default: props.answerData?.answer[index],
            success: props.answerData?.answer_weight[index] === 1,
          }"></span>
          <p class="flex-1">{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
  <FloatAI :data="props.answerData" type="hearing" />
</template>
<script setup lang="ts">
import FloatAI from "@/components/AI/float.vue";
import BaseResAudio from "@/components/BaseResAudio/index.vue";
import { defineProps } from "vue";
const props = defineProps<{
  answerData: any
}>()

</script>
<style scoped>
.opt-status {
  background-size: 60% auto;
  background-position: center center;
  background-repeat: no-repeat;
  border: 1px solid #e6e6e6;
}
.opt-status.default {
  background-color: rgba(195, 52, 115, 0.6);
  border: 1px solid rgba(195, 52, 115, 0.6);
  background-image: url('@/assets/homeIcon/success.svg')
}
.opt-status.error {
  background-color: #C33473;
  border: 1px solid #C33473;
  background-image: url('@/assets/homeIcon/error.svg')
}
.opt-status.success {
  background-color: #1B8B8C;
  border: 1px solid #1B8B8C;
  background-image: url('@/assets/homeIcon/success.svg')
}
</style>