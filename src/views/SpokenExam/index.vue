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
          <p v-for="(val,i) in curInfo.question_title" :key="i">{{ val }}</p>
        </div>
        <div class="text-[#475467]">
          (Select <a-button type="primary" class="mx-2">CONTINUE <img :src="right" class="pl-2" /></a-button> at any time to dismiss these directions.)
        </div>
      </div>
      <div v-else-if="curInfo.order === 1" class="px-32 -mt-56">
        <div class="text-[#475467] text-xl pb-10 after:content-[''] after:w-[50%] after:h-[1px] after:bg-[#D0D5DD] after:block after:mx-auto after:mt-10">
          <p v-for="(val,i) in curInfo.question_title" :key="i">{{ val }}</p>
        </div>
        <TimerBlock 
          v-bind="curInfo.keywords!" 
          v-if="curInfo.question_status === 'prepare'"
          :status="curInfo.question_status"
          :onended="onPrepareended1"
        />
        <TimerBlock 
          v-bind="curInfo.keywords!" 
          v-else-if="curInfo.question_status === 'speak'"
          :status="curInfo.question_status"
          :onended="onSpeakended1"
        />
      </div>
      <div v-else-if="curInfo.order === 2 || curInfo.order === 3" class="px-32 -mt-56">
        <template v-if="curInfo.question_status === 'init'">
          <h2 class="text-[#21272A] pb-10">
            <p v-for="(val,i) in curInfo.question_title" :key="i">{{ val }}</p>
          </h2>
          <div class="text-[#475467] text-xl pb-10">
            <p v-for="(val,i) in curInfo.question_content" :key="i">{{ val }}</p>
          </div>
          <BTimerCircle 
            :time="45" 
            title="Reading time" 
            class="absolute right-16 bottom-16" 
            :ended="onPrepareended2"
          />
        </template>
        <template v-else-if="curInfo.question_status === 'listening'">
          <BAudio 
            title="Please listen carefully." 
            :url="curInfo.voice_link!" 
            img="2"
          />
        </template>
        <template v-else-if="curInfo.question_status === 'prepare' || curInfo.question_status === 'speak'">
          <div class="text-[#475467] text-xl pb-10 after:content-[''] after:w-[50%] after:h-[1px] after:bg-[#D0D5DD] after:block after:mx-auto after:mt-10">
            <p v-for="(val,i) in curInfo.question_title" :key="i">{{ val }}</p>
          </div>
          <TimerBlock 
            v-bind="curInfo.keywords!" 
            v-if="curInfo.question_status === 'prepare'"
            :status="curInfo.question_status"
            :onended="onPrepareended1"
          />
          <TimerBlock 
            v-bind="curInfo.keywords!" 
            v-if="curInfo.question_status === 'speak'"
            :status="curInfo.question_status"
            :onended="onPrepareended1"
          />
        </template>
      </div>
      <div v-else-if="curInfo.order === 4" class="px-32 -mt-56">
        <template v-if="curInfo.question_status === 'init'">
          <BAudio 
            title="Please listen carefully." 
            :url="curInfo.voice_link!" 
            img="2"
          />
        </template>
        <template v-else-if="curInfo.question_status === 'prepare' || curInfo.question_status === 'speak'">
          <div class="text-[#475467] text-xl pb-10 after:content-[''] after:w-[50%] after:h-[1px] after:bg-[#D0D5DD] after:block after:mx-auto after:mt-10">
            <p v-for="(val,i) in curInfo.question_title" :key="i">{{ val }}</p>
          </div>
          <TimerBlock 
            v-bind="curInfo.keywords!" 
            v-if="curInfo.question_status === 'prepare'"
            :status="curInfo.question_status"
            :onended="onPrepareended1"
          />
          <TimerBlock 
            v-bind="curInfo.keywords!" 
            v-if="curInfo.question_status === 'speak'"
            :status="curInfo.question_status"
            :onended="onPrepareended1"
          />
        </template>
      </div>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue'
import TimerBlock from "./components/timeBlock.vue"
import Timer from "@/views/ReadExam/components/Timer.vue"
import right from '@/assets/images/right.svg'
import help from '@/assets/images/help.svg'
import "@/service/file"
import { useExamStore } from '@/stores/exam'
import { uploadFileToOBS } from "@/service/file"
import BTimerCircle from "@/components/BaseTimerCircle/index.vue"
import {destroy, start, stop, blobToFile} from '@/utils/recorder'
import BAudio from "@/components/BaseAudio/index.vue"
import { useRoute } from "vue-router"
const step = ref(0)
const examStore = useExamStore()
const { query } = useRoute()
const speakingInfo = reactive<Array<{
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
    title: 'Speaking',
    info_title: 'Speaking Section Directions',
    question_title: [
        `In this section, you will be able to demonstrate your ability to speak about a variety of topics. `,
        `You will answer four questions by speaking into the microphone.`,
        `For each question, you will have time to prepare before giving your answer.`
      ]
  }
])

const curInfo = computed(() => {
  return speakingInfo[step.value]
})
const onclickContinue = async () => {
  if(curInfo.value.order === 1) {
    if(curInfo.value.question_status === 'init') {
      speakingInfo[step.value].question_status = 'prepare'
    } else if(curInfo.value.question_status === 'prepare') {
      onPrepareended1()
    } else if(curInfo.value.question_status === 'speak') {
      onSpeakended1()
    }
  } else if(curInfo.value.order === 2 || curInfo.value.order === 3) {
    if(curInfo.value.question_status === 'init') {
      speakingInfo[step.value].question_status = 'listening'
    } else if(speakingInfo[step.value].question_status === 'listening'){
      curInfo.value.question_status = 'prepare'
    } else if(curInfo.value.question_status === 'prepare') {
      onPrepareended1()
    } else if(curInfo.value.question_status === 'speak') {
      onSpeakended1()
    }
  } else if(curInfo.value.order === 4) {
    if(curInfo.value.question_status === 'init') {
      speakingInfo[step.value].question_status = 'prepare'
    } else if(curInfo.value.question_status === 'prepare') {
      onPrepareended1()
    } else if(curInfo.value.question_status === 'speak') {
      onSpeakended1()
    }
  } else {
    step.value++
  }
}
const onPrepareended1 = () => {
  speakingInfo[step.value].question_status = 'speak'
  start()
}
const onSpeakended1 = async () => {
  try {
    speakingInfo[step.value].question_status = 'end'
    const BlobAudio: Blob = stop()
    const fileName = `${curInfo.value.question_id}-answer.wav`
    const FileAudio = blobToFile(BlobAudio, fileName)
    const res = await uploadFileToOBS(FileAudio)
    destroy()
  } catch (error) {
    console.log(error)
  } finally {
    console.log('++++++++')
    step.value++
  }
}
const onPrepareended2 = () => {
  speakingInfo[step.value].question_status = 'listening'
}
onMounted(async () => {
  await examStore.getExamData(query.id as string)
  examStore.examing_data.questions.reduce((def, value) => {
    if(value.order === 1) {
      def.push({
        type: 'info',
        title: 'Speaking',
        question: 1,
        info_title: 'Question 1 Directions',
        question_title: [
            `You will now give your opinion about a familiar topic. `,
            `After you hear the question, you will have 15 seconds to prepare and 45 seconds to speak.`,
          ]
      })
    } else if(value.order === 2 || value.order === 3) {
      def.push({
        type: 'info',
        title: 'Listening',
        question: value.order,
        info_title: `Question ${value.order} Directions`,
        question_title: [
            `Now you will read a passage about a campus situation and then listen to a conversation about the same topic. You will then answer a question, using information from both the reading passage and the conversation. You will have 30 seconds to prepare and 60 seconds to speak.`,
          ]
      })
    } else if(value.order === 4){
      def.push({
        type: 'info',
        title: 'Listening',
        question: value.order,
        info_title: `Question 4 Directions`,
        question_title: [
            `Now you will listen to a lecture. You will then be asked to summarize the lecture. You will have 20 seconds to prepare and 60 seconds to speak.`,
          ]
      })
    }
    def.push({
      ...value,
      title: 'Listening',
      question_status: 'init',
      question: value.order,
      question_content: value.question_content?.split(/\\n/),
      question_title: value.question_title?.split(/\\n/)
    })
    return def
  }, speakingInfo)
})
</script>
<style scoped>
  
</style>