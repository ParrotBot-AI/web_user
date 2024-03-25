<template>
  <div class="flex px-3 pb-5 xl:w-1/3 w-1/2">
    <div class="flex bg-white exam-card w-full" :style="{height: curCustomData.height + 'px' || 'auto'}">
      <!-- left -->
      <div
        class="left relative overflow-hidden h-full flex flex-col justify-around items-start pt-8 text-white text-center">
        <!-- <img class="absolute top-4 right-4" :src="examEdit" alt="examEdit" @click="toResult"/> -->
        <span class="text-[30px] pl-6">{{ $t(props.resource_name.split('-')[0]) }}</span>
        <div v-if="isShowBtn" class="flex justify-around items-center w-full gap-3 px-3">
          <a-button @click="onSelectQuestion('mock_exam')" class="flex flex-1 justify-between items-center h-8 overflow-hidden">
            <img :src="time" alt="time" />
            {{ $t('模考') }}
          </a-button>
          <a-button @click="onSelectQuestion('practice')" class="flex flex-1 justify-between items-center h-8 overflow-hidden">
            <img :src="practice" alt="practice" />
            {{ $t('练习') }}
          </a-button>
        </div>
        <template v-else>
          <span class="pl-3.5 pb-4 pt-2">
            {{ $t('请选择此次'+( type === 'mock_exam' ? '模考' : '练习' )+'文章') }}
            <a-tooltip 
              placement="bottomLeft" 
              v-if="curCustomData.promptText" 
              color="#D0F0E6" 
              :overlayInnerStyle="{color: '#0A3F64',fontSize: '12px',borderRadius: '15px',borderTopLeftRadius: '0',border: '1px solid #0A3F64', marginTop: '-20px', marginLeft: '3px', padding: '10px'}"
            >
              <template #title>
                <span>{{curCustomData.promptText}}</span>
              </template>
              <img :src="hint" alt="hint" />
            </a-tooltip>
          </span>
          <span class="pl-6 pb-6">{{computedCheckboxId.length}}/{{ curCustomData.maxSelectCount }}</span>
        </template>
      </div>
      <!-- right 默认展示 -->
      <div
        v-if="isShowBtn" 
        class="flex flex-col flex-1 overflow-hidden"
      >
        <template v-for="(v,i) in props.section" :key="v.section_id">
          <h2 v-if="isHearing && i%3===0" class="pl-2 pt-2 text-[#333] text-base font-medium" :style="{borderTop: i===3 ? '1px solid #D0D5DD' : '1px solid transparent'}">Section {{i === 0 ? 1 : 2}}</h2>
          <div class="flex justify-between items-center flex-1 px-2" :class="{separator: !isHearing}">
            <span 
              class="text-gray-500 break-word w-24 font-semibold text-base" 
              v-if="Array.isArray(curCustomData.remark)"
            >
              {{ curCustomData.remark[i] }}
            </span>
            <span 
              class="text-gray-500 text-base" 
              v-else
            >
              <template v-if="!isHearing">{{ curCustomData.remark }}{{' '}}{{ v.questions[0].order }}</template>
              <template v-else-if="isHearing && i === 4">{{ curCustomData.remark }}{{' '}}3</template>
              <template v-else-if="isHearing && i === 5">{{ curCustomData.remark }}{{' '}}4</template>
              <template v-else-if="isHearing && i%3 !== 0">{{ curCustomData.remark }}{{' '}}{{ v.questions[0].order - 1 }}</template>
              <template v-else-if="isHearing && i%3 === 0">Conversation{{' '}}1</template>
            </span>
            <span 
              class="flex flex-col justify-center text-xs" 
              :style="{ color: showScore(v).color }"
            >
              <span v-if="v.last_record"> {{ $t('完成得分') }}</span>
              {{ $t(showScore(v).text) }}
            </span>
            <img :src="edit" alt="edit" @click="onEditClick(v)" class="cursor-pointer" v-if="!isMock" />
          </div>
        </template>
      </div>
      <!-- right 选择内容 -->
      <div v-else class="flex flex-col flex-1 overflow-hidden py-2.5 justify-between">
        <a-checkbox-group v-model:value="checkboxId" class="w-full pl-2 flex flex-col">
          <h2 v-if="isHearing" class="pt-2 pb-1 text-[#333] text-base font-medium">Section {{2}}</h2>
          <p v-for="(v,i) in checkboxVal" :key="v.section_id" class="py-1.5">
            <a-checkbox class="radius" :value="v.questions[0].question_id">
              <span class="text-gray-500 break-word w-24 font-bold text-base" v-if="Array.isArray(curCustomData.remark)">{{ curCustomData.remark[i] }}</span>
              <span class="font-bold pl-2 text-gray-500" v-else>{{ curCustomData.remark }}{{' '}}{{ isHearing ? i + 3 : i + 1 }}</span>
            </a-checkbox>
          </p>
        </a-checkbox-group>
        <div class="flex justify-end">
          <a-button class="mr-4 text-green-1 border-green-1" @click="backExam">
            {{ $t('取消') }}
          </a-button>
          <a-button type="primary" class="mr-4" @click="startMockExam" :loading="startExamLoading">
            {{ $t('确定') }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, computed } from "vue"
import type {EXAN_START} from "@/service/exam"
import time from '@/assets/images/time.svg'
import practice from '@/assets/images/practice.svg'
import examEdit from '@/assets/images/exam-edit.svg'
import edit from '@/assets/images/edit.svg'
import { useExamStore } from '@/stores/exam'
import { useRoute, useRouter } from "vue-router"
import { message } from "ant-design-vue"
import hint from "@/assets/images/hint.png"
// 显示按钮
const isShowBtn = ref(true)
const props = defineProps<{
  resource_id: number
  resource_name: string
  section: Array<any>
}>()
const examStore = useExamStore()
const $router = useRouter()
const $route = useRoute()
const type = ref<EXAN_START['q_type']>('mock_exam')
const checkboxVal = computed(() => {
  return props.section.slice($route.name !== 'hearing' ? 0 : 4)
})
// 存储选中的复选框的id值
const checkboxId = ref<Array<number>>([])
const startExamLoading = ref<boolean>(false)
const isHearing = computed(() => {
  return $route.name === 'hearing'
})
const isMock = computed(() => {
  return $route.name === 'mock'
})
const curCustomData = computed(() => {
  return examStore.customData[$route.name as keyof typeof examStore.customData]
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
const onSelectQuestion = async (v:EXAN_START['q_type']) => {
  if(
    curCustomData.value.maxSelectCount === curCustomData.value.minSelectCount && props.section.length === curCustomData.value.maxSelectCount ||
    isHearing.value && props.section.length === 5
  ) {
    checkboxId.value = props.section.map(val => val.questions[0].question_id)
    type.value = v
    await examStore.startExam(type.value,checkboxId.value)
    $router.push({ name: `${$route.name as string}Exam`, query: { id: examStore.examing_data.sheet_id, name: props.resource_name.split('-')[0] } })
  } else {
    isShowBtn.value = !isShowBtn.value
    type.value = v
  }
  
}

// 跳转到开始考试
const startMockExam = async () => {
  if (checkboxId.value.length !== 0) {
    try {
      startExamLoading.value = true
      await examStore.startExam(type.value,isHearing.value ? [...props.section.slice(0,4).map(val => val.questions[0].question_id) ,...checkboxId.value] : checkboxId.value)
      $router.push({ name: `${$route.name as string}Exam`, query: { id: examStore.examing_data.sheet_id , name: props.resource_name.split('-')[0] } })
    } finally {
      startExamLoading.value = false
    }
    
  } else {
    message.info('请选择Passage')
  }
}
const onEditClick = async (v:any) => {
  await examStore.startExam('practice', [v.questions[0].question_id])
  $router.push({ name: `${$route.name as string}Exam`, query: { id: examStore.examing_data.sheet_id, name: props.resource_name.split('-')[0]  } })
}
// 计算选中的checkboxId
const computedCheckboxId = computed(() => {
  if (checkboxId.value.length > curCustomData.value.maxSelectCount) {
    checkboxId.value!.shift()
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
  box-shadow: 0px 4px 20px 0px rgba(27, 139, 140, 0.20);
}

.left {
  width: 50%;
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
  right: 0;
  left: 0;
  height: 1px;
  content: "";
  transform: scaleY(.9);
  background-color: #D0D5DD;
}

.separator:last-child:after {
  height: 0;
}
:global(.ant-tooltip-arrow) {
  display: none!important;
}
</style>
