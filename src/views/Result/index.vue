<template>
  <a-spin v-if="resultStore.resultData.loading" size="large" :tip="$t('成绩计算中') + '...'"
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />
  <template v-else>
    <AnswerReview v-if="resultStore.showAnswerHistoryDialog" />
    <a-layout class="w-full h-full flex flex-col relative z-40">
      <b-header :title="resultStore.resultData.title" :onClickBack="onClickBack">
        <template #right>
          <div class="flex">
            <a-button type="primary"
              class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center bg-[#B2DAC8] text-[#1B8B8C]"
              @click="onBackClick">
              <span>
                <LeftOutlined />{{ $t('返回主页') }}
              </span>
            </a-button>
            <a-button type="primary" class="px-4 text-[16px] mx-1.5 py-[18px] flex items-center justify-center"
              v-if="resultStore.footerData[resultStore.resultData.footerActiveIndex].id !== 'MixedAll'"
              @click="onReviewAnswer">
              <span>{{ $t('回顾答案') }}
                <RightOutlined />
              </span>
            </a-button>
          </div>
        </template>
      </b-header>
      <div class="flex-1 bg-green-2">
        <div class="flex items-center justify-center pt-28">
          <Card />
        </div>
        <footer class="flex items-center justify-center mt-10 gap-6">
          <a-button v-for="(val, i) in resultStore.footerData" @click="onClickFooterBtn(i)" :key="val.id"
            class="h-10 min-w-[130px] text-[#A6AAB3] border-[#EAECF0]" :class="{
              '!border-[#1B8B8C] shadow-lg !text-[#1B8B8C]': i === resultStore.resultData.footerActiveIndex
            }">{{ val.title }}</a-button>
        </footer>
      </div>
    </a-layout>
  </template>
</template>
<script setup lang="ts">
import { useResultStore } from "@/stores/result";
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
import { watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import AnswerReview from './components/AnswerReview.vue';
import Card from './components/Card.vue';
const resultStore = useResultStore()
const $route = useRoute()
const $router = useRouter()
watchEffect(async () => {
  await resultStore.getExamResult($route.params.sheetId as string)
})
const onClickBack = () => {
  $router.push('/' + $route.query.type)
}
const onBackClick = () => {
  $router.replace('/')
}
const onReviewAnswer = () => {
  resultStore.setShowAnswerHistoryDialog()
}
const onClickFooterBtn = (index: number) => {
  resultStore.resultData.footerActiveIndex = index
}
</script>
<style scoped></style>