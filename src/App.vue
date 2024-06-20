<script setup lang="ts">
import { isMobile } from "@/utils/utils"
import { message } from "ant-design-vue"
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { computed } from "vue"
import { RouterView } from 'vue-router'
import { DndProvider } from 'vue3-dnd'
const mobile = isMobile()
const backend = computed(() => {
  if (mobile) {
    message.error('暂不支持手机端，请使用电脑访问～', 0)
    return TouchBackend
  }
  return HTML5Backend
})
</script>

<template>
  <DndProvider :backend="backend">
    <a-style-provider hash-priority="low">
      <a-config-provider
        :theme="{
          token: {
            colorPrimary: '#1b8b8c',
            colorText: '#344054',
            borderRadius: 8,
            fontSize: 16
          }
        }"
      >
      <div class="!select-none app">
        <RouterView />
      </div>
      </a-config-provider>
    </a-style-provider>
  </DndProvider>
</template>

<style scoped></style>
