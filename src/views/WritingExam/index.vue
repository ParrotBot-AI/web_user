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
          <a-button type="primary" class="mx-2 flex items-center justify-center"><img :src="help" class="pr-2" />HELP</a-button>
          <a-button type="primary" class="mx-2 flex items-center justify-center" @click="onclickContinue" >CONTINUE <img :src="right" class="pl-2" /></a-button>
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
    <div class="flex flex-1 justify-center items-center overflow-hidden bg-white h-100%" :style="{ borderTop: `1px solid #D0D5DD` }">
      <div class="px-32 -mt-40" v-if="curInfo.type === 'info'">
        <h2 class="text-[#21272A] pb-10"  v-show="curInfo.info_title">
          {{ curInfo.info_title}}
        </h2>
        <div class="text-[#475467] text-xl pb-10"> 
          <p v-for="(val,i) in curInfo.question_title" :key="i" v-html="val"></p>
        </div>
        <div class="text-[#475467]">
          (Select <a-button type="primary" class="mx-2" >CONTINUE <img :src="right" class="pl-2" /></a-button> at any time to dismiss these directions.)
        </div>
      </div>
      <div v-else-if="curInfo.order === 1"  >
        <template class="" v-if="curInfo.question_status === 'init'">
          <div :style="{ borderTop: `1px solid #D0D5DD` } "></div>
          <div class="flex  text-[#475467] text-xl pb-10">
            <div class="flex-1 h-full  ml-[30px] pr-[20px]" v-for="(val,i) in curInfo.question_content" :key="i">{{ val }}</div>
            <div class="flex flex-1 justify-end items-end" :style="{ borderLeft: `1px solid #D0D5DD`}" ><img :src="YelloBird" class="w-[70px] mr-12" /></div>
          </div>
        </template>
        <template v-else-if="curInfo.question_status === 'listening'">
          <BAudio 
              title="Please listen carefully." 
              :url="curInfo.voice_link!" 
              img="1"
            />
        </template>
        <template v-else-if="curInfo.question_status === 'writing'">
          <div class="flex flex-col justify-start items-start h-full">
            <div :style="{ borderBottom: `1px solid #D0D5DD` } ">
              <div class="bg-gray-400 " >{{ writingInfo[1].direction }}</div>
              <div >{{ writingInfo[1].question_read }}</div>
            </div>
            <div class="flex text-[#475467] text-xl pb-10">
              <div class=" flex-1 justify-center items-center ml-[30px] pr-[20px]" v-for="(val,i) in curInfo.question_content" :style="{ borderRight: `1px solid #D0D5DD` }" :key="i">{{ val }}</div>
              <div class="flex flex-col flex-1 " >
                <div class="w-full flex flex-1">
                  <WtitingBtn             
                  v-for="val in Object.keys(WritingBtnsConfig)" 
                  v-bind="WritingBtnsConfig[val]" 
                  :key="val" />
                </div>
                <div class="flex  justify-end items-end">
                  <img :src="YelloBird" class="flex w-[70px] mr-12" /></div>
                </div>
            </div>  
          </div>
        </template>
      </div>
      
      <!-- 第二篇阅读 -->
      <div v-else-if="curInfo.order === 1"  >
        <template class="" v-if="curInfo.question_status === 'init'">
          <div class="flex text-[#475467] text-xl pb-10">
            <div class="flex flex-1 flex-col items-center justify-center" >
              <div class="ml-[30px] pr-[20px]" v-for="(val,i) in curInfo.question_title" :key="i">
                {{ val }}
              </div>
              <img :src="Man" class="w-[100px] mr-12" />
              <div class="text-[#000000] font-bold">Doctor Achebe</div> 
              <div class="ml-[30px] pr-[20px]">Next, we'll be discussing the future of higher education,focusing on proposals for making postsecondaryeducation (education after high school) more efhcientand more accessible. One such proposal is to makeclass attendance</div>
            </div>
            <div class="flex flex-1 w-full flex-1 flex-col" :style="{ borderLeft: `1px solid #D0D5DD`}" >
              <div class="flex ">
                <img :src="Man" class="w-[70px] mr-12" />
                <span>I like the idea of optional attendance. University students have a lot going on, and sometimesit's difhcult to make it to class.
                      As long as students are held accountable for the information they're supposed to learn, l don'tsee why they should have to attend every class session, especially for classes that meetmultiple times a week.</span>
              </div>
              <div class="flex ">
                <img :src="Man" class="w-[70px] mr-12" />
                <span>I like the idea of optional attendance. University students have a lot going on, and sometimesit's difhcult to make it to class.
                      As long as students are held accountable for the information they're supposed to learn, l don'tsee why they should have to attend every class session, especially for classes that meetmultiple times a week.</span>
              </div>
              <WtitingBtn             
                  v-for="val in Object.keys(WritingBtnsConfig)" 
                  v-bind="WritingBtnsConfig[val]" 
                  :key="val" />
              <img :src="YelloBird" class="w-[70px] mr-12" />
            </div>
          </div>
        </template>
      </div>
    </div>
 </a-layout>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue'

import Timer from "@/views/ReadExam/components/Timer.vue"
import BAudio from "@/components/BaseAudio/index.vue"
import BaseGuide from '@/components/BaseGuide/index.vue'
import HeaderBtn from "@/views/ReadExam/components/HeaderBtn.vue"
import WtitingBtn from "./components/WtitingBtn.vue"
import type {WritingBtnProps} from "./components/WtitingBtn.vue"
import type {HeaderBtnProps} from "@/views/ReadExam/components/HeaderBtn.vue"
import right from '@/assets/images/right.svg'
import help from '@/assets/images/help.svg'
import YelloBird from '@/assets/images/yellobird.svg'
import Man from '@/assets/images/man.svg'
import { useExamStore } from '@/stores/exam'
import { useRoute } from "vue-router"
const step = ref(0)
const examStore = useExamStore()
const { query } = useRoute()
const writingInfo = reactive<Array<{
  type?: 'info'
  title?: string
  question?: number
  info_title?: string
  question_title?: Array<string>
  question_content?: Array<string>
  order?: number
  question_status?: 'init' | 'prepare' | 'listening' | 'writing' | 'end'
  question_id?: number
  keywords?: {
    p: number
    r: number
  }
  voice_link?: string | null
  voice_content?: string | null
  direction?: string | null
  question_read?: string | null
}>>([
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
 return writingInfo[step.value]
})
const onclickContinue = async () => {
  if(curInfo.value.order === 1){
    if(curInfo.value.question_status === 'init'){
      writingInfo[step.value].question_status = 'listening'
    }else if (writingInfo[step.value].question_status === 'listening'){
      curInfo.value.question_status = 'writing'
    }else if (writingInfo[step.value].question_status === 'writing'){
      step.value++
    }
  }
    else{
    step.value++
  }
  console.log(curInfo.value.question_status)
  console.log(step.value)
  
}
const HeaderBtnsConfig = reactive<{
  [k in string]: HeaderBtnProps
}>({
  horn: {
    title: 'horn',
    id: 'horn',
    disabled: true,
    isShow: true,
  },
})
const WritingBtnsConfig = reactive<{
  [k in string]: WritingBtnProps
}>({
  cut: {
    bt_name: ['Cut', 'Paste', 'Undo', 'Redo' ],
    word_number: 0,
  },
})

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
            `Note that returning to the lecture could result  in a section scorenigher than the score you would receive if encountering the lecture only one time.`,
            `If you finish your response before time is up, you may select <button class="nextbtn">Next</button> to go on to the second writing task. Now you will see the reading passage. it will be followed by a lecture.`,
          ],
        direction: 'Directions: You have 20 minutes to plan and write your response. Yourespanse wil be judged on the basis of the qualty of your writing and on how wellyouresponse presents the points in the lecture and their relationship to the reading passage. Typically, an effective response wilbe 150 to 225 words.' ,
        question_read: 'Question: Summarize the points made in the lecture, being sure to explain how they cast doubt on the speciic points made in the reading passage'
      })
    } else if(value.order === 2 ) {
      def.push({
        type: 'info',
        title: 'Writing',
        question: value.order,
        info_title: `Writing for an Academic Discussion`,
        question_title: [
            `For this task, you will read an online discussion. A professor has posted a question about a topic, and someclassmates have responded with their ideas.
            You will write a response that contributes to the discussion. in the actual test and in Timed Mode in thispractice test, you will have 10 minutes to write your response.
            If you finish your response before time is up, you may select <button class="nextbtn">Next</button> to end this section.`,
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
      // voice_content: voice_content
    })
    return def
  }, writingInfo)
  console.log(examStore.examing_data.questions)
})

</script>
<style scoped>

.word{
  justify-content: flex-start;
  align-items: flex-start;
}
 
</style>