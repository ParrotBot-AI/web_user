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
    <BaseGuide v-bind="hearingGuide" v-if="isShowGuide"/>
    <QuestionItem 
      v-else-if="examStore.examing_data.questions[examStore.examing_data.curQuestionIndex]" 
      v-bind="examStore.examing_data.questions[examStore.examing_data.curQuestionIndex]"
      :isPlay="true"
    />
  </a-layout>
</template>
<script setup lang="ts">
import type {HeaderBtnProps, KeyofIcons} from "@/views/ReadExam/components/HeaderBtn.vue"
import QuestionItem from "./components/QuestionItem.vue"
import HeaderBtn from "@/views/ReadExam/components/HeaderBtn.vue"
import { onMounted, ref, reactive, watchEffect } from 'vue'
import BaseGuide from '@/components/BaseGuide/index.vue'
import { useExamStore } from '@/stores/exam'
import { useRoute } from "vue-router"
const isShowGuide = ref(true)
const examStore = useExamStore()
const { query } = useRoute()

const hearingGuide = reactive({
  type: 'info',
  title: 'Listening',
  info_title: 'Listening Section Directions',
  is_show_footer: true,
  question_title: [
    `In this section, you will be able to demonstrate your ability to understand conversations and lectures in English. The section is divided into two separately timed parts. You will hear each conversation or lecture only one time.`,
    `A clock will indicate how much time remains. The clock will count down only while you are answering questions, not while you are listening. In some questions, you`,
    `will see this icon: <div class="listen-icon"></div> . This means that you will hear, but not see, part of the question.`,
    `You must answer each question. After you answer, select <button class="nextbtn">Next</button> . In the actual test, you cannot return to previous questions.`
  ]
})

const HeaderBtnsConfig = reactive<{
  [k in KeyofIcons]: HeaderBtnProps
}>({
  horn: {
    title: 'horn',
    id: 'horn',
    disabled: true,
    isShow: false,
  },
  progress: {
    title: '进度',
    id: 'progress',
    disabled: true,
    isShow: true,
    onClick: () => {
      examStore.setShowProcessDialog()
    }
  },
  help: {
    title: '帮助',
    id: 'help',
    disabled: false,
    isShow: true,
    onClick: () => {
      console.log('help')
    }
  },
  prev: {
    title: '上一步',
    disabled: true,
    id: 'prev',
    isShow: true,
    onClick: () => {
      examStore.changeQuestion(-1)
    }
  },
  continue: {
    title: '跳过',
    id: 'continue',
    disabled: false,
    isShow: true,
    onClick: () => {
      isShowGuide.value = false
    }
  },
  next: {
    title: '下一步',
    id: 'next',
    disabled: true,
    isShow: true,
    onClick: () => {
      examStore.changeQuestion(1)
    }
  },
  submit: {
    title: '提交',
    id: 'submit',
    disabled: true,
    isShow: false,
    onClick: () => {
      examStore.requestSubmitExam(query.id as string)
    }
  },
})


onMounted(async () => {
  await examStore.getExamData(query.id as string)
})
</script>
<style scoped>
  
</style>