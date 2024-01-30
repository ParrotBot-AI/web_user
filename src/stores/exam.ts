import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { request_getExamResource, request_startExam } from '@/service/exam'
import { useIndexStore } from '@/stores/index'
import { getWithExpiry } from "@/utils/storage"
import type {USERINFO} from "@/utils/http"
export const useExamStore = defineStore('exam', () => {
  const exam_data = reactive<{
    list: any[];
    pageArr: { start: number; end: number; id: number; }[];
  }>({
    list: [],
    pageArr: []
  })
  const readId = 22;
  const limit = 20;
  const indexStore = useIndexStore()
  const getExamResource = async () => {
    const res = await request_getExamResource({
      exam_id: 1,
      pattern_id: indexStore.menuData.list.find((item) => Number(item?.id) === readId)?.pattern_id!,
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
  const startExam = (question_ids: number[]) => {
    const { userId } = getWithExpiry('userinfo') as USERINFO
    return request_startExam({
      user_id: userId,
      question_ids
    })
  }
  return { getExamResource, exam_data, startExam, getExamModalData };
})