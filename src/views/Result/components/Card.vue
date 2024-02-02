<template>
  <div class="bg-white rounded-md px-14 pb-14 pt-24 relative" :style="{boxShadow: `0px 4px 20px 0px rgba(27, 139, 140, 0.20)`}">
    <div class="w-[190px] h-[137px] result-icon absolute -top-[70px] left-1/2 -translate-x-1/2">
      <span class="absolute right-[52px] top-[9px] text-[24px] text-white">A+</span>
    </div>
    <span class="absolute right-14 top-6 cursor-pointer text-[#F7A705]">回顾答案<ArrowRightOutlined class="pl-2"/></span>
    <div class="w-[56vw]">
      <ul>

      </ul>
      <div>

      </div>
      <div :style="{background: 'rgba(208, 240, 230, 0.50)'}" class="rounded-md p-5">1111</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowRightOutlined } from '@ant-design/icons-vue'
</script>
<style scoped>
  .result-icon {
    background: url('@/assets/images/result-icon.jpg') no-repeat;
    background-size: 100% 100%;
  }
</style>