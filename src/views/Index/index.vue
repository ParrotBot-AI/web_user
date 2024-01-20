<template>
  <a-layout class="h-full">
    <a-layout-sider class="!bg-green-1"><code-menu /></a-layout-sider>
    <a-layout>
      <a-layout-content>Content</a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import CodeMenu from './components/codeMenu.vue'
console.log('index')
</script>
