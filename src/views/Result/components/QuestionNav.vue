<template>
  <div class="absolute w-1/4 right-40 bottom-20 z-50 flex flex-col bg-white shadow-2xl"
    :style="transformStyle">
    <header class="h-10 flex justify-between items-center pl-4 pr-2 cursor-move border-solid border-[#B2DAC8] border-x-0 border-t-0 border-[1px]" ref="modalTitleRef">
      <span class="text-[#475467]">快速导航</span>
      <span class="size-icon cursor-pointer" @click="isMax = !isMax" :class="{
        min: !isMax,
        max: isMax
      }"></span>
    </header>
    <main class="flex-1 flex flex-col before:content-[''] border-solid border-[#B2DAC8] border-x-0 border-t-0 border-[1px]" :class="{
      hidden: isMax
    }">
      <section class="flex justify-between items-center pl-6 pr-2 my-4">
        <span>Passage</span>
        <section class="flex">
          <span v-for="(val, i) in isAnswerMistake.length" :key="i"
            class="flex w-[20px] h-[20px] border-solid border-[1px] rounded-xl mr-1 justify-center items-center text-xs"
            :style="{ backgroundColor: val ? '#C33473' : '', borderColor: val ? '#C33473' : '', color: val ? 'white' : 'black' }">{{
        i }}</span>
        </section>
      </section>
    </main>
    <footer class="h-10 flex justify-between items-center px-2">
      <span class="before:content-['<'] before:mr-2 block text-[#1B8B8C] cursor-pointer">上一题</span>
      <span class="after:content-['>'] after:ml-2 block text-[#1B8B8C] cursor-pointer">下一题</span>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect } from 'vue'
import { useExamStore } from '@/stores/exam'
import { useDraggable } from '@vueuse/core';
const modalTitleRef = ref<HTMLElement>();
const { x, y, isDragging } = useDraggable(modalTitleRef);
const startX = ref<number>(0);
const startY = ref<number>(0);
const startedDrag = ref(false);
const transformX = ref(0);
const transformY = ref(0);
const preTransformX = ref(0);
const preTransformY = ref(0);
const isMax = ref(false);
const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
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
watch(isDragging, () => {
  if (!isDragging) {
    startedDrag.value = false;
  }
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
const isAnswerMistake = computed(() => {
  return true
})
const transformStyle = computed(() => {
  return {
    transform: `translate(${transformX.value}px, ${transformY.value}px)`,
  };
});
</script>
<style scoped>
  .size-icon {
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .size-icon.min {
    background-image: url('@/assets/homeIcon/minification.svg');
  }
  .size-icon.max {
    background-image: url('@/assets/homeIcon/max.svg');
  }
</style>