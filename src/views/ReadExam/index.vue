<template>
  <a-spin v-if="loading" size="large" tip="试题加载中..." class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"/>
  <template v-else>
    <ProcessDialog v-if="examStore.showProcessDialog" />
    <GuideChildren 
      v-if="examStore.curQuestion?.isGuide" 
      v-bind="examStore.curQuestion"
      :continueClick="guideContinueClick"
    />
    <QuesChilren 
      v-if="!examStore.curQuestion?.isGuide"
    />
  </template>
</template>
<script setup lang="ts">
import type { USERINFO } from "@/service/user"
import { useReadExamStore } from '@/stores/readExam'
import { getWithExpiry } from '@/utils/storage'
import WebSocketClient from '@/utils/ws'
import { onUnmounted, ref, watchEffect } from 'vue'
import { useRoute } from "vue-router"
import GuideChildren from "./components/GuideChildren.vue"
import ProcessDialog from './components/ProcessDialog.vue'
import QuesChilren from "./components/QuesChildren.vue"
const { access } = getWithExpiry<USERINFO>('userinfo')!
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