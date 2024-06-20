<template>
<div class="flex justify-between items-center bg-green-2 w-full h-[50px]">
  <div class="w-2/3 flex">
    <a-button 
        type="primary" 
        :key="i"
        class="w-[80px] h-[34px] mx-1.5 text-[16px] flex items-center justify-center"
        v-for="(val,i) in props.bt_name"
        @click="onClick(val)"
    >
        <span>{{ $t(val) }} </span>
    </a-button>
  </div>
  <div class="flex w-1/3 justify-center items-center cursor-pointer " @click="onShowWordClick">
    <span class="text-[#1B8B8C] text-[12px] font-bold pl-1">{{showTimer ? 'Hide' : 'Show'}} Word Count <span class="text-[#000000] text-[16px] pl-1 font-normal" :class="{hidden:!showTimer}">{{ textValue.split(/\s/g).filter(val => val).length }}</span></span>
  </div>
</div>
<div class="flex-1 overflow-hidden pb-3 py-1 px-1">
  <textarea 
    ref="textAreaEl"
    class="w-full h-full border-none resize-none outline-[#edf6f6] text-base" 
    v-model="textValue"
  />
  <!-- <textarea 
    ref="textAreaEl"
    class="w-full h-full border-none resize-none outline-[#edf6f6] text-base" 
    @copy="$event.preventDefault()" 
    @paste="$event.preventDefault()"
    v-model="textValue"
  /> -->
</div>  
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import copy from "copy-to-clipboard"
const showTimer = ref(true)
const textAreaEl= ref<null | HTMLTextAreaElement>(null)
const textValue = ref('')
export type WritingBtnProps = {
  bt_name: string[]
  onChange: (content:string) => void
}
function insertAtCursor(myField:HTMLTextAreaElement , myValue:string) {
  if (myField.selectionStart || myField.selectionStart === 0) {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    textValue.value = myField.value.substring(0, startPos)
      + myValue
      + myField.value.substring(endPos, myField.value.length);
  } else {
    textValue.value += myValue;
  }
}
const onClick = async (val:string) => {
  const startPos = textAreaEl.value!.selectionStart
  const endPos = textAreaEl.value!.selectionEnd
  const selectedText = textAreaEl.value!.value.substring(startPos, endPos)
  if(val === 'Copy'){
    copy(selectedText)
  } else if(val === 'Cut'){
    copy(selectedText)
    textValue.value = textAreaEl.value!.value.substring(0, startPos) + textAreaEl.value!.value.substring(endPos)
  } else if(val === 'Paste'){
    const selectedText =  await navigator.clipboard.readText()
    insertAtCursor(textAreaEl.value!, selectedText)
  }
  textAreaEl.value?.focus()
}
const props = defineProps<WritingBtnProps>()
const onShowWordClick = () => {
  showTimer.value = !showTimer.value
}

watch(() => textValue.value, () => {
  props.onChange(textValue.value)
})

</script>

<style>
</style>