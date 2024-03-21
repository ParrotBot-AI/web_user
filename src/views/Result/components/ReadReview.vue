<template>
  <div class="flex flex-1 overflow-hidden bg-white">
    <div class="flex-1 h-full overflow-h-auto overflow-x-hidden pt-2" :style="{ borderRight: `1px solid #D0D5DD` }">
      <div ref="contentDiv" id="content" class="content-box">
        <p class="px-8 text-gray-500 text-[18px] leading-7 pb-4 indent-8" :class="'read-mock-content-' + (i + 1)"
          v-for="(val, i) in props.answerData?.question_parent.question_content" v-html="val" :key="i"></p>
      </div>
    </div>
    <div class="flex-1 h-full overflow-h-auto overflow-x-hidden px-12 py-7">
      <h1 class="text-gray-500 text-[18px] pb-10 font-bold">
        <p v-html="props.answerData?.question_content?.replace(/\[▇\]/g, `<span class='fill-item'>【<b></b>】</span>`)"></p>
      </h1>
        <!-- 单选回顾 -->
      <div>
        <div v-for="( item, index ) in  props.answerData?.detail " :key="index" :value="index"
          class="flex pb-7 text-gray-500 myraido">
          <span class="w-5 h-5 rounded-full mr-4 opt-status" :class="{
            success: false,
            error: false,
            default: true
          }"></span>
          <p class="flex-1">{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineProps} from "vue"

const props = defineProps<{
  answerData: any
}>()

</script>
<style scoped>
.content-box {
  position: relative;
}
.content-box:before {
  content: '';
  position: absolute;
  top: 5px;
  left: 2rem;
  width: 16px;
  height: 16px;
  background: #1B8B8C;
}
.opt-status {
  background-size: 70%;
  background-position: center center;
  background-repeat: no-repeat;
}
.opt-status.success {
  background-color: #1B8B8C;
  background-image: url('@/assets/homeIcon/success.svg')
}
.opt-status.default {
  background-color: #B2DAC8;
  background-image: url('@/assets/homeIcon/success.svg')
}
.opt-status.error {
  background-color: #C33473;
  background-image: url('@/assets/homeIcon/error.svg')
}
</style>