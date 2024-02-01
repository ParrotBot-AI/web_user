<template>
  <div class="flex h-48 px-3 pb-5 w-1/2">
    <div class="flex bg-white exam-card w-full">
      <div
        class="left relative overflow-hidden h-full flex flex-col justify-around items-start pt-8 text-white text-center">
        <img class="absolute top-4 right-4" :src="examEdit" alt="examEdit" />
        <span class="text-[30px] pl-6">Official 1</span>
        <div v-if="isShowBtn" class="flex justify-around items-center w-full">
          <a-button @click="startExam" class="flex justify-between items-center w-[98px] h-[32px] overflow-hidden">
            <img :src="time" alt="time" />
            模考
          </a-button>
          <a-button class="flex justify-between items-center w-[98px] h-[32px] overflow-hidden">
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
        <div v-for="v in examModalData.sections[0].questions" :key="v.question_id"
          class="flex justify-around separator h-1/3 items-center">
          <span class="pl-2">{{ v.remark }}</span>
          <span class="flex flex-col justify-center text-xs" :style="{ color: showScore(v).color }">
            <span v-if="v.last_record">完成得分</span>
            {{ showScore(v).text }}
          </span>
          <img :src="edit" alt="edit" />
        </div>
      </div>
      <div v-else class="flex flex-col flex-1 overflow-hidden pt-3">
        <a-checkbox-group v-model:value="checkboxId" class="flex flex-col mr-52">
          <p v-for="v in examModalData.sections[0].questions " :key="v.question_id" class="py-2">
            <a-checkbox class="radius" :value="v.question_id">
              <span class="font-bold pl-2">{{ v.remark }}</span>
            </a-checkbox>
          </p>
        </a-checkbox-group>
        <div class="flex justify-end mr-8">
          <a-button class="mr-4" @click="backExam">
            取消
          </a-button>
          <a-button type="primary" class="mr-4" @click="startMockExam">
            确定
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from "vue"
import time from '@/assets/images/time.svg'
import practice from '@/assets/images/practice.svg'
import examEdit from '@/assets/images/exam-edit.svg'
import edit from '@/assets/images/edit.svg'
import { useExamStore } from '@/stores/exam'
import { useRouter } from "vue-router"
import { message } from "ant-design-vue"
import ExamStart from './ExamStart.vue'

const emits = defineEmits(["showExamModal"])
// 显示按钮
const isShowBtn = ref(true)
const props = defineProps<{
  resource_id: number
  sections: Array<any>
}>()
const examStore = useExamStore()
const $router = useRouter()
// 存储选中的复选框的id值
const checkboxId = ref([])
const startExamLoading = ref<boolean>(false)

const examModalData = computed(() => {
  return examStore.getExamModalData(1)
})

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
const startExam = () => {
  isShowBtn.value = !isShowBtn.value
}

// 跳转到开始考试
const startMockExam = async () => {
  if (checkboxId.value.length !== 0) {
    startExamLoading.value = true
    await examStore.startExam(checkboxId.value)
    startExamLoading.value = false
    $router.push({ name: 'mockExam', query: { id: examStore.examing_data.practice_id } })
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
  // 返回read
  $router.push({ name: 'read' })
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
