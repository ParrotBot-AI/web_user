<template>
  <a-layout class="w-full h-full overflow-hidden">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 ">
        <ArrowLeftOutlined class="pr-2" @click="onClickToRead" />题库选择
      </div>
    </header>
    <div>
      <!--题目区间-->
    </div>
    <div class="flex-1 overflow-y-auto">
      <!--列表-->
      <div v-for="v in examStore.exam_data.list" :key="v.resource_id">
        <a-button @click="showExamModal(v.resource_id)">模考</a-button>
      </div>
    </div>
  </a-layout>
  <a-modal class="exam-modal" v-model:open="open" :cancelText="'返回'" :okText="'进入模拟考试'">
    <h1>{{ examModalData.resource_name }}</h1>
    <p v-for="v in examModalData.sections[0].questions" :key="v.question_id">
      <a-checkbox class="radius"></a-checkbox>
      <span>{{ v.remark }}</span>
      <span>{{ v.question_name }}</span>
    </p>
  </a-modal>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
import { onMounted, computed } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useExamStore } from '@/stores/exam'
import { ref } from 'vue';
const open = ref<boolean>(false);
const checkExamDataId = ref<number | null>(null)
const $router = useRouter()
const examStore = useExamStore()
onMounted(() => {
  examStore.getExamResource()
})
const onClickToRead = () => {
  $router.push("/read")
}
const showExamModal = (id: number) => {
  checkExamDataId.value = id
  // 弹框
  open.value = true;
}

const examModalData = computed(() => {
  return examStore.exam_data.list.find((item) => item.resource_id === checkExamDataId.value)
})
</script>


<style scoped>
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

:global(.radius .ant-checkbox-inner) {
  border-radius: 100%;
}
</style>