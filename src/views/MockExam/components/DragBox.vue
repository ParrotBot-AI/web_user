<template>
  <div class="w-1/2 px-[10px] py-[5px]" :ref="drag">
    <div class="h-14 overflow-auto border border-green-1 border-solid pt-2.5 pl-4 cursor-pointer select-bar">
      <p class="text-[14px] text-gray-500">{{ props.val }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, toRefs } from 'vue'
import { useDrag } from 'vue3-dnd'
import type {DragSourceMonitor} from "vue3-dnd"
const forbidDrag = ref(false)
const props = defineProps<{
  val: string;
  type: string;
}>()
const [collect, drag] = useDrag(() => ({
  type: props.type,
  canDrag: !forbidDrag.value,
  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
}))
const { isDragging } = toRefs(collect)
</script>
<style scoped>
  .select-bar {
    position: relative;
  }
  .select-bar:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
    height: 100%;
    background: url('@/assets/images/select.png') no-repeat;
    background-size: 100% 100%;
  }
</style>