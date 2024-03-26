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
import { useRoute } from "vue-router"
import WebSocketClient from '@/utils/ws'
import QuesChilren from "./components/QuesChildren.vue"
import type { USERINFO } from "@/service/user"
import GuideChildren from "./components/GuideChildren.vue"
import { onMounted, ref, onUnmounted } from 'vue'
import { useReadExamStore } from '@/stores/readExam'
import { getWithExpiry } from '@/utils/storage'
import ProcessDialog from './components/ProcessDialog.vue'
const { access } = getWithExpiry<USERINFO>('userinfo')!
const socket = ref<WebSocketClient | null>(null)
const loading = ref(true)
const { query } = useRoute()
const examStore = useReadExamStore()
const guideContinueClick = () => {
  examStore.changeQuestion(1)
}
onMounted(async () => {
  await examStore.getExamData(query.id as string)
  socket.value = new WebSocketClient('ws://' + import.meta.env.VITE_WS_BASEURL + 'ws/question/' + access + '/');
  loading.value = false
})

onUnmounted(() => {
  socket.value?.close()
}) 
</script>
<style scoped>
</style>