<template>
  <div class="mb-3 overflow-hidden" :class="{
    'left-msg': props.type === 'receive',
    'right-msg': props.type === 'send'
  }">
    <h2 class="text-[#344054] font-normal text-[14px] pb-1">{{ props.name }}</h2>
    <template v-if="!props.isEnd">
      <p class="py-[10px] px-[14px] items-center text-base mt-2 inline-block" v-if="props.type === 'send'">
        {{ allPassage }}
      </p>
      <p class="py-[10px] px-[14px] items-center text-base mt-2 inline-block" v-else>
        <PassageWord :word="val" :onended="onended" v-for="(val,i) in allPassage" :key="i"/>
      </p>
    </template>
    <template v-else>
      <p class="py-[10px] px-[14px] items-center text-base mt-2 inline-block">
        {{ props.type === 'send' ? allPassage : allPassage.join('').replaceAll('\n', '')}}
      </p>
    </template>
  </div>
</template>
<script setup lang="ts">
import PassageWord from "@/components/BaseAutoWord/children.vue";
import { useAIStore } from "@/stores/ai";
import { computed, defineProps, onMounted, ref } from 'vue';
const startPassageIndex = ref(1)
const aiStore = useAIStore()
const props = defineProps<{
  content: string[] | string
  type: 'receive' | 'send'
  name: string
  isEnd: boolean
  id: string | number
  onAllEnd: () => void
}>()
onMounted(() => {
  startPassageIndex.value = 1
})
const allPassage = computed(() => {
  return props.type === 'receive' && !props.isEnd ? props.content.slice(0, startPassageIndex.value) : props.content
})
const onended = () => {
  startPassageIndex.value++
  if(startPassageIndex.value > props.content.length) {
    aiStore.setIsEnd(props.id)
    props?.onAllEnd()
  }
}

</script>
<style scoped>
  
</style>