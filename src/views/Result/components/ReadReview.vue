<template>
  <div class="flex flex-1 overflow-hidden bg-white">
    <div class="w-1/2 h-full overflow-h-auto overflow-x-hidden pt-2" :style="{ borderRight: `1px solid #D0D5DD` }">
      <div ref="contentDiv" id="content" class="content-box">
        <p 
          class="px-8 text-gray-500 text-[18px] leading-7 pb-4 indent-8" 
          :class="['read-mock-content-' + (i + 1), {
             'active': typeof props.answerData?.keywords?.p === 'number' ? props.answerData?.keywords?.p === (i + 1) : props.answerData?.keywords?.p?.[0] === (i + 1)
          }]"
          v-for="(val, i) in props.answerData?.question_parent.question_content" v-html="val" :key="i">
        </p>
      </div>
    </div>
    <div class="w-1/2 h-full overflow-h-auto overflow-x-hidden px-12 py-7">
      <h1 class="text-gray-500 text-[18px] pb-10 font-bold">
        <p v-html="props.answerData?.question_content?.replace(/\[▇\]/g, `<span class='fill-item'>【<b></b>】</span>`)"></p>
      </h1>
      <h2 v-if="props.answerData.keywords.k === '$$'" class="text-green-1 text-[18px]">
        {{ props.answerData.keywords.s || 'keywords.s is not defined' }}
      </h2>
        <!-- 单选回顾 -->
      <div>
        <div v-for="( item, index ) in  props.answerData?.detail " :key="index" :value="index"
          class="flex pb-7 text-gray-500">
          <span class="w-5 h-5 rounded-full mr-4 opt-status" :class="{
            default: props.answerData?.answer_weight[index] === 1,
            error: props.answerData?.answer[index] !== props.answerData?.answer_weight[index] && props.answerData?.answer[index] === 1,
            success: props.answerData?.answer_weight[index] === 1 && props.answerData?.answer[index] === 1,
          }"></span>
          <p class="flex-1">{{ item }}</p>
        </div>
      </div>
    </div>
  </div>
  <FloatAI :data="props.answerData" type="read"/>
</template>
<script setup lang="ts">
import FloatAI from "@/components/AI/float.vue";
import { defineProps, ref, watchEffect } from "vue";
const contentDiv = ref<HTMLDivElement | null>(null)

const props = defineProps<{
  answerData: any
}>()

watchEffect(() => {
  const keywords_p = props.answerData?.keywords?.p
  const keywords_k = props.answerData?.keywords?.k
  const keywords_s = props.answerData?.keywords?.s
  const p = Array.isArray(keywords_p) ? keywords_p[0] : keywords_p
  if (p) {
    const originText = props.answerData?.question_parent?.question_content[p - 1]
    const paragraphEls = contentDiv.value?.querySelectorAll('p')
    const paragraphEl = contentDiv.value?.querySelector('.read-mock-content-' + p)
    paragraphEls?.forEach((val,i) => {
      val.innerHTML = props.answerData?.question_parent?.question_content[i]
    })
    if (keywords_k && keywords_k !== '$$' && paragraphEl) {
      paragraphEl.innerHTML = originText.replace(new RegExp(keywords_k, 'g'), `<b class="bg-[rgba(253,212,78,0.3)]">${keywords_k}</b>`)
    }
    if (keywords_s && keywords_p && keywords_k !== '$$' && paragraphEl) {
      paragraphEl.innerHTML = originText.replace(new RegExp(keywords_s, 'g'), `<b class="bg-[rgba(253,212,78,0.3)]">${keywords_s}</b>`)
    }
    if(keywords_k === '$$' && keywords_s && keywords_p && paragraphEl) {
      const _i = props.answerData?.answer?.findIndex(val => val === 1)
      let startindex = -1
      paragraphEl.innerHTML = props.answerData?.question_parent?.original_question_content[p-1].replace(/\$\$/g, ($0,index) => {
        startindex++
        return startindex === _i ? `<span class="fill-item" data-index="${startindex}">【 <em>${keywords_s}</em> 】</span>` : `<span class="fill-item" data-index="${startindex}">【 <b></b> 】</span>`
      })
    }
    paragraphEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    contentDiv.value?.scrollTo(0, 0)
  }
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
.opt-status {
  background-size: 60% auto;
  background-position: center center;
  background-repeat: no-repeat;
  border: 1px solid #e6e6e6;
}
.opt-status.default {
  background-color: rgba(178, 218, 200, 1);
  border: 1px solid rgba(178, 218, 200, 1);
  background-image: url('@/assets/homeIcon/success.svg')
}
.opt-status.error {
  background-color: #C33473;
  border: 1px solid #C33473;
  background-image: url('@/assets/homeIcon/error.svg')
}
.opt-status.success {
  background-color: #1B8B8C;
  border: 1px solid #1B8B8C;
  background-image: url('@/assets/homeIcon/success.svg')
}
</style>