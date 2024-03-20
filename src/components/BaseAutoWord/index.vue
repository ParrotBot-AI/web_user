<template>
  <div class="h-full w-full overflow-y-auto"> 
    <PassageWord :word="curPassage" :onended="onended" v-for="(val,i) in allPassage" :key="i"/>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, computed } from "vue"
import PassageWord from "./children.vue"
const startPassageIndex = ref(0)
const props = defineProps<{
  data: string[]
}>()
const allPassage = computed(() => props.data.slice(0, startPassageIndex.value))
const curPassage = computed(() => {
  console.log(props.data)
  return props.data[startPassageIndex.value]
})
const onended = () => {
  if(startPassageIndex.value >= props.data.length) return
  startPassageIndex.value++
}
</script>
<style scoped>
  
</style>