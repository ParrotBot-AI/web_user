<template>
  <a-layout class="w-full h-full overflow-hidden">
    <header class="bg-green-2 pt-4 flex flex-col">
      <div class="font-normal text-2xl text-gray-900 px-6">
        <ArrowLeftOutlined class="pr-2" @click="onClickToRead" />题库选择
      </div>
      <!--题目区间-->
      <a-tabs v-model:activeKey="activeKey" class="page-tab">
        <a-tab-pane v-for="v in examStore.exam_data.pageArr" :tab="`${v.start}-${v.end}`" :key="v.id"></a-tab-pane>
      </a-tabs>
    </header>
    <div class="flex content-start flex-wrap flex-1 overflow-y-auto py-5 px-3 bg-green-2">
      <ExamCard v-for="val in examStore.exam_data.list" :key="val.resource_id" v-bind="val"
        @showExamModal="showExamModal" />
    </div>
  </a-layout>
  <a-modal 
    class="exam-modal" 
    v-model:open="open" 
    :cancelText="'返回'" 
    :okText="'进入模拟考试'" 
    :okButtonProps="{
      loading: startExamLoading
    }"
    @ok="startMockExam" 
    :closable="false"
  >
    <h1 class="text-[18px] font-bold pb-4">{{ examModalData.resource_name }}</h1>
    <a-checkbox-group v-model:value="checkboxId">
      <p v-for="v in examModalData.sections[0].questions " :key="v.question_id" class="py-2">
        <a-checkbox class="radius" :value="v.question_id">
          <span class="font-bold pl-2">{{ v.remark }}</span>
          <span class="pl-2">{{ v.question_name }}</span>
        </a-checkbox>
      </p>
    </a-checkbox-group>
  </a-modal>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
import { onMounted, computed } from 'vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useExamStore } from '@/stores/exam'
import { ref } from 'vue';
import ExamCard from "./components/ExamCart.vue"
import { message } from "ant-design-vue"
const open = ref<boolean>(false);
const checkExamDataId = ref<number | null>(null)
const startExamLoading = ref<boolean>(false)
const $router = useRouter()
const examStore = useExamStore()
const activeKey = ref(0);
// 存储选中的复选框的id值
const checkboxId = ref([])
onMounted(async () => {
  await examStore.getExamResource()
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
  return examStore.getExamModalData(checkExamDataId.value!)
})

// 跳转到开始考试
const startMockExam = async () => {
  if (checkboxId.value.length !== 0) {
    startExamLoading.value = true
    await examStore.startExam(checkboxId.value)
    startExamLoading.value = false
    $router.push({ name: 'mockExam', query: { id: examStore.examing_data.practice_id} })
  } else {
    message.info('请选择Passage')
  }
}

</script>


<style scoped>
:global(.exam-modal) {
  width: 750px!important;
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
  padding: 12px 15px;
}

.page-tab :global(.ant-tabs-nav) {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
</style>