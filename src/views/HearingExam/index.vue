<template>
  <a-layout class="w-full h-full flex flex-col">
    <b-header title="模拟考试">
      <template #right>
        <div class="flex">
          <a-button type="primary" class="mx-2 flex items-center justify-center"><img :src="help" class="pr-2" />HELP</a-button>
          <a-button type="primary" class="mx-2 flex items-center justify-center" @click="onclickContinue">CONTINUE <img :src="right" class="pl-2" /></a-button>
        </div>
      </template>
    </b-header>
    <div class="text-center h-14 flex items-center justify-between bg-white px-8">
      <h2 class="text-gray-900 text[20px] font-bold">{{curInfo.title}}</h2>
      <span v-show="curInfo.question">
        Question {{ curInfo.question }} of 4
      </span>
      <Timer />
    </div>
    <div class="flex flex-1 justify-center items-center overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
      <div class="px-32 -mt-40" v-if="curInfo.type === 'info'">
        <h2 class="text-[#21272A] pb-10" v-show="curInfo.info_title">
          {{ curInfo.info_title }}
        </h2>
        <div class="text-[#475467] text-xl pb-10">
          <p v-for="(val,i) in curInfo.question_title" :key="i" v-html="val"></p>
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
import { useExamStore } from '@/stores/exam'
import { useRoute } from "vue-router"
import right from '@/assets/images/right.svg'
import help from '@/assets/images/help.svg'


const examStore = useExamStore()
const { query } = useRoute()
const step = ref(0)

const hearingInfo = reactive<Array<{
  type?: 'info'
  title?: string
  question?: number
  info_title?: string
  question_title?: Array<string>
  question_content?: Array<string>
  order?: number
  question_status?: 'init' | 'prepare' | 'speak' | 'listening' | 'end'
  question_id?: number
  keywords?: {
    p: number
    r: number
  }
  voice_link?: string | null
  voice_content?: string | null
}>>([
  {
    type: 'info',
    title: 'Listening',
    info_title: 'Listening Section Directions',
    question_title: [
        `In this section, you will be able to demonstrate your ability to understand conversations and lectures in English. The section is divided into two separately timed parts. You will hear each conversation or lecture only one time.`,
        `A clock will indicate how much time remains. The clock will count down only while you are answering questions, not while you are listening. In some questions, you`,
        `will see this icon: <div class="listen-icon"></div> . This means that you will hear, but not see, part of the question.`,
        `You must answer each question. After you answer, select <button class="nextbtn">Next</button> . In the actual test, you cannot return to previous questions.`
      ]
  }
])
const curInfo = computed(() => {
  return hearingInfo[step.value]
})
const onclickContinue = () => {

}
onMounted(async () => {
  await examStore.getExamData(query.id as string)
  examStore.examing_data.questions.reduce((def, value) => {
    def.push({
      ...value,
      title: 'Listening',
      question_status: 'init',
      question: value.order,
      question_content: value.question_content?.split(/\\n/),
      question_title: value.question_title?.split(/\\n/)
    })
    return def
  }, hearingInfo)
})
</script>
<style scoped>
  :global(.listen-icon) {
    display: inline-block;
    width: 52px;
    height: 48px;
    background: url(@/assets/images/listen-icon.png) no-repeat;
    background-size: cover;
  }
  :global(.nextbtn) {
    background: #1b8b8c;
    color: white;
    display: inline-block;
    vertical-align: middle;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  :global(.nextbtn:after) {
    content: '';
    display: inline-block;
    background: url(@/assets/images/right.svg) no-repeat;
    width: 8px;
    height: 14px;
    margin-left: 8px;
    margin-bottom: 2px;
    vertical-align: middle;
  }
</style>