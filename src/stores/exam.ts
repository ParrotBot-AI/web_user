import { defineStore } from 'pinia'
import { reactive, computed, ref } from 'vue'
import { request_getAccount_id } from '@/service/user' 
import type {EXAN_START} from "@/service/exam"
import {useRoute} from "vue-router"
import {
  request_getExamResource,
  request_startExam,
  request_getExam,
  request_saveAnswer,
  request_getExamStutas,
  request_submitExam
} from '@/service/exam'
import { useIndexStore } from '@/stores/index'
import { getWithExpiry } from "@/utils/storage"
import type { USERINFO } from "@/service/user"
export const useExamStore = defineStore('exam', () => {
  const showProcessDialog = ref(false)
  const route = useRoute()
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
    sheet_id: number | null;
    questions: any[];
  }>({
    curQuestionIndex: 0,
    curIndex: 0,
    childrenLength: 0,
    curQuestionChildrenIndex: 0,
    time_remain: 0,
    sheet_id: null,
    questions: [],
  })
  const processData = reactive<any[]>([])
  const readId = 22; // 阅读id
  const limit = 20;
  const indexStore = useIndexStore()
  const getExamResource = async (page: number) => {
    const res = await request_getExamResource({
      exam_id: 1,
      pattern_id: indexStore.menuData.list.find((item) => Number(item?.id) === readId)?.pattern_id!,
      limit,
      page: page + 1,
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
  const startExam = async (q_type:EXAN_START['q_type'], question_ids: number[]) => {
    const { userId } = getWithExpiry<USERINFO>('userinfo')!
    const {account_id} = await request_getAccount_id(userId, { exam_id: 1 })
    const res = await request_startExam({
      q_type,
      question_ids,
      account_id,
    })
    examing_data.sheet_id = res.sheet_id;
  }
  const getExamData = async (id: string) => {
    const res = await request_getExam(id)
    examing_data.childrenLength = res.questions.reduce((prev: number, item: any) => prev + item.children.length, 0);
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
  const isExamEnding = computed(() => {
    return examing_data.curIndex === (examing_data.childrenLength - 1)
  })
  const curQuestion = computed(() => {
    const value = examing_data.questions[examing_data.curQuestionIndex]
    console.log(value)
    if (value && value.question_content && value.children.length > 0) {
      let i = 0;
      const cur_questions_content = value.question_content?.replace(/\$\$/g, () => {
        return `<span class="fill-item" data-index="${i++}" data-qid="${value.question_id}">【 <b></b> 】</span>`
      }) 
      return {
        ...value,
        cur_questions_content: cur_questions_content.split(/\\n/),
      }
    }
    return {
      children: [],
      question_content: '',
      question_title: '',
      cur_questions_content: ''
    };
  })
  const curQuestionChildren = computed(() => {
    const value = curQuestion.value?.children[examing_data.curQuestionChildrenIndex]
    if (value) {
      return {
        ...value,
        isShowViewText: value.question_type === 'Toefl_Reading_mc'
      }
    }
    return null;
  })

  const saveQuestion = async (question_id: number, answer: number[]) => {
    await request_saveAnswer({
      sheet_id: route.query.id as string,
      question_id,
      answer,
      duration: 0
    })
  }
  const setShowProcessDialog = () => {
    showProcessDialog.value = !showProcessDialog.value
  }
  const getExamProcess = async (id: string) => {
    const res = await request_getExamStutas(id)
    processData.length = 0
    processData.push(...res)
  }

  const requestSubmitExam = async (practice_id: string) => {
    await request_submitExam(practice_id)
  }

  return { getExamProcess, processData, setShowProcessDialog, showProcessDialog, getExamResource, exam_data, startExam, examing_data, changeQuestion, curQuestion, curQuestionChildren, getExamData, saveQuestion, isExamEnding, requestSubmitExam };
})