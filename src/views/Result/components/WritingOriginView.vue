<template>
  <div class="w-full h-full overflow-hidden fixed top-0 left-0 z-30 flex flex-col bg-white">
    <b-header :title="props.data?.name" :onClickBack="props.onBack">
      <template #right>
        <div class="flex">
          <a-button 
            type="primary" 
            class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center"
            @click="props.onExit"
          >
            <span><AuditOutlined class="mr-1.5"/>{{ $t('查看批注')}}</span>
          </a-button>
        </div>
      </template>
    </b-header>
    <BQuesTitle 
      :title="props.data?.name" 
      :index="props.data?.curIndex" 
      :length="props.data?.length"
    > 
    </BQuesTitle>
    <template v-if="props.data?.name === 'Integrated Writing'">
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
      <div class="flex flex-1 overflow-hidden" :style="{borderTop: '1px solid #D0D5DD'}">
        <div class="w-1/2 text-base h-full overflow-y-auto px-10 pt-10" :style="{borderRight: '1px solid #D0D5DD'}">
          <p class="text-[#475467] text-base pb-4 indent-8" v-for="(val,i) in props.data?.question?.question_content?.split('\n')" :key="i">{{ val }}</p>
        </div>
        <div class="w-1/2 flex flex-col overflow-hidden">
          <BAudio 
            title="Please listen carefully."
            :url="props.data?.question?.voice_link"
            img="1"
            class="mt-20"
            :ended="() => {}"
          />
        </div>
      </div>
    </template>
    <template v-if="props.data?.name === 'Academic discussion'">
      <div class="flex text-base flex-1">
        <div class="flex w-1/2 flex-col py-10 px-10 text-[#475467]">
          <div v-for="(val,i) in props.data?.question?.question_title?.split('\n')" :key="i">
            {{ val }}
          </div>
          <Avatar 
            :src="Man"
            class="my-10"
            :name="questionContent[0]?.name"
            :size="80"
          />
          <div>
            <p v-for="(v,i) in questionContent[0]?.content" :key="i">{{ v }}</p>
          </div>
        </div>
        <div class="flex w-1/2 flex-col py-4" :style="{ borderLeft: `1px solid #D0D5DD`}" >
          <div v-for="(val,i) in questionContent?.slice(1)" :key="i" class="text-[#475467] text-base flex mb-4 items-start">
            <Avatar 
              :src="i == 0 ? Man1 : Man2"
              class="mx-10"
              :name="val.name"
              :size="80"
            /><div><p v-for="(v,i) in val.content" :key="i">{{ v }}</p></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import Man1 from '@/assets/images/man-1.jpg'
import Man2 from '@/assets/images/man-2.jpg'
import Man from '@/assets/images/man.jpg'
import BAudio from "@/components/BaseAudio/index.vue"
import Avatar from "@/views/WritingExam/components/Avatar.vue"
import { AuditOutlined } from '@ant-design/icons-vue'
import { computed, defineProps } from "vue"
const props = defineProps<{
  data: any[]
  onBack: () => void
  onExit: () => void
}>()
console.log(props.data)
const questionContent = computed(() => {
  const name_reg = /\n?[a-zA-z\s]+:/g
  const names = props.data?.question?.question_content?.match(name_reg)
  return props.data?.question?.question_content?.split(name_reg).slice(1).map((val:string, i:number) => ({
        name: names[i].replace(/:/g, '').replace(/\n/g, ''),
        content: val.split(/\n/g)
    }))
})
</script>
<style scoped>
  
</style>