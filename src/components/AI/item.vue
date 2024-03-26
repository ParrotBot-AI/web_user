<template>
  <div class="mb-3 overflow-hidden" :class="{
    'left-msg': props.type === 'receive',
    'right-msg': props.type === 'send'
  }">
    <h2 class="text-[#344054] font-normal text-[14px] pb-1">{{ props.name }}</h2>
    <p class="py-[10px] px-[14px] items-center text-base mt-2 inline-block" v-if="props.type === 'send'">
      {{ allPassage }}
    </p>
    <p class="py-[10px] px-[14px] items-center text-base mt-2 inline-block" v-else>
      <PassageWord :word="val" :onended="onended" v-for="(val,i) in allPassage" :key="i"/>
    </p>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed, ref, onMounted } from 'vue'
import PassageWord from "@/components/BaseAutoWord/children.vue"
const startPassageIndex = ref(1)
const props = defineProps<{
  content: string[] | string
  type: 'receive' | 'send'
  name: string
}>()
onMounted(() => {
  startPassageIndex.value = 1
})
const allPassage = computed(() => {
  return props.type === 'receive' ? props.content.slice(0, startPassageIndex.value) : props.content
})
const onended = () => {
  startPassageIndex.value++
}

</script>
<style scoped>
  
</style>