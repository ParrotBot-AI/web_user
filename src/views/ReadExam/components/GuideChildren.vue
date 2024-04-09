<template>
<a-layout class="w-full h-full flex flex-col" :class="props.class">
    <b-header :title="props.navTitle">
      <template #right>
        <div class="flex">
          <HeaderBtn v-for="val in Object.keys(HeaderBtnsConfig)" v-bind="HeaderBtnsConfig[val]" :key="val" />
        </div>
      </template>
    </b-header>
    <BaseGuide v-bind="props.guideData" /> 
</a-layout>
</template>
<script setup lang="ts">
import BaseGuide from '@/components/BaseGuide/index.vue';
import { defineProps, reactive } from 'vue';
import type { HeaderBtnProps } from "./HeaderBtn.vue";
import HeaderBtn from "./HeaderBtn.vue";
const props = defineProps<{
  isGuide: boolean;
  class?: string;
  navTitle: string;
  continueClick: () => void;
  guideData: {
    title: string;
    info_title: string;
    is_show_footer: boolean;
    question_title: string[]
  }
}>()
const HeaderBtnsConfig = reactive<{
  [k in string]: HeaderBtnProps
}>({
  continue: {
    title: 'CONTINUE',
    id: 'continue',
    disabled: false,
    isShow: true,
    onClick: () => {
      props?.continueClick()
    }
  },
})
</script>
<style scoped>
  
</style>