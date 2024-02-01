<template>
  <div 
    class="w-full h-14 border border-green-1 border-solid mb-1.5" 
    :ref="drop"
    :style="style"
  >
    <p v-if="typevalue" class="text-gray-500 pt-3 px-4">{{ typevalue }}</p>
  </div>
</template>
<script setup lang="ts">
import { useDrop } from 'vue3-dnd'
import type { DropTargetMonitor } from 'vue3-dnd'
import { toRefs } from '@vueuse/core'
import { computed, defineProps, unref, ref} from 'vue'
const typevalue = ref<string>('')
const props = defineProps<{
  onDrop: (item: any) => void,
  index: number,
  resource: string,
}>()
const [collect, drop] = useDrop(() => ({
  accept: ['A','B','C','D','E','F'],
  drop(_item, monitor) {
    props.onDrop({
      type: monitor.getItemType(),
      index: props.index,
    })
    typevalue.value = props.resource[monitor.getItemType()]
    return undefined
  },
  collect: (monitor: DropTargetMonitor) => {
    return {
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }
  },
}))
const { isOver, canDrop } = toRefs(collect)
const style = computed(() => {
  return unref(isOver) ? {
    backgroundColor: 'rgba(27, 139, 140, 0.05)',
    border: '1px dashed #1B8B8C',
  } : {}
})
</script>
