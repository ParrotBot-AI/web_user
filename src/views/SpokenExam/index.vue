<template>
   <a-layout class="w-full h-full flex flex-col">
    <b-header title="模拟考试">
      <template #right>
        <div class="flex">
          <a-button type="primary" class="mx-2 flex items-center justify-center"><img :src="help" class="pr-2" />HELP</a-button>
          <a-button type="primary" class="mx-2 flex items-center justify-center">CONTINUE <img :src="right" class="pl-2" /></a-button>
        </div>
      </template>
    </b-header>
    <div class="text-center h-14 flex items-center justify-between bg-white px-8">
      <h2 class="text-gray-900 text[20px] font-bold">{{curInfo.title}}</h2>
      <span></span>
      <Timer />
    </div>
    <div class="flex flex-1 justify-center items-center overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
      <div class="px-32 -mt-40">
        <h2 class="text-[#21272A] pb-10">
          {{ curInfo.content.title }}
        </h2>
        <div class="text-[#475467] text-xl pb-10">
          <p v-for="(val,i) in curInfo.content.text" :key="i">{{ curInfo.content.text[i] }}</p>
        </div>
        <div class="text-[#475467]">
          (Select <a-button type="primary" class="mx-2">CONTINUE <img :src="right" class="pl-2" /></a-button> at any time to dismiss these directions.)
        </div>
      </div>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue'
import Timer from "@/views/ReadExam/components/Timer.vue"
import right from '@/assets/images/right.svg'
import help from '@/assets/images/help.svg'
import "@/service/file"
import { useExamStore } from '@/stores/exam'
import { useRoute } from "vue-router"
const step = ref(0)
const examStore = useExamStore()
const { query } = useRoute()
const speakingInfo = reactive([
  {
    id: 1,
    title: 'Speaking',
    content: {
      title: 'Speaking Section Directions',
      text: [`In this section, you will be able to demonstrate your ability to speak about a variety of topics. `,
      `You will answer four questions by speaking into the microphone.`,
      `For each question, you will have time to prepare before giving your answer.`]

    }
  }
])
const curInfo = computed(() => {
  return speakingInfo[step.value]
})
onMounted(() => {
  examStore.getExamData(query.id as string)
})
</script>
<style scoped>
  
</style>