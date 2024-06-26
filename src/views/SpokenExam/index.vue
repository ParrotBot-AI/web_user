<template>
  <a-spin
    v-if="loading"
    size="large"
    tip="试题加载中..."
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
  />
  <a-layout v-else class="w-full h-full flex flex-col">
    <b-header :title="query?.name || '模拟考试'">
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
      <BQuesTitle :title="curInfo.title" :index="step" :length="speakingInfo.length - 1">
      </BQuesTitle>
      <div class="flex flex-1 justify-center items-center overflow-hidden bg-white">
        <div v-if="curInfo.order === 1" class="px-32 -mt-56">
          <div
            class="text-[#475467] text-xl pb-10 after:content-[''] after:w-[50%] after:h-[1px] after:bg-[#D0D5DD] after:block after:mx-auto after:mt-10"
          >
            <p v-for="(val, i) in curInfo.question_title" :key="i">{{ val }}</p>
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
            :disabledContinue="onDisabledContinue"
            status="speak"
            :onended="onSpeakended"
          />
        </div>
        <div v-else-if="curInfo.order === 2 || curInfo.order === 3" class="px-32 -mt-56">
          <template v-if="curInfo.step === 1">
            <h2 class="text-[#21272A] pb-10">
              <p v-for="(val, i) in curInfo.question_title" :key="i">{{ val }}</p>
            </h2>
            <div class="text-[#475467] text-xl pb-10">
              <p v-for="(val, i) in curInfo.question_content" :key="i">{{ val }}</p>
            </div>
            <BTimerCircle
              :time="45"
              title="Reading time"
              class="absolute right-16 bottom-16"
              :ended="
                () => {
                  speakingInfo[step].step++
                  changeQueryQuestion()
                }
              "
            />
          </template>
          <template v-else-if="curInfo.step === 2">
            <BAudio
              title="Please listen carefully."
              :url="curInfo.voice_link!"
              :ended="
                () => {
                  speakingInfo[step].step++
                  changeQueryQuestion()
                }
              "
              img="2"
            />
          </template>
          <template v-else-if="curInfo.step > 2">
            <div
              class="text-[#475467] text-xl pb-10 after:content-[''] after:w-[50%] after:h-[1px] after:bg-[#D0D5DD] after:block after:mx-auto after:mt-10"
            >
              <p v-for="(val, i) in curInfo.question_title" :key="i">{{ val }}</p>
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
              :disabledContinue="onDisabledContinue"
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
              :ended="
                () => {
                  speakingInfo[step].step++
                  changeQueryQuestion()
                }
              "
            />
          </template>
          <template v-else-if="curInfo.step > 1">
            <div
              class="text-[#475467] text-xl pb-10 after:content-[''] after:w-[50%] after:h-[1px] after:bg-[#D0D5DD] after:block after:mx-auto after:mt-10"
            >
              <p v-for="(val, i) in curInfo.question_title" :key="i">{{ val }}</p>
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
              :disabledContinue="onDisabledContinue"
              :onended="onSpeakended"
            />
          </template>
        </div>
      </div>
    </template>
  </a-layout>
</template>
<script setup lang="ts">
import BGuide from '@/components/BaseGuide/index.vue'
import BTimerCircle from '@/components/BaseTimerCircle/index.vue'
import { request_computed_single_score, request_saveAnswer } from '@/service/exam'
import '@/service/file'
import { uploadFileToOBS } from '@/service/file'
import { useExamStore } from '@/stores/exam'
import { blobToFile } from '@/utils/recorder'
import HeaderBtn from '@/views/ReadExam/components/HeaderBtn.vue'
import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import TimerBlock from './components/timeBlock.vue'

import BAudio from '@/components/BaseAudio/index.vue'
import { useIndexStore } from '@/stores/index'
import { useRoute, useRouter } from 'vue-router'
const $router = useRouter()
const { query } = useRoute()
const loading = ref(true)
const examStore = useExamStore()
const indexStore = useIndexStore()
const step = ref()
const isend = ref(false)
const HeaderBtnsConfig = reactive<{
  [k in string]: HeaderBtnProps
}>({
  horn: {
    title: 'horn',
    id: 'horn',
    disabled: true,
    isShow: false
  },
  continue: {
    title: 'CONTINUE',
    id: 'continue',
    disabled: false,
    isShow: true,
    onClick: () => {
      if (step.value === 0) {
        step.value = 1
      } else {
        // console.log(curInfo.value.order, curInfo.value.step)
        // if (curInfo.value.order === 1 && curInfo.value.step === 2) {
        //   onPrepareended()
        // } else if (
        //   (curInfo.value.order === 1 && curInfo.value.step === 3) ||
        //   (curInfo.value.order === 2 && curInfo.value.step === 4) ||
        //   (curInfo.value.order === 3 && curInfo.value.step === 4)
        // ) {
        //   onSpeakended()
        // } else {
        curInfo.value.step++
        // }
      }
      changeQueryQuestion()
    }
  }
})
const onDisabledContinue = () => {
  HeaderBtnsConfig.continue.disabled = true
}
const speakingInfo = reactive<
  Array<{
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
  }>
>([
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
}
const saveSingleAnswer = async (link: string) => {
  await request_saveAnswer({
    question_id: curInfo.value?.question_id!,
    answer_voice_link: link,
    duration: 0,
    sheet_id: query.id as string
  })
  await request_computed_single_score(query.id as string, curInfo.value?.question_id!)
}
const onSpeakended = async (fileData) => {
  try {
    const BlobAudio: Blob = fileData
    const fileName = `${curInfo.value.question_id}-${indexStore?.userInfo?.mobile}_${Date.now()}_answer.wav`
    const FileAudio = blobToFile(BlobAudio, fileName)
    const { url } = await uploadFileToOBS(FileAudio)
    await saveSingleAnswer(url)
    HeaderBtnsConfig.continue.disabled = false
    if (step.value < speakingInfo.length - 1) {
      step.value++
      speakingInfo[step.value].step = 0
      changeQueryQuestion()
    }
    if (isend.value) {
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
  if (
    step.value === speakingInfo.length - 1 &&
    speakingInfo[step.value]?.step === speakingInfo[step.value]?.maxStep
  ) {
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
    if (v.order === 1) {
      v.maxStep = 3
      v.title = 'Speaking'
      v.guide = {
        type: 'info',
        title: 'Speaking',
        question: index,
        info_title: `Question ${v.order} Directions`,
        question_title: [
          `You will now give your opinion about a familiar topic. `,
          `After you hear the question, you will have 15 seconds to prepare and 45 seconds to speak.`
        ]
      }
    } else if (v.order === 2 || v.order === 3) {
      v.maxStep = 4
      v.title = 'Speaking'
      v.guide = {
        type: 'info',
        title: 'Listening',
        question: index,
        info_title: `Question ${v.order} Directions`,
        question_title: [
          `Now you will read a passage about a campus situation and then listen to a conversation about the same topic. You will then answer a question, using information from both the reading passage and the conversation. You will have 30 seconds to prepare and 60 seconds to speak.`
        ]
      }
    } else if (v.order === 4) {
      v.maxStep = 3
      v.title = 'Speaking'
      v.guide = {
        type: 'info',
        title: 'Listening',
        question: index,
        info_title: `Question ${v.order} Directions`,
        question_title: [
          `Now you will listen to a lecture. You will then be asked to summarize the lecture. You will have 20 seconds to prepare and 60 seconds to speak.`
        ]
      }
    }
    v.step = 0
    v.question_title = v.question_title?.split('\n')
    v.question_content = v.question_content?.split('\n')
  })
  speakingInfo.push(...examStore.examing_data.questions)
  speakingInfo[step.value].step = Number(query.questionStep) || 0
  loading.value = false
})
</script>
<style scoped></style>
