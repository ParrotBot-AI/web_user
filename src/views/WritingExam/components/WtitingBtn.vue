<template>
<div class="flex justify-center items-center bg-green-2 w-full h-[74px]">
    <div class="w-2/3 flex justify-center items-center ">
     <a-button 
        type="primary" 
        class="w-[100px] h-[40px] mx-1.5 text-[16px] flex items-center justify-center"
        v-for="(val,i) in props.bt_name"
        @click="onClick"
     >
         <span>{{ $t(val) }} </span>
     </a-button>
    </div>
    <div class="flex w-1/3 justify-center items-center cursor-pointer " @click="onClick">
      <img :src="showTimer ? hideEye : openEye" alt="hide-eye" class="w-[20px] h-full" />
      <span class="text-[#1B8B8C] text-[12px] font-bold pl-1">Hide Word Count <span class="text-[#000000] text-[16px] pl-1 font-normal">{{ props.word_number }}</span></span>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import openEye from '@/assets/images/open-eye.svg'
import hideEye from '@/assets/images/hide-eye.svg'
const showTimer = ref(true)
export type WritingBtnProps = {
  bt_name: string[]
  word_number: number;
  onClick?: () => void;
}

const props = defineProps<WritingBtnProps>()
const onClick = () => {
  showTimer.value = !showTimer.value
}
</script>

<style>
</style>