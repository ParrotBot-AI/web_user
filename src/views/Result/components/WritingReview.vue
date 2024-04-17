<template>
  <!--原题-->
  <WritingOriginView 
    v-if="OriginView.open"
    :data="OriginView.data"
    :onExit="onExit"
    :onBack="onBack"
  />
   <!--批注-->
   <AnnotationView 
    v-else
    :data="resultStore.resultData.AnnotationData"
    :onViewOrigin="onViewOrigin"
    :onBack="onBack"
  />
</template>
<script lang="ts" setup>
import { useResultStore } from "@/stores/result";
import { reactive } from 'vue';
import AnnotationView from './AnnotationView.vue';
import WritingOriginView from './WritingOriginView.vue';
const resultStore = useResultStore()
const OriginView = reactive({
  open: false,
  data: {}
})
const onViewOrigin = (data:any) => {
  OriginView.open = true
  OriginView.data = data
}
const onBack = () => {
  resultStore.setShowAnswerHistoryDialog()
}
const onExit = () => {
  OriginView.open = false
  OriginView.data = {}
}
</script>
<style scoped>
  
</style>