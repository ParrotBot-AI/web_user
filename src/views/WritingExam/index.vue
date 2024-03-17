<template>
  <a-layout class="w-full h-full flex flex-col">
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
    <div class="flex flex-1 bg-white flex-col" :style="{ borderTop: `1px solid #D0D5DD` }">
      <BGuide 
        v-if="curInfo?.type === 'info'"
        :title="curInfo.title!"
        :info_title="curInfo.info_title"
        :question_title="curInfo.question_title"
        :is_show_footer="true"
      />
      <BGuide 
        v-else-if="curInfo?.type === 'question' && curInfo?.step === 0"
        :title="curInfo.guide?.title!"
        :info_title="curInfo.guide?.info_title"
        :question_title="curInfo.guide?.question_title"
        :is_show_footer="true"
      />
      <div v-else-if="curInfo?.type === 'question' && curInfo?.step > 0" class="flex flex-col flex-1">
        <div 
          class="text-center h-14 flex items-center justify-between bg-white px-8" 
          :style="{ borderBottom: `1px solid #D0D5DD` } "
        >
          <h2 class="text-gray-900 text[20px] font-bold">{{curInfo.title}}</h2>
          <span>
              Question {{ step }} of {{ questions.length - 1}}
            </span>
          <Timer />
        </div>
        <template v-if="curInfo?.keywords?.r === 1200">
          <template v-if="curInfo.step === 1">
            <div class="h-[100px]"></div>
            <div class="flex flex-1" :style="{borderTop: '1px solid #D0D5DD'}">
              <div class="w-1/2 text-base h-full overflow-y-auto px-10 pt-10" :style="{borderRight: '1px solid #D0D5DD'}">
                <p class="text-[#475467] text-base" v-for="(val,i) in curInfo.question_content" :key="i">{{ val }}</p>
              </div>
            </div>
          </template>
          <template v-if="curInfo.step === 2">
            <BAudio 
              title="Please listen carefully."
              :url="curInfo.voice_link!"
              img="1"
              class="mt-20"
            />
          </template>
          <template v-if="curInfo.step === 3">
            <div class="h-[100px]">
              <div class="text-base">
                <p class="bg-[#F6F6F6] px-10 py-2">
                  <b>Directions:</b>
                  You have 20 minutes to plan and write your response. Your response will be judged on the basis of the quality of your writing and on how well your response presents the points in the lecture and their relationship to the reading passage. Typically, an effective response will be 150 to 225 words.
                </p>
                <p class="px-10 py-1">
                  <b>Question: </b>Summarize the points made in the lecture, being sure to explain how they cast doubt on the specific points made in the reading passage.
                </p>
              </div>
            </div>
            <div class="flex flex-1" :style="{borderTop: '1px solid #D0D5DD'}">
              <div class="w-1/2 text-base h-full overflow-y-auto px-10 pt-10" :style="{borderRight: '1px solid #D0D5DD'}">
                <p class="text-[#475467] text-base" v-for="(val,i) in curInfo.question_content" :key="i">{{ val }}</p>
              </div>
              <div class="w-1/2 flex flex-col overflow-hidden">
                <WtitingBtn             
                  v-for="val in Object.keys(WritingBtnsConfig)" 
                  v-bind="WritingBtnsConfig[val]" 
                  :key="val" />
              </div>
            </div>
          </template>
        </template>
        <template v-if="curInfo.keywords?.r === 600">
          <div class="flex text-xl flex-1">
            <div class="flex flex-1 flex-col py-10">
              <div class="ml-[30px] pr-[20px] text-[#475467] pb-2 text-base" v-for="(val,i) in curInfo.question_title" :key="i">
                {{ val }}
              </div>
              <Avatar 
                :src="Man"
                class="mt-10"
                :name="'Doctor Achebe'"
                :size="100"
              />
            </div>
            <div class="flex flex-1 flex-col pb-4" :style="{ borderLeft: `1px solid #D0D5DD`}" >
              <div v-for="(val,i) in curInfo.question_content" :key="i" class="text-[#475467] text-base flex mb-4 items-start">
                <Avatar 
                  :src="Man"
                  class="mx-10"
                  :name="val.name"
                  :size="80"
                /><div><p v-for="(v,i) in val.content" :key="i">{{ v }}</p></div>
              </div>
              <WtitingBtn             
                v-for="val in Object.keys(WritingBtnsConfig)" 
                v-bind="WritingBtnsConfig[val]" 
                :key="val" 
              />
            </div>
          </div>
        </template>
      </div>
    </div>
 </a-layout>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, reactive, watchEffect, watch } from 'vue'
import Timer from "@/views/ReadExam/components/Timer.vue"
import BAudio from "@/components/BaseAudio/index.vue"
import HeaderBtn from "@/views/ReadExam/components/HeaderBtn.vue"
import BGuide from "@/components/BaseGuide/index.vue"
import WtitingBtn from "./components/WtitingBtn.vue"
import type {WritingBtnProps} from "./components/WtitingBtn.vue"
import type {HeaderBtnProps} from "@/views/ReadExam/components/HeaderBtn.vue"
import Avatar from "./components/Avatar.vue"
import Man from '@/assets/images/man.svg'
import { useExamStore } from '@/stores/exam'
import { useRoute, useRouter } from "vue-router"
const examStore = useExamStore()
const $router = useRouter()
const { query } = useRoute()
const step = ref(query.step ? Number(query.step) : 0)
const questions = reactive<Array<{
    type?: 'info'
    title?: string
    question?: number
    info_title: string
    question_title: Array<string>
 }>>(
    [
      {
        type: 'info',
        title: 'Writing',
        info_title: 'Writing Section Directions',
        question_title: [
          `In this section, you will be able to demonstrate your ability to use writing to communicate in anacademic environment. `,
          `There will be two writing tasks.`,
          `Now listen to the directions for the frst writing task.`
        ]
      }
    ]
  )
const curInfo = computed(() => {
  return questions[step.value] 
})

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
      if(step.value === 0) { // 0 1 2
        step.value = 1
      } else {
        questions[step.value].step++
      }
      changeQueryQuestion()
    }
  },
  next: {
    title: '下一步',
    id: 'next',
    disabled: false,
    isShow: false,
    onClick: () => {
      const cur = questions[step.value]
      if(step.value > 0) { // 0 1 2
        if(questions[step.value].step < cur.maxStep){
          questions[step.value].step++
        } else {
          if(step.value < questions.length - 1) {
            step.value++
            cur.step = 0
          }
        }
      } 
      changeQueryQuestion()
    }
  },
})


watchEffect(() => {
  if(curInfo.value?.type === 'info') {
    HeaderBtnsConfig.horn.isShow = false
  }
  if(curInfo.value?.step > 0) {
    HeaderBtnsConfig.continue.isShow = false
    HeaderBtnsConfig.next.isShow = true
  }
})

const WritingBtnsConfig = reactive<{
  [k in string]: WritingBtnProps
}>({
  cut: {
    bt_name: ['Copy', 'Cut', 'Paste'],
    word_number: 0,
  },
})

const changeQueryQuestion = () => {
  $router.push({
    query: {
      ...query,
      step: step.value,
      questionStep: questions[step.value].step
    }
  })
}
onMounted(async () => {
  await examStore.getExamData(query.id as string)
  examStore.examing_data.questions.map(val => {
    if(val.keywords.r === 1200) {
      val.type = 'question'
      val.step = 0
      val.maxStep = 3
      val.title = 'Integrated wirting'
      val.question_content = val.question_content.split(/\n/g)
      val.question_title = val.question_title.split(/\n/g)
      val.guide = {
        type: 'info',
        title: 'Writing',
        info_title: 'Writing Based on Reading and Listening',
        question_title: [
          `For this task, you will have 3 minutes to read a passage about an academic topic. `,
          `Then you will listen to a lecture about the same topic.`,
          `You will have 20 minutes to write. In your response, provide a detailed summary of the lecture and explain how the lecture relates to the reading passage. While you write, you will be able to see the reading passage.`,
          `In <b>Untimed Mode</b> in this practice test, you may listen to the lecture again by selecting <b>Replay Talk</b>. This function is not available in the actual test. Note that returning to the lecture could result in a section score higher than the score you would receive if encountering the lecture only one time.`,
          `If you finish your response before time is up, you may select <button class="nextbtn">next</button>to go on to the second writing task.`,
          `Now you will see the reading passage. It will be followed by a lecture.`
        ]
      }
    } else if (val.keywords.r === 600) {
      const name_reg = /\n?[a-zA-z\s]+:/g
      const names = val.question_content.match(name_reg)
      console.log(names)
      val.type = 'question'
      val.step = 0
      val.maxStep = 1
      val.title = 'Academic discussion'
      val.question_content = val.question_content.split(name_reg).slice(1).map((val:string, i:number) => ({
        name: names[i].replace(/:/g, '').replace(/\n/g, ''),
        content: val.split(/\n/g)
      }))
      val.question_title = val.question_title.split(/\n/g)
      val.guide = {
        type: 'info',
        title: 'Writing',
        question: 2,
        info_title: `Writing for an Academic Discussion`,
        question_title: [
          `For this task, you will read an online discussion. A professor has posted a question about a topic, and someclassmates have responded with their ideas.
          You will write a response that contributes to the discussion. in the actual test and in Timed Mode in thispractice test, you will have 10 minutes to write your response.
          If you finish your response before time is up, you may select <button class="nextbtn">Next</button> to end this section.`,
        ]
      }
    }
  })
  questions.push(...examStore.examing_data.questions)
  questions[step.value].step = Number(query.questionStep) || 0
  console.log(questions)
  changeQueryQuestion()
})

</script>
<style scoped>

.word{
  justify-content: flex-start;
  align-items: flex-start;
}
 
</style>