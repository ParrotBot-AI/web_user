<template>
  <!-- <div class="left overflow-hidden h-full relative">
    <div class="flex flex-col items-start pl-6 text-white text-center pt-12">
      <span class="text-[30px]">Official 1</span>
      <span class="mt-2">请选择此次模考文章</span>
      <span class="mt-2">{{ `${computedCheckboxId.length}/${2}` }}</span>
    </div>
  </div> -->
  <div class="flex flex-col flex-1 overflow-hidden pt-3">
    <a-checkbox-group v-model:value="checkboxId" class="flex flex-col mr-52">
      <p v-for="v in examModalData.sections[0].questions " :key="v.question_id" class="py-2">
        <a-checkbox class="radius" :value="v.question_id">
          <span class="font-bold pl-2">{{ v.remark }}</span>
        </a-checkbox>
      </p>
    </a-checkbox-group>
    <div class="flex justify-end mr-8">
      <a-button class="mr-4">
        取消
      </a-button>
      <a-button type="primary" class="mr-4" @click="startMockExam">
        确定
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useExamStore } from '@/stores/exam'
import { useRouter } from "vue-router"
import { message } from "ant-design-vue"


const examStore = useExamStore()
const $router = useRouter()
// 存储选中的复选框的id值
const checkboxId = ref([])
const startExamLoading = ref<boolean>(false)
// 跳转到开始考试
const startMockExam = async () => {
  if (checkboxId.value.length !== 0) {
    startExamLoading.value = true
    await examStore.startExam(checkboxId.value)
    startExamLoading.value = false
    $router.push({ name: 'mockExam', query: { id: examStore.examing_data.practice_id } })
  } else {
    message.info('请选择Passage')
  }
}

const examModalData = computed(() => {
  return examStore.getExamModalData(1)
  // return examStore.getExamModalData(checkExamDataId.value!)
})
// 计算选中的checkboxId
const computedCheckboxId = computed(() => {
  if (checkboxId.value.length > 2) {
    checkboxId.value.shift()
  }
  return checkboxId.value
})
</script>

<style scoped>
.left {
  width: 259px;
  border-radius: 8px;
  background: linear-gradient(219deg, #B2DAC8 -0.38%, #18898E 77.62%);
  stroke-width: 1px;
  stroke: var(--color-gray-200);
  filter: drop-shadow(0px 20px 24px rgba(16, 24, 40, 0.08));
}
</style>