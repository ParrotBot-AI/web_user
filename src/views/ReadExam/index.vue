<template>
  <a-spin v-if="loading" size="large" tip="试题加载中..." class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"/>
  <template v-else>
    <ProcessDialog v-if="examStore.showProcessDialog" />
    <GuideChildren 
      v-if="examStore.curQuestion?.isGuide" 
      v-bind="examStore.curQuestion"
      :continueClick="guideContinueClick"
    />
    <GuideChildren 
      v-if="examStore.isShowHelpDialog" 
      class="fixed top-0 left-0 z-[100]"
      v-bind="examStore.questionData.formatQuestion[0]"
      :continueClick="examStore.onShowHelp"
    />
    <QuesChilren 
      v-if="!examStore.curQuestion?.isGuide"
    />
  </template>
</template>
<script setup lang="ts">
import { useReadExamStore } from '@/stores/readExam'
import WebSocketClient from '@/utils/ws'
import { onUnmounted, ref, watchEffect } from 'vue'
import { useRoute } from "vue-router"
import GuideChildren from "./components/GuideChildren.vue"
import ProcessDialog from './components/ProcessDialog.vue'
import QuesChilren from "./components/QuesChildren.vue"
const socket = ref<WebSocketClient | null>(null)
const loading = ref(true)
const { query } = useRoute()
const examStore = useReadExamStore()
const guideContinueClick = () => {
  examStore.changeQuestion(1)
}

watchEffect(async () => {
  console.log(query.id, query.name)
  await examStore.getExamData(query.id as string)
  // socket.value = new WebSocketClient('ws://' + import.meta.env.VITE_WS_BASEURL + 'ws/question/' + access + '/');
  loading.value = false
})

onUnmounted(() => {
  socket.value?.close()
}) 
</script>
<style scoped>
</style>