<template>
  <a-spin v-if="loading" size="large" tip="试题加载中..." class="fixed top-1/2 left-1/2 -translate-1/2 z-50"/>
  <a-layout v-else class="w-full h-full flex flex-col">
    <b-header title="模拟考试">
      <template #right>
        <div class="flex">
          <HeaderBtn 
            v-for="val in Object.keys(HeaderBtnsConfig)" 
            v-bind="HeaderBtnsConfig[val]" 
            :key="val"
          />
        </div>
      </template>
    </b-header>
    <BGuide 
      v-if="curInfo?.type === 'info'"
      :title="curInfo.title!"
      :info_title="curInfo.info_title!"
      :question_title="curInfo.question_title!"
      :is_show_footer="true"
    />
    <BGuide 
      v-else-if="step > 0 && curInfo.step === 0"
      :title="curInfo.guide.title!"
      :info_title="curInfo.guide.info_title!"
      :question_title="curInfo.guide.question_title!"
      :is_show_footer="true"
    />
    <template v-else>
    <div class="text-center h-14 flex items-center justify-between bg-white px-8">
      <h2 class="text-gray-900 text-[20px] font-bold">{{curInfo.title}}</h2>
      <span>
        Question {{ step }} of {{ speakingInfo.length - 1}}
      </span>
      <div></div>
    </div>
    <div class="flex flex-1 justify-center items-center overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
      <div v-if="curInfo.order === 1" class="px-32 -mt-56">
        <div class="text-[#475467] text-xl pb-10 after:content-[''] after:w-[50%] after:h-[1px] after:bg-[#D0D5DD] after:block after:mx-auto after:mt-10">
          <p v-for="(val,i) in curInfo.question_title" :key="i">{{ val }}</p>
        </div>
        <TimerBlock 
          v-bind="curInfo.keywords!" 
          v-if="curInfo.step === 2"
          status="prepare"
          :onended="onPrepareended"
        />
        <TimerBlock 
          v-bind="curInfo.keywords!" 
          v-else-if="curInfo.step === 3"
          status="speak"
          :onended="onSpeakended"
        />
      </div>
      <div v-else-if="curInfo.order === 2 || curInfo.order === 3" class="px-32 -mt-56">
        <template v-if="curInfo.step === 1">
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
            :ended="() => {
              speakingInfo[step].step++
              changeQueryQuestion()
            }"
          />
        </template>
        <template v-else-if="curInfo.step === 2">
          <BAudio 
            title="Please listen carefully." 
            :url="curInfo.voice_link!" 
            :ended="() => {
              speakingInfo[step].step++
              changeQueryQuestion()
            }"
            img="2"
          />
        </template>
        <template v-else-if="curInfo.step > 2">
          <div class="text-[#475467] text-xl pb-10 after:content-[''] after:w-[50%] after:h-[1px] after:bg-[#D0D5DD] after:block after:mx-auto after:mt-10">
            <p v-for="(val,i) in curInfo.question_title" :key="i">{{ val }}</p>
          </div>
          <TimerBlock 
            v-bind="curInfo.keywords!" 
            v-if="curInfo.step === 3"
            status="prepare"
            :onended="onPrepareended"
          />
          <TimerBlock 
            v-bind="curInfo.keywords!" 
            v-if="curInfo.step === 4"
            status="speak"
            :onended="onSpeakended"
          />
        </template>
      </div>
      <div v-else-if="curInfo.order === 4" class="px-32 -mt-56">
        <template v-if="curInfo.step === 1">
          <BAudio 
            title="Please listen carefully." 
            :url="curInfo.voice_link!" 
            img="2"
            :ended="() => {
              speakingInfo[step].step++
              changeQueryQuestion()
            }"
          />
        </template>
        <template v-else-if="curInfo.step > 1">
          <div class="text-[#475467] text-xl pb-10 after:content-[''] after:w-[50%] after:h-[1px] after:bg-[#D0D5DD] after:block after:mx-auto after:mt-10">
            <p v-for="(val,i) in curInfo.question_title" :key="i">{{ val }}</p>
          </div>
          <TimerBlock 
            v-bind="curInfo.keywords!" 
            v-if="curInfo.step === 2"
            status="prepare"
            :onended="onPrepareended"
          />
          <TimerBlock 
            v-bind="curInfo.keywords!" 
            v-if="curInfo.step === 3"
            status="speak"
            :onended="onSpeakended"
          />
        </template>
      </div>
    </div>
  </template>
  </a-layout>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, reactive, watchEffect } from 'vue'
import BGuide from "@/components/BaseGuide/index.vue"
import HeaderBtn from "@/views/ReadExam/components/HeaderBtn.vue"
import TimerBlock from "./components/timeBlock.vue"
import "@/service/file"
import { useExamStore } from '@/stores/exam'
import { uploadFileToOBS } from "@/service/file"
import BTimerCircle from "@/components/BaseTimerCircle/index.vue"
import { stop, blobToFile} from '@/utils/recorder'
import { request_saveAnswer, request_computed_single_score } from '@/service/exam'

import BAudio from "@/components/BaseAudio/index.vue"
import { useRoute, useRouter } from "vue-router"
const $router = useRouter()
const { query } = useRoute()
const loading = ref(true)
const examStore = useExamStore()
const step = ref()
const isend = ref(false)
const HeaderBtnsConfig = reactive<{
  [k in string]: HeaderBtnProps
}>({
  horn: {
    title: 'horn',
    id: 'horn',
    disabled: true,
    isShow: false,
  },
  continue: {
    title: '跳过',
    id: 'continue',
    disabled: false,
    isShow: true,
    onClick: () => {
      if(step.value === 0) {
        step.value = 1
      } else {
        if(curInfo.value.order === 1 && curInfo.value.step === 2) {
          onPrepareended()
        } else if(
            curInfo.value.order === 1 && curInfo.value.step === 3 ||
            curInfo.value.order === 2 && curInfo.value.step === 4 ||
            curInfo.value.order === 3 && curInfo.value.step === 4 
          ) {
          onSpeakended()
        }else {
          curInfo.value.step++
        }
      }
      changeQueryQuestion()
    }
  }
})
const speakingInfo = reactive<Array<{
  type?: 'info'
  title?: string
  question?: number
  info_title?: string
  question_title?: Array<string>
  question_content?: Array<string>
  order?: number
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
const onPrepareended = () => {
  speakingInfo[step.value].step++
  try {
    console.log('start record')
  }catch (error) {
    console.error(error)
  }
}
const saveSingleAnswer = async (link:string) => {
  await request_saveAnswer({
    question_id: curInfo.value?.question_id!,
    answer_voice_link: link,
    duration: 0,
    sheet_id: query.id as string
  })
  await request_computed_single_score(query.id as string, curInfo.value?.question_id!)
}
const onSpeakended = async () => {
  try {
    const BlobAudio: Blob = stop()
    const fileName = `${curInfo.value.question_id}-answer.wav`
    const FileAudio = blobToFile(BlobAudio, fileName)
    const {url} = await uploadFileToOBS(FileAudio)
    await saveSingleAnswer(url)
    if(step.value < speakingInfo.length - 1) {
      step.value++
      speakingInfo[step.value].step = 0
      changeQueryQuestion()
    }
    if(isend.value){
      // 提交
      examStore.requestSubmitExam(query.id as string)
    }
  } catch (error) {
    console.log(error)
  }
}

const changeQueryQuestion = () => {
  $router.replace({
    query: {
      ...query,
      step: step.value,
      questionStep: speakingInfo[step.value].step
    }
  })
}
watchEffect(() => {
  if(step.value === speakingInfo.length - 1 && speakingInfo[step.value].step === speakingInfo[step.value].maxStep) {
    isend.value = true
    HeaderBtnsConfig.continue.isShow = false
  } else {
    isend.value = false
    HeaderBtnsConfig.continue.isShow = true
  } 
})
onMounted(async () => {
  await examStore.getExamData(query.id as string)
  step.value = Number(query.step) || 0
  examStore.examing_data.questions.map((v, i) => {
    const index = i + 1
    if(v.order === 1) {
      v.maxStep = 3
      v.title = 'Speaking'
      v.guide = {
        type: 'info',
        title: 'Speaking',
        question: index,
        info_title: `Question ${v.order} Directions`,
        question_title: [
            `You will now give your opinion about a familiar topic. `,
            `After you hear the question, you will have 15 seconds to prepare and 45 seconds to speak.`,
          ]
      }
    } else if(v.order === 2 || v.order === 3) {
      v.maxStep = 4
      v.title = 'Speaking'
      v.guide = {
        type: 'info',
        title: 'Listening',
        question: index,
        info_title: `Question ${v.order} Directions`,
        question_title: [
            `Now you will read a passage about a campus situation and then listen to a conversation about the same topic. You will then answer a question, using information from both the reading passage and the conversation. You will have 30 seconds to prepare and 60 seconds to speak.`,
          ]
      }
    } else if(v.order === 4){
      v.maxStep = 3
      v.title = 'Speaking'
      v.guide = {
        type: 'info',
        title: 'Listening',
        question: index,
        info_title: `Question ${v.order} Directions`,
        question_title: [
            `Now you will listen to a lecture. You will then be asked to summarize the lecture. You will have 20 seconds to prepare and 60 seconds to speak.`,
          ]
      }
    }
    v.step = 0
    v.question_title = v.question_title.split('\n')
    v.question_content = v.question_content?.split('\n')
  })
  speakingInfo.push(...examStore.examing_data.questions)
  speakingInfo[step.value].step = Number(query.questionStep) || 0
  loading.value = false
})
</script>
<style scoped>
  
</style>