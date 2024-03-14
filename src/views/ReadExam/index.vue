<template>
  <ProcessDialog v-if="examStore.showProcessDialog" />
  <a-layout class="w-full h-full flex flex-col">
    <b-header :title="$t('模拟考试')">
      <template #right>
        <div class="flex">
          <HeaderBtn v-for="val in Object.keys(HeaderBtnsConfig)" v-bind="HeaderBtnsConfig[val]" :key="val" />
        </div>
      </template>
    </b-header>
    <BaseGuide v-bind="readGuide" v-if="isShowGuide" />
    <template v-else>
      <div class="text-center h-14 flex items-center justify-between bg-white px-8">
        <h2 class="text-gray-900 text[20px] font-bold">{{ examStore.curQuestion?.question_title }}</h2>
        <span></span>
        <div class="text-[18px] text-green-1 cursor-pointer" v-show="examStore.curQuestionChildren?.isShowViewText"
          @click="onClickViewText">VIEW TEXT</div>
        <Timer v-show="!examStore.curQuestionChildren?.isShowViewText" />
      </div>
      <div class="flex flex-1 overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
        <div class="flex-1 h-full overflow-h-auto overflow-x-hidden" :style="{ borderRight: `1px solid #D0D5DD` }"
          v-show="isViewText || !examStore.curQuestionChildren?.isShowViewText">
          <h1 class="text-center text-[20px] text-gray-900 py-5">{{ examStore.curQuestion?.question_title }}</h1>
          <div ref="contentDiv" id="content">
            <p class="px-8 text-gray-500 text-[18px] leading-7" :class="'read-mock-content-' + (i + 1)"
              v-for="(val, i) in examStore.curQuestion?.cur_questions_content" v-html="val" :key="i"></p>
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
    </template>
  </a-layout>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router"
import WebSocketClient from '@/utils/ws'
import type { USERINFO } from "@/service/user"
import type { HeaderBtnProps } from "./components/HeaderBtn.vue"
import HeaderBtn from "./components/HeaderBtn.vue"
import { onMounted, ref, onUnmounted, watchEffect, reactive } from 'vue'
import { useExamStore } from '@/stores/exam'
import { getWithExpiry } from '@/utils/storage'
import ExamSCItem from './components/ExamSCItem.vue'
import ExamMCItem from './components/ExamMcItem.vue'
import ExamLastMcItem from './components/ExamLastMcItem.vue'
import ProcessDialog from './components/ProcessDialog.vue'
import BaseGuide from '@/components/BaseGuide/index.vue'
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
const isShowGuide = ref(true)
const contentDiv = ref<HTMLDivElement | null>(null)
const examStore = useExamStore()
const HeaderBtnsConfig = reactive<{
  [k in string]: HeaderBtnProps
}>({
  progress: {
    title: '进度',
    id: 'progress',
    disabled: true,
    isShow: true,
    onClick: () => {
      examStore.setShowProcessDialog()
    }
  },
  help: {
    title: '帮助',
    id: 'help',
    disabled: false,
    isShow: true,
    onClick: () => {
      console.log('help')
    }
  },
  prev: {
    title: '上一步',
    disabled: true,
    id: 'prev',
    isShow: true,
    onClick: () => {
      examStore.changeQuestion(-1)
    }
  },
  continue: {
    title: '跳过',
    id: 'continue',
    disabled: false,
    isShow: true,
    onClick: () => {
      isShowGuide.value = false
    }
  },
  next: {
    title: '下一步',
    id: 'next',
    disabled: true,
    isShow: true,
    onClick: () => {
      examStore.changeQuestion(1)
    }
  },
  submit: {
    title: '提交',
    id: 'submit',
    disabled: true,
    isShow: false,
    onClick: () => {
      examStore.requestSubmitExam(query.id as string)
    }
  },
})
watchEffect(() => {
  HeaderBtnsConfig.continue.isShow = isShowGuide.value;
  HeaderBtnsConfig.progress.disabled = isShowGuide.value
  HeaderBtnsConfig.prev.disabled = isShowGuide.value
  HeaderBtnsConfig.submit.disabled = isShowGuide.value
  HeaderBtnsConfig.next.disabled = isShowGuide.value && !examStore.isExamEnding
  HeaderBtnsConfig.next.isShow = !examStore.isExamEnding
  HeaderBtnsConfig.submit.isShow = examStore.isExamEnding
})


const readGuide = reactive({
  type: 'info',
  title: 'Reading',
  info_title: 'Reading Section Directions',
  is_show_footer: true,
  question_title: [
    `In this section, you will be able to demonstrate your ability to understand academic passages in English. You will read and answer questions about two passages. A clock will indicate how much time remains. In the actual test, you will have 36 minutes to read the two passages and answer the questions.`,
    `Some passages include an underlined word or phrase. Select the word or phrase to see a definition, an explanation, or an illustration.`,
    `Move to the next question by selecting <button class="nextbtn">Next</button> . You can skip questions and go back to them later if time remains. Return to previous screens by selecting.<button class="backbtn">BACK</button> `,
    `Select <button class="reviewbtn">REVIEW</button> at any time to see which questions you have answered and which questions you have not answered. From the Review screen, you may go directly to any question you have already encountered.`
  ]
})

watchEffect(() => {
  const keywords_p = examStore.curQuestionChildren?.keywords?.p
  const keywords_k = examStore.curQuestionChildren?.keywords?.k
  const p = Array.isArray(keywords_p) ? keywords_p[0] : keywords_p
  if (p) {
    const paragraphEl = contentDiv.value?.querySelector('.read-mock-content-' + p)
    if (keywords_k && keywords_k !== '$$' && paragraphEl) {
      // @ts-ignore
      paragraphEl.innerHTML = paragraphEl!.innerHTML.replace(new RegExp(`<b class="bg-[rgba(253,212,78,0.3)]">`, 'g'), '').replace(new RegExp('</b>', 'g'), '').replace(new RegExp(keywords_k, 'g'), `<b class="bg-[rgba(253,212,78,0.3)]">${keywords_k}</b>`)
    }
    paragraphEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    contentDiv.value?.scrollTo(0, 0)
  }
}, {
  flush: 'post'
})


// 查看原文
const onClickViewText = () => {
  isViewText.value = !isViewText.value
}
onMounted(async () => {
  console.log('read exam onMounted')
  await examStore.getExamData(query.id as string)
  contentDiv.value?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    setTimeout(() => {
      console.log('click', target)
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
