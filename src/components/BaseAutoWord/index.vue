<template>
  <div class="h-full w-full overflow-y-auto px-14 text-[#667085] wrod-artial"> 
    <PassageWord :word="val" :onended="onended" v-for="(val,i) in allPassage" :key="i"/>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, computed } from "vue"
import PassageWord from "./children.vue"
const startPassageIndex = ref(1)
const props = defineProps<{
  data: string[]
}>()
const allPassage = computed(() => {
  return props.data.slice(0, startPassageIndex.value)
})
const onended = () => {
  startPassageIndex.value++
}
</script>
<style scoped>
  .wrod-artial >div:nth-child(1){
    text-align: center;
  }
</style>