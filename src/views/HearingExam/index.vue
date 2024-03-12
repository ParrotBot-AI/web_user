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
    <BaseGuide v-bind="hearingGuide" />
  </a-layout>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue'
import BaseGuide from '@/components/BaseGuide/index.vue'
import { useExamStore } from '@/stores/exam'
import { useRoute } from "vue-router"
import right from '@/assets/images/right.svg'
import help from '@/assets/images/help.svg'

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


const onclickContinue = () => {

}
onMounted(async () => {
  await examStore.getExamData(query.id as string)
})
</script>
<style scoped>
  
</style>