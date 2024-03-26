<template>
  <div class="fixed right-8 bottom-8 z-50" :style="transformStyle">
    <div class="w-[60px] h-[60px]" @click.stop="onOpen" v-show="!open" ref="modalTitleRef">
      <img :src="aiassistant" alt="logo" class="w-full h-full select-none" :draggable="false" />
    </div>
    <div v-show="open" class="talk-box flex flex-col">
      <header class="w-full flex pl-[34px] pr-4 items-center justify-between h-[42px] bg-white">
        <span class="w-[68px] h-[68px] absolute -left-[34px]">
          <img :src="aiassistant" alt="aiassistant" class="w-full"/>
        </span>
        <h2 class="text-[#475467] text-base font-semibold">{{ $t('鹦鹉AI助教') }}</h2>
        <span class="w-[18px] h-full cursor-pointer flex justify-center items-center" @click="onOpen">
          <b class="w-[14px] h-[3px] bg-[#1B8B8C] rounded-md"></b>
        </span>
      </header>
      <section class="flex-1 overflow-auto px-6 pt-4 tellList bg-[#F0F7F7]" ref="messageContainer">
        
        <div ref="bottom"></div>
      </section>
      <section class="bg-[#F0F7F7] h-[36px] overflow-x-auto overflow-y-hidden flex flex-nowrap items-center over-x px-2">
        <a-button class="h-[24px] shrink-0 text-xs mx-[4px] border-[#B2DAC8] rounded-full" v-for="val in btns" :key="val.title">{{ val.title }}</a-button>
      </section>
      <footer class="flex h-[56px] items-center px-2">
        <a-input 
          class="flex-1 mr-3 h-[36px]" 
          placeholder="输入你想问的问题" 
          v-model:value="val" 
          @keyup.enter="onSend"
        />
        <a-button type="primary" class="h-[36px] flex justify-center items-center" @click="onSend">
          <Icon>
            <template #component>
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="send-01">
                <path id="Icon" d="M9.24537 11.25L17.9954 2.50002M9.35169 11.5234L11.5418 17.1551C11.7347 17.6512 11.8312 17.8993 11.9702 17.9717C12.0907 18.0345 12.2342 18.0345 12.3548 17.9719C12.4939 17.8997 12.5906 17.6517 12.7842 17.1558L18.2761 3.08269C18.4508 2.63504 18.5382 2.41121 18.4904 2.26819C18.4489 2.14398 18.3514 2.04651 18.2272 2.00501C18.0842 1.95723 17.8604 2.04458 17.4127 2.21927L3.33958 7.71122C2.84369 7.90474 2.59574 8.0015 2.52348 8.14059C2.46084 8.26116 2.46093 8.4047 2.52371 8.5252C2.59613 8.66421 2.84419 8.76067 3.34031 8.95361L8.97198 11.1437C9.07269 11.1829 9.12304 11.2024 9.16544 11.2327C9.20302 11.2595 9.23589 11.2924 9.2627 11.3299C9.29294 11.3723 9.31252 11.4227 9.35169 11.5234Z" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
              </svg>
            </template>
          </Icon>
      </a-button>
    </footer>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect, defineProps } from 'vue'
import Icon from '@ant-design/icons-vue';
import aiassistant from '@/assets/images/aiassistant.png'
import { useDraggable } from '@vueuse/core';
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
const modalTitleRef = ref<HTMLElement>();
const { x, y, isDragging } = useDraggable(modalTitleRef);
const startX = ref<number>(0);
const startY = ref<number>(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const open = ref(false);
const val = ref('')
const btns = [{
  title: '错题解析',
}, {
  title: '解题思路',
}, {
  title: '重点信息',
}, {
  title: '段落逻辑',
}, {
  title: '听力逻辑'
}]
watch([x, y], () => {
  if (!startedDrag.value) {
    startX.value = x.value;
    startY.value = y.value;
    const bodyRect = document.body.getBoundingClientRect();
    const titleRect = (modalTitleRef.value as HTMLElement).getBoundingClientRect();
    dragRect.value.right = bodyRect.width - titleRect.width;
    dragRect.value.bottom = bodyRect.height - titleRect.height;
    preTransformX.value = transformX.value;
    preTransformY.value = transformY.value;
  }
  startedDrag.value = true;
});
watchEffect(() => {
  if (startedDrag.value) {
    transformX.value =
      preTransformX.value +
      Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) -
      startX.value;
    transformY.value =
      preTransformY.value +
      Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) -
      startY.value;
  }
});
watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
});

const transformStyle = computed(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});

const onOpen = () => {
  open.value = !open.value
}

const onSend = () => {

}
</script>
<style scoped>
  .talk-box {
    width: 395px;
    border-radius: 8px;
    height: 356px;
    border-left: 1px solid var(--Gray-200, #EAECF0);
    background: var(--Base-White, #FFF);
    box-shadow: 0px 5px 24px 0px rgba(16, 24, 40, 0.20);
    overflow: hidden;
  }
  .over-x::-webkit-scrollbar{
    display: none;
    
  }
</style>