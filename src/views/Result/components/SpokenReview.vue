<template>
  <!--原题-->
  <SpokenOrigin 
    v-if="OriginView.open"
    :data="OriginView.data"
    :onExit="onExit"
  />
  <!--批注-->
  <AnnotationView 
    v-else
    :data="resultStore.resultData.allData.slice(1)"
    :onViewOrigin="onViewOrigin"
    :onBack="onBack"
  />
</template>
<script lang="ts" setup>
import { useResultStore } from "@/stores/result";
import { reactive } from 'vue';
import AnnotationView from './AnnotationView.vue';
import SpokenOrigin from './SpokenOriginView.vue';
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