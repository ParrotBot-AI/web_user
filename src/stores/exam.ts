import { defineStore } from 'pinia'
import { reactive, computed, ref } from 'vue'
import { request_getExamResource, request_startExam, request_getExam } from '@/service/exam'
import { useIndexStore } from '@/stores/index'
import { getWithExpiry } from "@/utils/storage"
import type { USERINFO } from "@/service/user"
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
    childrenLength: number;
    curIndex: number;
    time_remain: number;
    practice_id: number | null;
    questions: any[];
  }>({
    curQuestionIndex: 0,
    curIndex: 0,
    childrenLength: 0,
    curQuestionChildrenIndex: 0,
    time_remain: 0,
    practice_id: null,
    questions: [],
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
    examing_data.practice_id = res.practice_id;
  }
  const getExamData = async (id: string) => {
    const res = await request_getExam(id)
    examing_data.childrenLength = res.questions.reduce((prev, item) => prev + item.children.length, 0);
    examing_data.curQuestionIndex = 0;
    examing_data.curQuestionChildrenIndex = 0;
    examing_data.time_remain = res.time_remain;
    examing_data.questions = res.questions;
  }
  const changeQuestion = (question: number) => {
    let index = examing_data.curIndex + question;
    const childrenLength = examing_data.childrenLength;
    if (index <= 0) {
      index = 0;
    }
    if (index === childrenLength) {
      index = childrenLength - 1;
    }
    let start = 0;
    let questionIndexRes = 0;
    examing_data.questions.forEach((v, i) => {
      const children = v.children;
      const end = start + children.length;
      if (index >= start && index <= end) {
        questionIndexRes = i;
      }
      start = end;
    })
    examing_data.curIndex = index;
    examing_data.curQuestionIndex = questionIndexRes;
    examing_data.curQuestionChildrenIndex = questionIndexRes > 0 ? index - examing_data.questions.slice(0, questionIndexRes).reduce((prev, item) => prev + item.children.length, 0) : index;
  }
  const curQuestion = computed(() => {
    const value = examing_data.questions[examing_data.curQuestionIndex]
    if (value && value.questions_content && value.children.length > 0) {
      const questionItem = value?.children[examing_data.curQuestionChildrenIndex];
      const ifFill = questionItem?.question_type === 'TR_fill_sentence'
      let i = 0;
      const cur_questions_content = ifFill ? value.questions_content?.replace(/\$\$/g, () => {
        return `<span class="fill-item" data-index="${i++}" data-qid="${value.question_id}">【 <b></b> 】</span>`
      }) : value.questions_content?.replace(/\$\$/g, '')
      return {
        ...value,
        cur_questions_content
      }
    }
    return {
      children: [],
      questions_content: '',
      question_title: '',
    };
  })
  const curQuestionChildren = computed(() => {
    const value = curQuestion.value?.children[examing_data.curQuestionChildrenIndex]
    if (value) {
      return {
        ...value,
        isShowViewText: value.question_type === 'TR_last_mc'
      }
    }
    return null;
  })
  return { getExamResource, exam_data, startExam, getExamModalData, examing_data, changeQuestion, curQuestion, curQuestionChildren, getExamData };
})