<template>
  <a-spin v-if="loading" size="large" tip="试题加载中..." class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"/>
  <template v-else>
    <a-layout class="w-full h-full flex flex-col">
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
      <BaseGuide v-bind="hearingGuide" v-if="isShowGuide"/>
      <QuestionItem 
        v-else-if="questionItem" 
        v-bind="questionItem"
        :onAuidoEnded="onAuidoEnded"
        title="Listening"
      />
    </a-layout>
  </template>
</template>
<script setup lang="ts">
import type {HeaderBtnProps, KeyofIcons} from "@/views/ReadExam/components/HeaderBtn.vue"
import QuestionItem from "./components/QuestionItem.vue"
import HeaderBtn from "@/views/ReadExam/components/HeaderBtn.vue"
import { onMounted, ref, reactive, computed, watchEffect } from 'vue'
import BaseGuide from '@/components/BaseGuide/index.vue'
import { useExamStore } from '@/stores/exam'
import { useRoute } from "vue-router"
const isShowGuide = ref(true)
const examStore = useExamStore()
const { query } = useRoute()
const loading = ref(true)

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
    isShow: false,
    onClick: () => {
      examStore.setShowProcessDialog()
    }
  },
  help: {
    title: '帮助',
    id: 'help',
    disabled: false,
    isShow: false,
    onClick: () => {
      console.log('help')
    }
  },
  prev: {
    title: '上一步',
    disabled: false,
    id: 'prev',
    isShow: false,
    onClick: () => {
      examStore.changeQuestion(-1)
      const curQuestionItem = examStore.examing_data.questions[examStore.examing_data.curQuestionIndex]
      if(curQuestionItem.step === 0) {
        examStore.examing_data.curQuestionIndex > 0 && examStore.examing_data.curQuestionIndex--
      } else {
        curQuestionItem.step -= 1
      }
    }
  },
  continue: {
    title: '跳过',
    id: 'continue',
    disabled: false,
    isShow: true,
    onClick: () => {
      if(isShowGuide.value) {
        isShowGuide.value = false
      } else {
        onAuidoEnded()
      }
    }
  },
  next: {
    title: '下一步',
    id: 'next',
    disabled: false,
    isShow: false,
    onClick: () => {
      examStore.changeQuestion(1)
      const curQuestionItem = examStore.examing_data.questions[examStore.examing_data.curQuestionIndex]
      if(!questionItem.value.played) {
        curQuestionItem.step = -1
      } else {
        curQuestionItem.step += 1
      }
    }
  },
  submit: {
    title: '提交',
    id: 'submit',
    disabled: false,
    isShow: false,
    onClick: () => {
      examStore.requestSubmitExam(query.id as string)
    }
  },
})
const onAuidoEnded = () => {
  const curquestion = examStore.examing_data.questions[examStore.examing_data.curQuestionIndex]
  curquestion.played = true
  curquestion.step = 0
}
const questionItem = computed(() => {
  return examStore.examing_data.questions[examStore.examing_data.curQuestionIndex]
})
watchEffect(() => {
  if(!isShowGuide.value) {
    HeaderBtnsConfig.horn.isShow = true
  }
  if(questionItem.value?.step >= 0){
    HeaderBtnsConfig.next.isShow = true
    HeaderBtnsConfig.prev.isShow = true
    HeaderBtnsConfig.continue.isShow = false
    HeaderBtnsConfig.help.isShow = true
  } else {
    HeaderBtnsConfig.next.isShow = false
    HeaderBtnsConfig.prev.isShow = false
    HeaderBtnsConfig.continue.isShow = true
    HeaderBtnsConfig.help.isShow = false
  }
  if(examStore.examing_data.curIndex === examStore.examing_data.childrenLength - 1) {
    HeaderBtnsConfig.submit.isShow = true
    HeaderBtnsConfig.next.isShow = false
  }
})
onMounted(async () => {
  await examStore.getExamData(query.id as string, 'hearing')
  if(query.sectionIndex && query.quesIndex) {
    isShowGuide.value = false
  }
  examStore.examing_data.questions.map(val => {
    val.played = false
    val.step = -1
  })
  loading.value = false
})
</script>
<style scoped>
  
</style>