<template>
  <!--批注-->
  <AnnotationView 
    :data="resultStore.resultData.allData.slice(1)"
    :onViewOrigin="onViewOrigin"
    :onBack="onBack"
  />
  <!--原题-->
  <div>
    
  </div>
</template>
<script lang="ts" setup>
import AnnotationView from './AnnotationView.vue';
import {useResultStore} from "@/stores/result"
const resultStore = useResultStore()
console.log(resultStore.resultData)
const onViewOrigin = () => {
  console.log('查看原题')
}
const onBack = () => {
  resultStore.setShowAnswerHistoryDialog()
}
</script>
<style scoped>
  
</style>