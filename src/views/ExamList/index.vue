<template>
  <a-layout class="w-full h-full overflow-hidden">
    <header class="bg-green-2 pt-4 flex flex-col">
      <div class="font-normal text-2xl text-gray-900 px-6 pb-3">
        <ArrowLeftOutlined class="pr-2" @click="onClickToRead" />题库选择
      </div>
      <!--题目区间-->
      <a-tabs v-model:activeKey="activeKey" @change="onTabChange" class="page-tab">
        <a-tab-pane v-for="v in examStore.exam_data.pageArr" :tab="`${v.start}-${v.end}`" :key="v.id"></a-tab-pane>
      </a-tabs>
    </header>
    <div class="flex content-start flex-wrap flex-1 overflow-y-auto py-5 px-3 bg-green-2">
      <ExamCard v-for="val in examStore.exam_data.list" :key="val.resource_id" v-bind="val" />
    </div>
  </a-layout>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
import { onMounted } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useExamStore } from '@/stores/exam'
import { ref } from 'vue';
import ExamCard from "./components/ExamCart.vue"
const $router = useRouter()
const examStore = useExamStore()
const activeKey = ref(0);
const onTabChange = async (activeKey:number) => {
  await examStore.getExamResource(activeKey)
}
onMounted(async () => {
  await examStore.getExamResource(activeKey.value)
})
const onClickToRead = () => {
  $router.push("/read")
}

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

.page-tab :global(.ant-tabs-top >.ant-tabs-nav) {
  margin: 0;
}

.page-tab :global(.ant-tabs .ant-tabs-tab) {
  padding: 0 15px 12px;
}

.page-tab :global(.ant-tabs-nav) {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
</style>