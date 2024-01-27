<template>
  <div class="flex h-48 px-3 pb-5 w-1/2">
    <div class="flex bg-white exam-card w-full">
      <div class="left overflow-hidden h-full relative">
        <p class="text-white text-[30px] text-center pt-14">Official 1</p>
        <div class="absolute bottom-6 w-full px-2 flex">
          <a-button @click="onClickExam(props.resource_id)" class="flex justify-between items-center  w-1/2 mx-2">
            <img :src="Time" alt="time" class="w-5 h-5 align-middle" />
            模考
          </a-button>
          <a-button @click="onClickPractice(props.resource_id)" class="flex justify-between items-center w-1/2 mx-2">
            <img :src="Practice" alt="practice" class="w-5 h-5 align-middle" />
            练习
          </a-button>
        </div>
      </div>
      <div class="flex-1 overflow-hidden pl-2">
        <div class="flex w-full border-b h-1/3 justify-center items-center" v-for="v in sections[0].questions"
          :key="v.question_id">
          <p class="w-1/2">{{ v.remark }}</p>
          <div class="flex justify-center items-center w-1/2">
            <div class="w-1/2">
              <div class="flex flex-col items-center text-[#F7A705]" v-if="v.last_record === 10">
                <span>完成得分</span>
                <span>{{ `${v.last_record}/${v.question_count}` }}</span>
              </div>
              <div v-else>
                <span class="text-[#6b728099]">未完成</span>
              </div>
            </div>
            <img :src="Practice" alt="practice" class="w-1/2 h-5 align-middle" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from "vue"
import Practice from '@/assets/images/practice.svg'
import Time from '@/assets/images/time.svg'
const emits = defineEmits(["showExamModal"])
const props = defineProps<{
  resource_id: number
  sections: Array<{ questions: [] }>
}>()
const onClickExam = (id) => {
  emits("showExamModal", id)
}
const onClickPractice = (id) => {
  console.log('练习', id)
}
</script>
<style scoped>
.exam-card {
  border-radius: 8px;
  box-shadow: 0px 4px 20px 0px rgba(27, 139, 140, 0.20);
}

.left {
  width: 256px;
  border-radius: 8px;
  background: linear-gradient(219deg, #B2DAC8 -0.38%, #18898E 77.62%);
  stroke-width: 1px;
  stroke: var(--color-gray-200);
  filter: drop-shadow(0px 20px 24px rgba(16, 24, 40, 0.08));
}
</style>
