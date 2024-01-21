
<template>
  <a-layout class="h-full">
    <a-layout-sider class="!bg-green-1"><code-menu /></a-layout-sider>
    <a-layout>
      <a-layout-content class="bg-green-2 flex">
        <div class="flex flex-col">

        </div>
        <AIComponent />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import CodeMenu from './components/codeMenu.vue'
import AIComponent from '@/components/AI/index.vue'
console.log('index')
</script>
