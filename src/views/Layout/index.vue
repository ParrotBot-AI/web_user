
<template>
  <a-layout class="h-full">
    <a-layout-sider class="!bg-green-1 pt-10"><code-menu /></a-layout-sider>
    <a-layout>
      <a-layout-content class="bg-green-2 flex">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import CodeMenu from './components/codeMenu.vue'
import { useIndexStore } from "@/stores/index"
import { RouterView } from "vue-router"
const indexStore = useIndexStore()
indexStore.getMenuValue()
</script>
