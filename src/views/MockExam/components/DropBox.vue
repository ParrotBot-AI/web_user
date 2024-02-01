<template>
  <div class="w-full h-14 border border-green-1 border-solid mb-1.5" :ref="drop"></div>
</template>
<script setup lang="ts">
import { useDrop, DropTargetMonitor } from 'vue3-dnd'
import { defineProps, toRefs } from 'vue'
const props = defineProps<{
  onDrop: (item: any) => void
  lastDroppedColor?: string
}>()
const [collect, drop] = useDrop(() => ({
  accept: ['A','B','C','D','E','F'],
  drop(_item, monitor) {
    console.log(monitor.getItemType())
    // props.onDrop(monitor.getItemType())
    return undefined
  },
  collect: (monitor: DropTargetMonitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggingColor: monitor.getItemType() as string,
  }),
}))
const { isOver, draggingColor, canDrop } = toRefs(collect)
</script>
