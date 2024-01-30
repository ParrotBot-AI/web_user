import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { request_getExamResource, request_startExam } from '@/service/exam'
import { useIndexStore } from '@/stores/index'
import { getWithExpiry } from "@/utils/storage"
import type {USERINFO} from "@/service/user"
export const useExamStore = defineStore('exam', () => {
  const exam_data = reactive<{
    list: any[];
    pageArr: { start: number; end: number; id: number; }[];
  }>({
    list: [],
    pageArr: []
  })
  const examing_data = reactive<{
    curQuestionIndex: number; // 答题下标
    curQuestionChildrenIndex: number;
    time_remain: number;
    practice_id: number | null;
    questions: any[];
    curQuestionChildren: {},
    curQuestion: {
      question_title: string;
      questions_content: string;
    }
  }>({
    curQuestionIndex: 0,
    curQuestionChildrenIndex: 0,
    curQuestionChildren: {},
    time_remain: 0,
    practice_id: null,
    questions: [],
    curQuestion: {
      question_title: '',
      questions_content: ''
    }
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
  const startExam = async (question_ids: number[]) => {
    const { userId } = getWithExpiry<USERINFO>('userinfo')!
    const res = await request_startExam({
      user_id: userId,
      question_ids
    })
    examing_data.curQuestionIndex = 0;
    examing_data.curQuestionChildrenIndex = 0;
    examing_data.time_remain = res.time_remain;
    examing_data.practice_id = res.practice_id;
    examing_data.questions = res.questions;
    examing_data.curQuestion = res.questions[examing_data.curQuestionIndex];
    examing_data.curQuestionChildren = res.questions[examing_data.curQuestionIndex].children[examing_data.curQuestionChildrenIndex];
  }
  return { getExamResource, exam_data, startExam, getExamModalData, examing_data };
})