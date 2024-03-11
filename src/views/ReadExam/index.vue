<template>
  <ProcessDialog v-if="examStore.showProcessDialog" />
  <a-layout class="w-full h-full flex flex-col">
    <b-header :title="$t('模拟考试')">
      <template #right>
        <HeaderBtns />
      </template>
    </b-header>
    <div class="text-center h-14 flex items-center justify-between bg-white px-8">
      <h2 class="text-gray-900 text[20px] font-bold">{{ examStore.curQuestion?.question_title }}</h2>
      <span></span>
      <div class="text-[18px] text-green-1 cursor-pointer" v-if="examStore.curQuestionChildren?.isShowViewText"
        @click="onClickViewText">VIEW TEXT</div>
      <Timer v-else/>
    </div>
    <div class="flex flex-1 overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
      <div class="flex-1 h-full overflow-h-auto overflow-x-hidden" :style="{ borderRight: `1px solid #D0D5DD` }"
        v-show="isViewText || !examStore.curQuestionChildren?.isShowViewText">
        <h1 class="text-center text-[20px] text-gray-900 py-5">{{ examStore.curQuestion?.question_title }}</h1>
        <div ref="contentDiv" id="content">
          <p 
            class="px-8 text-gray-500 text-[18px] leading-7" 
            :class="'read-mock-content-' + (i+1)"
            v-for="(val, i) in examStore.curQuestion?.cur_questions_content"
            v-html="val"
            :key="i"
          ></p>
        </div>
      </div>
      <div class="flex-1 h-full overflow-h-auto overflow-x-hidden px-12 py-7">
        <div v-show="!(examStore.curQuestionChildren?.isShowViewText && isViewText)">
          <component v-if="examStore.curQuestionChildren"
            :is="examItems[examStore.curQuestionChildren?.question_type as keyof IExamItems]"
            v-bind="examStore.curQuestionChildren" />
        </div>
      </div>
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router"
import WebSocketClient from '@/utils/ws'
import type { USERINFO } from "@/service/user"
import HeaderBtns from "./components/HeaderBtns.vue"
import { onMounted, ref, onUnmounted, watchEffect } from 'vue'
import { useExamStore } from '@/stores/exam'
import { getWithExpiry } from '@/utils/storage'
import ExamSCItem from './components/ExamSCItem.vue'
import ExamMCItem from './components/ExamMcItem.vue'
import ExamLastMcItem from './components/ExamLastMcItem.vue'
import ProcessDialog from './components/ProcessDialog.vue'
import Timer from "./components/Timer.vue"

const { access } = getWithExpiry<USERINFO>('userinfo')!
const socket = ref<WebSocketClient | null>(null)
const isViewText = ref<boolean>(false)
type IExamItems = {
  Toefl_Reading_sc: typeof ExamSCItem  // 单选题和填充题
  Toefl_Reading_mc2: typeof ExamMCItem,  // 4选2多选题
  Toefl_Reading_mc: typeof ExamLastMcItem,  // 6选3 拖动题
}
const examItems: IExamItems = {
  Toefl_Reading_sc: ExamSCItem,
  Toefl_Reading_mc2: ExamMCItem,
  Toefl_Reading_mc: ExamLastMcItem,
}

const { query } = useRoute()
const contentDiv = ref<HTMLDivElement | null>(null)
const examStore = useExamStore()

watchEffect(() => {
  const keywords_p = examStore.curQuestionChildren?.keywords?.p
  const keywords_k = examStore.curQuestionChildren?.keywords?.k
  const p = Array.isArray(keywords_p) ? keywords_p[0] : keywords_p
  if(p){
    const paragraphEl = contentDiv.value?.querySelector('.read-mock-content-' + p)
    if(keywords_k && paragraphEl) {
      // @ts-ignore
      paragraphEl.innerHTML = paragraphEl!.innerHTML.replace(new RegExp(`<b class="bg-[rgba(253,212,78,0.3)]">`, 'g'),'').replace(new RegExp('</b>', 'g'),'').replace(new RegExp(keywords_k, 'g'), `<b class="bg-[rgba(253,212,78,0.3)]">${keywords_k}</b>`)
    }
    paragraphEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    contentDiv.value?.scrollTo(0, 0)
  }
}, {
  flush: 'post'
})


// 获取模拟考试数据
const getmockExamData = async () => {
  examStore.getExamData(query.id as string)
}
// 查看原文
const onClickViewText = () => {
  isViewText.value = !isViewText.value
}
onMounted(() => {
  getmockExamData()
  contentDiv.value?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    let spanTarget: HTMLElement | null = null;
    if (target.parentElement?.classList.contains('fill-item')) {
      spanTarget = target.parentElement
    } else if (target.classList.contains('fill-item')) {
      spanTarget = target
    }
    if (spanTarget) {
      examStore.saveQuestion(examStore.curQuestionChildren?.question_id, examStore.curQuestionChildren?.options_label.map((val: any, i: any) => i == spanTarget?.dataset.index ? 1 : 0))
      contentDiv.value?.querySelectorAll('.fill-item').forEach(item => {
        item.innerHTML = '【 <b></b> 】'
      })
      const text = examStore.curQuestionChildren.keywords
      spanTarget.innerHTML = `【 <em>${typeof text === 'string' ? text : text?.s}</em> 】`
    }
  })
  socket.value = new WebSocketClient('ws://' + import.meta.env.VITE_WS_BASEURL + 'ws/question/' + access + '/');
})

onUnmounted(() => {
  socket.value?.close()
}) 
</script>
<style scoped>
:global(.fill-item) {
  cursor: pointer;
  display: inline-block;
}

:global(.fill-item) {
  font-weight: 700;
}

:global(.fill-item b) {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: var(--color-green-1);
  border-radius: 50%;
  margin: 0 2px;
}

:global(.fill-item em) {
  font-style: normal;
}
</style>
