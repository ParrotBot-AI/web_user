import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { request_getExamResource } from '@/service/exam'
import { useIndexStore } from '@/stores/index'

export const useExamStore = defineStore('exam', () => {
  const exam_data = reactive({
    list: []
  })
  const indexStore = useIndexStore()
  const getExamResource = async () => {
    const res = await request_getExamResource({
      exam_id: 1,
      pattern_id: indexStore.menuData.list.find((item) => item?.id === 22)?.pattern_id!,
      whether_zt: false,
    })
    console.log("res |", res);
    exam_data.list = res.data
    console.log('exam_data: ', exam_data);
  }

  const getExamModalData = (checkExamDataId: number) => {
    return exam_data.list.find((item) => item.resource_id === checkExamDataId)
  }
  return { getExamResource, exam_data, getExamModalData };
})