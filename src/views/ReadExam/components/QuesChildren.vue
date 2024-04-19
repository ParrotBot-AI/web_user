<template>
<a-layout class="w-full h-full flex flex-col">
    <b-header :title="examStore.curQuestion.navTitle">
      <template #right>
        <div class="flex">
          <HeaderBtn v-for="val in Object.keys(HeaderBtnsConfig)" v-bind="HeaderBtnsConfig[val]" :key="val" />
        </div>
      </template>
    </b-header>
    <BQuesTitle 
      :title="examStore.curQuestion?.parentQuestion?.question_title" 
      :index="examStore.curQuestion?.num " 
      :length="examStore.curQuestion?.isViewPassage ? 0 : examStore.questionData?.sumQuesLength"
    >
      <template #right>
        <BQuesTimer v-show="!examStore.curQuestion?.viewText_open" :times="examStore?.questionData?.time_remain" />
        <div 
          v-show="examStore.curQuestion?.viewText_open" 
          class="text-[#1B8B8C] font-semibold cursor-pointer"
          @click="examStore.setViewText()"
        >{{!examStore.curQuestion?.viewText_flag ? 'VIEW QUESTION' : 'VIEW TEXT'}}</div>
      </template>
    </BQuesTitle>
    <div class="flex flex-1 overflow-hidden bg-white w-full">
      <div 
        class="h-full overflow-h-auto overflow-x-hidden pt-2" 
        :style="{ borderRight: `1px solid #D0D5DD`}"
        :class="{
          'w-1/2':!examStore.curQuestion?.viewText_open || !examStore.curQuestion?.viewText_flag,
          'w-0': examStore.curQuestion?.viewText_open && examStore.curQuestion?.viewText_flag
        }"
      >
        <div ref="contentDiv" id="content" class="content-box">
          <p 
            class="px-8 text-gray-500 text-[18px] leading-7 pb-4 indent-8" 
            :class="['read-mock-content-' + (i + 1), {
              'active': typeof examStore.curQuestion?.keywords?.p === 'number' ? examStore.curQuestion?.keywords?.p === (i + 1) : examStore.curQuestion?.keywords?.p?.[0] === (i + 1)
            }]"
            v-for="(val, i) in examStore.curQuestion?.parentQuestion?.question_content" v-html="val" :key="i"></p>
        </div>
      </div>
      <div 
        class="h-full overflow-h-auto overflow-x-hidden"
        :class="{
          'w-full opacity-1': examStore.curQuestion?.viewText_open && examStore.curQuestion?.viewText_flag,
          'w-1/2 opacity-1': !examStore.curQuestion?.viewText_open,
          'w-1/2 opacity-0': examStore.curQuestion?.viewText_open && !examStore.curQuestion?.viewText_flag
        }"
      >
        <div v-if="!examStore.curQuestion?.isViewPassage" class="px-12 py-7">
          <component v-if="examStore.curQuestion"
            :is="examItems[examStore.curQuestion?.question_type]"
            v-bind="examStore.curQuestion" />
        </div>
      </div>
    </div>
</a-layout>
</template>
<script setup lang="ts">
import { useReadExamStore } from '@/stores/readExam'
import { reactive, ref, watchEffect } from "vue"
import ExamLastMcItem from './ExamLastMcItem.vue'
import ExamMCItem from './ExamMcItem.vue'
import ExamSCItem from './ExamSCItem.vue'
import type { HeaderBtnProps } from "./HeaderBtn.vue"
import HeaderBtn from "./HeaderBtn.vue"
const examStore = useReadExamStore()
const contentDiv = ref<HTMLDivElement | null>(null)
const HeaderBtnsConfig = reactive<{
  [k in string]: HeaderBtnProps
}>({
  progress: {
    title: 'REVIEW',
    id: 'progress',
    disabled: false,
    isShow: true,
    onClick: () => {
      examStore.setShowProcessDialog()
    }
  },
  help: {
    title: 'HELP',
    id: 'help',
    disabled: false,
    isShow: true,
    onClick: () => {
      examStore.onShowHelp()
    }
  },
  prev: {
    title: 'BACK',
    disabled: false,
    id: 'prev',
    isShow: true,
    onClick: () => {
      examStore.changeQuestion(-1)
    }
  },
  next: {
    title: 'NEXT',
    id: 'next',
    disabled: false,
    isShow: true,
    onClick: () => {
      examStore.changeQuestion(1)
    }
  },
  submit: {
    title: 'SUBMIT',
    id: 'submit',
    disabled: false,
    isShow: false,
    onClick: () => {
      examStore.requestSubmitExam()
    }
  },
})


type IExamItems = {
  Toefl_Reading_sc: typeof ExamSCItem  // 单选题和填充题
  Toefl_Reading_mc_2: typeof ExamMCItem,  // 4选2多选题
  Toefl_Reading_mc: typeof ExamLastMcItem,  // 6选3 拖动题
}
const examItems: IExamItems = {
  Toefl_Reading_sc: ExamSCItem,
  Toefl_Reading_mc_2: ExamMCItem,
  Toefl_Reading_mc: ExamLastMcItem,
}
watchEffect(() => {
  if(examStore.questionData?.sumQuesLength > 0 && examStore.curQuestion?.num === examStore.questionData?.sumQuesLength) {
    HeaderBtnsConfig.submit.isShow = true
    HeaderBtnsConfig.next.isShow = false
  } else {
    HeaderBtnsConfig.submit.isShow = false
    HeaderBtnsConfig.next.isShow = true
  }
})
watchEffect(() => {
  if(examStore.curQuestion?.isViewPassage) {
    contentDiv.value?.scrollTo(0, 0)
    return
  }
  const keywords_p = examStore.curQuestion?.keywords?.p
  const keywords_k = examStore.curQuestion?.keywords?.k
  const keywords_s = examStore.curQuestion?.keywords?.s
  const p = Array.isArray(keywords_p) ? keywords_p[0] : keywords_p
  if (p) {
    const originText = examStore.curQuestion?.parentQuestion?.question_content[p - 1]
    const paragraphEls = contentDiv.value?.querySelectorAll('p')
    const paragraphEl = contentDiv.value?.querySelector('.read-mock-content-' + p)
    paragraphEls?.forEach((val,i) => {
      val.innerHTML = examStore.curQuestion?.parentQuestion?.question_content[i]
    })
    if (keywords_k && keywords_k !== '$$' && paragraphEl) {
      paragraphEl.innerHTML = originText.replace(new RegExp(keywords_k, 'g'), `<b class="bg-[rgba(253,212,78,0.3)]">${keywords_k}</b>`)
    }
    if (keywords_s && keywords_p && keywords_k !== '$$' && paragraphEl) {
      paragraphEl.innerHTML = originText.replace(new RegExp(keywords_s, 'g'), `<b class="bg-[rgba(253,212,78,0.3)]">${keywords_s}</b>`)
    }
    if(keywords_k === '$$' && keywords_s && keywords_p && paragraphEl) {
      const answerValue = examStore.answerData.find(val => val.question_id === examStore.curQuestion?.question_id)?.answer
      const _i = answerValue.findIndex(val => val === 1)
      let startindex = -1
      paragraphEl.innerHTML = examStore.curQuestion?.parentQuestion?.original_question_content[p-1].replace(/\$\$/g, ($0,index) => {
        startindex++
        return startindex === _i ? `<span class="fill-item" data-index="${startindex}">【 <em>${keywords_s}</em> 】</span>` : `<span class="fill-item" data-index="${startindex}">【 <b></b> 】</span>`
      })
    }
    paragraphEl?.scrollIntoView({ behavior: 'auto', block: 'start' })
  } else {
    contentDiv.value?.scrollTo(0, 0)
  }
}, {
  flush: 'post'
})

watchEffect(async () => {
  contentDiv.value?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    setTimeout(() => {
      let spanTarget: HTMLElement | null = null;
      if (target.parentElement?.classList.contains('fill-item')) {
        spanTarget = target.parentElement
      } else if (target.classList.contains('fill-item')) {
        spanTarget = target
      }
      if (spanTarget) {
        examStore.saveQuestion(examStore.curQuestion?.question_id, examStore.curQuestion?.options_label.map((val: any, i: any) => i == spanTarget?.dataset.index ? 1 : 0))
      }
    })
  })
}, {
  flush: 'post'
})

</script>
<style scoped>
:global(.fill-item) {
  cursor: pointer;
  display: inline;
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
  margin: -4px 1px 0;
  vertical-align: middle;
}

:global(.fill-item em) {
  font-style: normal;
}

.content-box>p {
  position: relative;
}
.content-box>p.active:before {
  content: '';
  position: absolute;
  top: 5px;
  left: 2rem;
  width: 16px;
  height: 16px;
  background: #1B8B8C;
}
</style>
