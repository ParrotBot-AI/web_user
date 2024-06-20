<template>
  <a-spin v-if="loading" size="large" tip="题库加载中..."
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ml-[100px]" />
  <a-layout class="w-full h-full overflow-hidden" v-else>
    <header class="bg-green-2 pt-4 flex flex-col">
      <a-tabs v-model:activeKey="activeKey" @change="onTabChange" class="page-tab">
        <a-tab-pane v-for="v in examStore.exam_data?.pageArr" :tab="`${v.start}-${v.end}`" :key="v.id"></a-tab-pane>
      </a-tabs>
    </header>
    <div class="flex content-start flex-wrap flex-1 overflow-y-auto py-5 px-3 bg-green-2">
      <div v-if="!examStore.exam_data?.list?.length">
        {{ $t('暂无数据') }}
      </div>
      <ExamCard v-else v-for="val in examStore.exam_data?.list" :key="val.resource_id" v-bind="val" />
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { useExamStore } from '@/stores/exam';
import { onMounted, ref } from 'vue';
import ExamCard from "./components/QuestionCard.vue";
const examStore = useExamStore()
const activeKey = ref(0);
const loading = ref(false)
const onTabChange = async (activeKey: number) => {
  await examStore.getExamResource(activeKey)
}
onMounted(async () => {
  try {
    loading.value = true
    await examStore.getExamResource(activeKey.value, true)
  } finally {
    loading.value = false
  }
})


</script>


<style scoped>
:global(.exam-modal) {
  width: 750px !important;
}

:global(.exam-modal .ant-modal-body) {
  padding: 20px 60px;
}

:global(.exam-modal .ant-modal-footer .ant-btn) {
  width: 166px;
  height: 44px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
}

:global(.exam-modal .ant-modal-footer .ant-btn-default) {
  background: var(--color-green-4);
  color: var(--color-green-1);
}

:global(.radius .ant-checkbox) {
  border-radius: 50%;
  overflow: hidden;
}

:global(.radius .ant-checkbox-inner) {
  border-radius: 100%;
}

:global(.page-tab .ant-tabs-top >.ant-tabs-nav) {
  margin: 0;
}

:global(.page-tab .ant-tabs .ant-tabs-tab) {
  padding: 0 15px 12px;
}

:global(.page-tab .ant-tabs-nav) {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
</style>