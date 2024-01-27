import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { request_getExamResource } from '@/service/exam'
import { useIndexStore } from '@/stores/index'

export const useExamStore = defineStore('exam', () => {
  const exam_data = reactive({
    list: [],
    pageArr: []
  })
  const readId = 22;
  const limit = 20;
  const indexStore = useIndexStore()
  const getExamResource = async () => {
    const res = await request_getExamResource({
      exam_id: 1,
      pattern_id: indexStore.menuData.list.find((item) => item?.id === readId)?.pattern_id!,
      whether_zt: false,
    })
    exam_data.list = res.data
    const total = res.total
    exam_data.pageArr = new Array(Math.ceil(total / limit)).fill(0).map((item, index) => {
      return {
        start: index * limit + 1,
        end: Math.min((index + 1) * limit, total),
        id: index
      }
    })
    return res
  }

  const getExamModalData = (checkExamDataId: number) => {
    return exam_data.list.find((item) => item.resource_id === checkExamDataId)
  }
  return { getExamResource, exam_data, getExamModalData };
})