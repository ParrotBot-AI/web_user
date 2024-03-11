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
     <span v-show="curInfo.question">
        Question {{ curInfo.question }} of 2
      </span>
     <Timer />
   </div>
   <div class="flex flex-1 justify-center items-center overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
     <div class="px-32 -mt-40" v-if="curInfo.type === 'info'">
       <h2 class="text-[#21272A] pb-10">
         {{ curInfo.info_title}}
       </h2>
       <div class="text-[#475467] text-xl pb-10"> 
         <p v-for="(val,i) in curInfo.question_title" :key="i">{{ curInfo.question_title[i] }}</p>
       </div>
       <div class="text-[#475467]">
         (Select <a-button type="primary" class="mx-2" @click="onclickContinue">CONTINUE <img :src="right" class="pl-2" /></a-button> at any time to dismiss these directions.)
       </div>
     </div>
     <div v-else-if="curInfo.order === 1" >
        <div  :style="{ borderBottom: `1px solid #D0D5DD` } "></div>
        <div class="flex text-[#475467] text-xl pb-10">
          <div class="flex flex-1  ml-[30px] pr-[20px]" v-for="(val,i) in curInfo.qusetion_content" :style="{ borderRight: `1px solid #D0D5DD` }" :key="i">{{ val }}</div>
          <div class="flex flex-1 justify-end items-end" v-for="(val,i) in curInfo.qusetion_content" :key="i"><img :src="YelloBird" class="flex w-[70px] mr-12" /></div>
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
import YelloBird from '@/assets/images/yellobird.svg'
import { useExamStore } from '@/stores/exam'
import { useRoute } from "vue-router"
const step = ref(0)
const examStore = useExamStore()
const { query } = useRoute()
const speakingInfo = reactive([
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
])
const curInfo = computed(() => {
 return speakingInfo[step.value]
})
const onclickContinue = async () => {
    step.value++
  
}
onMounted(async () => {
  await examStore.getExamData(query.id as string)
  examStore.examing_data.questions.reduce((def, value) => {
    if(value.order === 1) {
      def.push({
        type: 'info',
        title: 'Writing',
        info_title: 'Writing Based on Reading and Listening',
        question_title: [
            `For this task, you will have 3 minutes to read a passage about an academic topic. `,
            `Then you will listen to a lecture about the same topic.`,
            `You wil have 20 minutes to write. In your response, provide a detailed summary of the lecture and explain howthe lecture relates to the reading passage. `,
            `While you write, you will be able to see the reading passage.`,
            `In Untimed Mode in this practice test, you may listen to the lecture again by selecting Replay Talk. Thisjunction is not available in the actual test. `,
            `Note that returning to the lecture could result in a section scorenigher than the score you would receive if encountering the lecture only one time.`,
            `If you finish your response before time is up, you may select to go on to the second writing task. Now you will see the reading passage. it will be followed by a lecture.`,
          ]
      })
    } else if(value.order === 2 || value.order === 3) {
      def.push({
        type: 'info',
        title: 'Writing',
        question: value.order,
        info_title: `Question ${value.order} Directions`,
        question_title: [
            `Now you will read a passage about a campus situation and then listen to a conversation about the same topic. You will then answer a question, using information from both the reading passage and the conversation. You will have 30 seconds to prepare and 60 seconds to speak.`,
          ]
      })
    } else if(value.order === 4){
      def.push({
        type: 'info',
        title: 'Writing',
        question: value.order,
        info_title: `Question 4 Directions`,
        question_title: [
            `Now you will listen to a lecture. You will then be asked to summarize the lecture. You will have 20 seconds to prepare and 60 seconds to speak.`,
          ]
      })
    }
    def.push({
      ...value,
      title: 'Integrated Writing',
      question_status: 'init',
      question: value.order,
      question_content: value.question_content?.split(/\\n/),
      question_title: value.question_title?.split(/\\n/),
      qusetion_content: value.voice_content?.split(/\\n/)
    })
    return def
  }, speakingInfo)
  console.log(speakingInfo)
})

</script>
<style scoped>
 
</style>