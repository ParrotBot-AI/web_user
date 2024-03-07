<template>
  <div class="w-1/2 px-[10px] py-[5px]" :ref="drag" :style="containerStyle">
    <div 
      class="h-14 overflow-auto pt-2.5 pl-4 cursor-pointer select-bar"
      :class="{
        'selected-bar': props.res.includes(props.type)
      }"
    >
      <p class="text-[14px] text-gray-500" >{{ props.val }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, unref, computed } from 'vue'
import { useDrag } from 'vue3-dnd'
import type {DragSourceMonitor} from "vue3-dnd"
import { toRefs } from '@vueuse/core'
const forbidDrag = computed(() => !props.res.includes(props.type))
const props = defineProps<{
  val: string;
  type: string;
  res: string[];
}>()
const [collect, drag] = useDrag(() => ({
  type: props.type,
  canDrag: forbidDrag.value,
  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
}))
const { isDragging } = toRefs(collect)
const containerStyle = computed(() => ({
  opacity: unref(isDragging) ? 0: 1,
}))

</script>
<style scoped>
  .select-bar {
    position: relative;
    border: 1px solid #1B8B8C;
  }
  .selected-bar {
    border: 1px solid transparent;
  }
  .selected-bar p {
    opacity: 0;
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