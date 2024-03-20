<template>
  <div class="indent-8 pb-4" v-html="curContent">
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, defineProps, onUnmounted } from 'vue'
const props = defineProps<{
  word: string
  onended: () => void
}>()
const content = ref<string[]>([])
const curContent = ref<string>('')
const start = ref(0)
const timer = ref<ReturnType<typeof setInterval> | null>(null)
onMounted(() => {
  content.value = props.word.split(/\n/)
  timer.value = setInterval(() => {
    if(start.value >= content.value.length) {
      clearTimeout(timer.value!)
      props?.onended()
      start.value = 0
      return
    }
    start.value++
    curContent.value = content.value.slice(0, start.value).join('')
  }, 80)
})
onUnmounted(() => {
  clearTimeout(timer.value!)
})
</script>
<style>
  
</style>