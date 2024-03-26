<template>
  <div class="flex flex-col">
    <h1 class="font-normal text-gray-900 sticky top-0 left-0 bg-white py-3 z-50">{{ props.title }}</h1>
    <ul>
      <li v-for="item in props.list" :key="item.id" class="flex justify-between items-center py-4 overflow-hidden">
        <span v-if="!item.is_complete" class="text-[12px] py-[2px] px-[6px] text-gray-700 rounded-md btn-status-0" :style="{border:'1px solid var(--color-gray-300)'}">未开始</span>
        <span v-if="item.is_complete" class="text-[12px] py-[2px] px-[6px] rounded-md btn-status-1" :style="{border:'1px solid var(--color-gray-300)'}">已完成</span>
        <p class="text-gray-500 flex-1 truncate px-2 text-left indent-5">{{ item.task_name }}</p>
        <a-button v-if="!item.is_complete" class="text-[12px] text-green-1 border-green-1">去完成</a-button>
        <a-button v-if="item.is_complete" class="text-[12px] text-yellow-1 border-yellow-1">已完成</a-button>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{
  title: string
  list: Array<any>
}>()
</script>
<style scoped>
  .btn-status-0:before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--color-green-1);
    display: inline-block;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 6px;
  }
  .btn-status-1:before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--color-yellow-1);
    display: inline-block;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 6px;
  }
</style>