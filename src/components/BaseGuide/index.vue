<template>
  <div class="text-center h-14 flex items-center justify-between bg-white px-8">
    <h2 class="text-gray-900 text[20px] font-bold">{{props.title}}</h2>
  </div>
  <div class="flex flex-1 justify-center items-center overflow-hidden bg-white" :style="{ borderTop: `1px solid #D0D5DD` }">
    <div class="px-32 -mt-40">
      <h2 class="text-[#21272A] pb-10" v-show="props.info_title">
        {{ props.info_title }}
      </h2>
      <div class="text-[#475467] text-xl pb-10">
        <p v-for="(val,i) in props.question_title" :key="i" v-html="val"></p>
      </div>
      <div class="text-[#475467]" v-show="is_show_footer">
        (Select <a-button type="primary" class="mx-2">CONTINUE <img :src="right" class="pl-2" /></a-button> at any time to dismiss these directions.)
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import right from '@/assets/images/right.svg'
import { defineProps } from "vue"
const props = defineProps<{
  title: string;
  info_title: string;
  question_title: string[]
  is_show_footer: boolean
}>()
</script>
<style>
  .listen-icon {
    display: inline-block;
    width: 52px;
    height: 48px;
    background: url(@/assets/images/listen-icon.png) no-repeat;
    background-size: cover;
  }
  .nextbtn, .backbtn, .reviewbtn {
    background: #1b8b8c;
    color: white;
    display: inline-block;
    vertical-align: middle;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .nextbtn:after, .backbtn:before, .reviewbtn:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
  }
  .reviewbtn:before {
    background: url(@/assets/images/progress.svg) no-repeat;
    background-size: 100% auto;
    width: 14px;
    height: 18px;
    margin-right: 8px;
    margin-bottom: 4px;
  }
  .nextbtn:after {
    margin-left: 8px;
    margin-bottom: 2px;
    background: url(@/assets/images/right.svg) no-repeat;
    width: 8px;
    height: 14px;
  }
  .backbtn:before {
    transform: rotate(180deg);
    margin-left: 0;
    margin-right: 8px;
    margin-bottom: 2px;
    background: url(@/assets/images/right.svg) no-repeat;
    width: 8px;
    height: 14px;
  }
</style>