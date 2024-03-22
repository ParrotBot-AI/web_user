<template>
  <div class="absolute right-40 bottom-20 z-50 flex flex-col bg-white shadow-[0px_2px_20px_10px_rgba(0,0,0,0.1)] min-w-52 rounded-xl"
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
      <section class="flex flex-col">
        <template v-if="query.type === 'read'">
        <div v-for="(val,index) in examStore.resultData.questions_r?.questions" :key="i" class="p-2 flex items-center">
            <h4 class="text-[#667085] text-base font-normal">Passage {{val?.order}}</h4>
            <div class="flex pl-3">
              <span 
                v-for="(v,i) in val.children" :key="v.question_id" 
                @click="props.onChangeQues(2,index,i)"
                class="w-5 h-5 mx-1 rounded-full shrink-0 text-[11px] flex justify-center items-center text-[#475467] cursor-pointer border border-solid border-[#475467]" 
                :class="{
                  'bg-[#c22c66] text-[#fff] border-[#c22c66]': !(v.score > 0),
                }"
              >{{i+1}}</span>
            </div>
          </div>
        </template>
        <template v-if="query.type === 'hearing'">
          <div class="b-b-1 pl-[100px] relative" v-for="(sectionNum, sectionIndex) in 2" :key="sectionIndex">
            <h3 class="text-[#333333] font-normal text-base h-full absolute left-0 w-[100px] flex justify-center items-center" :style="{borderRight: '1px solid #B2DAC8'}">Section {{sectionNum}}</h3>
            <div>
              <div v-for="(val,index) in examStore.resultData.questions_r?.questions.slice(sectionIndex*3, sectionIndex*3+3)" :key="index" class="p-2 flex items-center">
                <h4 class="text-[#667085] text-base font-normal w-[120px]">{{ index === 0 ? 'Conversation' : 'Lecture'}} {{index === 0 ? sectionNum : sectionNum === 1 ? val?.order - 1 : val?.order + 2}}</h4>
                <div class="flex pl-3">
                  <span 
                    v-for="(v,i) in val.children" :key="v.question_id" 
                    @click="props.onChangeQues(2,index,i)"
                    class="w-5 h-5 mx-1 rounded-full shrink-0 text-[11px] flex justify-center items-center text-[#475467] cursor-pointer border border-solid border-[#475467]" 
                    :class="{
                      'bg-[#c22c66] text-[#fff] border-[#c22c66]': !(v.score > 0),
                    }"
                  >{{i+1}}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </main>
    <footer class="h-10 flex justify-between items-center px-2">
      <span class="before:content-['<'] before:mr-2 block text-[#1B8B8C] cursor-pointer" @click="props.onChangeQues(-1)">上一题</span>
      <span class="after:content-['>'] after:ml-2 block text-[#1B8B8C] cursor-pointer" @click="props.onChangeQues(1)">下一题</span>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect, defineProps } from 'vue'
import { useRoute } from "vue-router"
import { useDraggable } from '@vueuse/core';
import { useExamStore } from "@/stores/exam"
const props = defineProps<{
  onChangeQues: (type: 1 | -1 | 2, parentIndex?:number, curIndex?: number) => void
}>()
const {query} = useRoute()
const examStore = useExamStore()
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
  .b-b-1 {
    border-bottom: 1px solid #B2DAC8;
  }
  .b-b-1:last-child {
    border-bottom: none;
  }
</style>