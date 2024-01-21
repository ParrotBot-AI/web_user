<script setup lang="ts">
  import AIComponent from '@/components/AI/index.vue'
</script>

<template>
  <a-layout class="h-full">
    <a-layout-sider class="!bg-green-1">Sider</a-layout-sider>
    <a-layout>
      <a-layout-content class="bg-green-2 flex">
        <div class="flex flex-col">

        </div>
        <AIComponent />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
