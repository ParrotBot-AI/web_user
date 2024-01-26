<template>
  <a-layout class="w-full h-full overflow-hidden">
    <header class="bg-green-2 px-6 py-4 flex justify-between items-center">
      <div class="font-normal text-2xl text-gray-900 ">
        <ArrowLeftOutlined class="pr-2" @click="onClickToRead" />题库选择
      </div>
    </header>
    <div>
      <!--题目区间-->
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane v-for="v in  totalData " tab="1-20" :key="v.toString()">
          <div class="flex flex-1 overflow-y-auto">
            <!--列表-->
            <div v-for="v in  examStore.exam_data.list " :key="v.resource_id"
              :style="{ height: '184px', width: '550px', marginLeft: '20px', display: 'flex' }">
              <div class="left" :style="{ backgroundColor: '#DAF5E9', width: '256px' }">
                <p>REPORT</p>
                <p>Official 1</p>
                <div :style="{ display: 'flex' }">
                  <a-button @click="showExamModal(v.resource_id)">模考</a-button>
                  <a-button @click="showExamModal(v.resource_id)">练习</a-button>
                </div>
              </div>
              <div class="right" :style="{ display: 'flex', flexDirection: 'column', flex: 1 }">
                <div v-for="v in 3" :key="v" :style="{ height: '180px', marginBottom: '4px', border: '1px solid' }">
                  <span>Paragraph1</span>
                  <span>未完成</span>
                  <span>icon1</span>
                  <span>icon2</span>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-layout>
  <a-modal class="exam-modal" v-model:open="open" :cancelText="'返回'" :okText="'进入模拟考试'" @ok="startMockExam">
    <h1>{{ examModalData.resource_name }}</h1>
    <p v-for=" v  in  examModalData.sections[0].questions " :key="v.question_id">
      <a-checkbox class="radius" :value="v.question_id" @change="getQuestionId"></a-checkbox>
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
import { ref, reactive } from 'vue';
import type { CheckboxChangeEvent } from "ant-design-vue/es/_util/EventInterface";
const open = ref<boolean>(false);
const checkExamDataId = ref<number | null>(null)
const totalData = ref<number | null>(null)
const $router = useRouter()
const examStore = useExamStore()
const activeKey = ref('1');
// 存储选中的复选框的id值
const checkboxId = reactive<Array<string | number>>([])
onMounted(async () => {
  const all_data = await examStore.getExamResource()
  const { total } = all_data
  totalData.value = Math.ceil(total / 20)
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
  // return examStore.exam_data.list.find((item) => item.resource_id === checkExamDataId.value)
})

// 跳转到开始考试
const startMockExam = () => {
  if (checkboxId.length !== 0) {
    checkboxId.push(checkExamDataId.value as number)
    $router.push({ name: 'mockExam', params: { arrayParam: checkboxId.join(',') } })
  }
}
// 获取复选框的id值
const getQuestionId = (e: CheckboxChangeEvent) => {
  const { value } = e.target as HTMLInputElement
  checkboxId.push(value)
}

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