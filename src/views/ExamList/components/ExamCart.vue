<template>
  <div class="flex h-48 px-3 pb-5 w-1/2">
    <div class="flex bg-white exam-card w-full">
      <div
        class="left relative overflow-hidden h-full flex flex-col justify-around items-start pt-8 text-white text-center">
        <img class="absolute top-4 right-4" :src="examEdit" alt="examEdit" @click="toResult"/>
        <span class="text-[30px] pl-6">{{ props.resource_name }}</span>
        <div v-if="isShowBtn" class="flex justify-around items-center w-full">
          <a-button @click="onSelectQuestion('mock_exam')" class="flex justify-between items-center w-[98px] h-[32px] overflow-hidden">
            <img :src="time" alt="time" />
            模考
          </a-button>
          <a-button @click="onSelectQuestion('practice')" class="flex justify-between items-center w-[98px] h-[32px] overflow-hidden">
            <img :src="practice" alt="practice" />
            练习
          </a-button>
        </div>
        <template v-else>
          <span class="pl-6 pb-4 pt-2">请选择此次模考文章</span>
          <span class="pl-6 pb-6">{{ `${computedCheckboxId.length}/${2}` }}</span>
        </template>
      </div>
      <div v-if="isShowBtn" class="flex flex-col flex-1 justify-around overflow-hidden">
        <div v-for="v in props.section" :key="v.section_id"
          class="flex justify-around separator h-1/3 items-center">
          <span class="pl-2 text-gray-500">Passage{{ v.questions[0].order }}</span>
          <span class="flex flex-col justify-center text-xs" :style="{ color: showScore(v).color }">
            <span v-if="v.last_record">完成得分</span>
            {{ showScore(v).text }}
          </span>
          <img :src="edit" alt="edit" />
        </div>
      </div>
      <div v-else class="flex flex-col flex-1 overflow-hidden pt-3">
        <a-checkbox-group v-model:value="checkboxId" class="w-full pl-2 flex flex-col">
          <p v-for="v in props.section " :key="v.section_id" class="py-2">
            <a-checkbox class="radius" :value="v.questions[0].question_id">
              <span class="font-bold pl-2 text-gray-500">Passage{{ v.questions[0].order }}</span>
            </a-checkbox>
          </p>
        </a-checkbox-group>
        <div class="flex justify-end">
          <a-button class="mr-4 text-green-1 border-green-1" @click="backExam">
            取消
          </a-button>
          <a-button type="primary" class="mr-4" @click="startMockExam" :loading="startExamLoading">
            确定
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue"
import type {EXAN_START} from "@/service/exam"
import time from '@/assets/images/time.svg'
import practice from '@/assets/images/practice.svg'
import examEdit from '@/assets/images/exam-edit.svg'
import edit from '@/assets/images/edit.svg'
import { useExamStore } from '@/stores/exam'
import { useRouter } from "vue-router"
import { message } from "ant-design-vue"

const emits = defineEmits(["showExamModal"])
// 显示按钮
const isShowBtn = ref(true)
const props = defineProps<{
  resource_id: number
  resource_name: string
  section: Array<any>
}>()
const examStore = useExamStore()
const $router = useRouter()
const type = ref<EXAN_START['q_type']>('mock_exam')
// 存储选中的复选框的id值
const checkboxId = ref([])
const startExamLoading = ref<boolean>(false)


// 计算得分状态
const showScore = computed(() => {
  return (item: any) => {
    if (item.last_record) {
      return {
        color: '#F7A705',
        text: `${item.last_record} / ${item.question_count}`
      }
    } else if (item.xxx) {
      return {
        color: '#1B8B8C',
        text: '继续考试'
      }
    } else {
      return {
        color: 'rgba(107, 114, 128, 0.60)',
        text: '未完成'
      }
    }
  }
})

// 开始模拟考试
const onSelectQuestion = (v:EXAN_START['q_type']) => {
  isShowBtn.value = !isShowBtn.value
  type.value = v
}

// 跳转到开始考试
const startMockExam = async () => {
  if (checkboxId.value.length !== 0) {
    try {
      startExamLoading.value = true
      await examStore.startExam(type.value, checkboxId.value)
      $router.push({ name: 'mockExam', query: { id: examStore.examing_data.sheet_id } })
    } finally {
      startExamLoading.value = false
    }
    
  } else {
    message.info('请选择Passage')
  }
}
// 计算选中的checkboxId
const computedCheckboxId = computed(() => {
  if (checkboxId.value.length > 2) {
    checkboxId.value.shift()
  }
  return checkboxId.value
})
// 返回到考试
const backExam = () => {
  isShowBtn.value = !isShowBtn.value
  checkboxId.value = []
}

const toResult = () => {
  $router.push({ name: 'result' })
}
</script>
<style scoped>
.exam-card {
  border-radius: 8px;
  height: 184px;
  box-shadow: 0px 4px 20px 0px rgba(27, 139, 140, 0.20);
}

.left {
  width: 259px;
  border-radius: 8px;
  background: linear-gradient(219deg, #B2DAC8 -0.38%, #18898E 77.62%);
  stroke-width: 1px;
  stroke: var(--color-gray-200);
  filter: drop-shadow(0px 20px 24px rgba(16, 24, 40, 0.08));
}

.separator {
  position: relative;
}

.separator::after {
  position: absolute;
  bottom: 0;
  top: 60px;
  right: 10px;
  left: 10px;
  height: 1px;
  content: "";
  transform: scaleY(.9);
  background-color: #D0D5DD;
}

.separator:last-child:after {
  height: 0;
}
</style>
