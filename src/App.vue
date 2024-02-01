<script setup lang="ts">
import { RouterView } from 'vue-router'
import { DndProvider } from 'vue3-dnd'
import { computed } from "vue"
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import type { TouchBackendOptions } from 'react-dnd-touch-backend'
import {isMobile} from "@/utils/utils"
const mobile = isMobile()
const options: TouchBackendOptions = {
  enableMouseEvents: true,
}
const backend = computed(() => {
  console.log(111)
  if (mobile) {
    console.log('isMobile')
    return TouchBackend
  }
  return HTML5Backend
})
</script>

<template>
  <DndProvider :backend="backend" :options="options">
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
        <RouterView />
      </a-config-provider>
    </a-style-provider>
  </DndProvider>
</template>

<style scoped></style>
