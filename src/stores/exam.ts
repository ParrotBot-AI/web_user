import { defineStore } from 'pinia'
import { reactive, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { request_getAccount_id } from '@/service/user' 
import type {EXAN_START} from "@/service/exam"
import {
  request_getExamResource,
  request_startExam,
  request_get_result,
  request_getExam,
  request_saveAnswer,
  request_getExamStutas,
  request_submitExam,
  request_computed_score
} from '@/service/exam'
import { getWithExpiry } from "@/utils/storage"
import type { USERINFO } from "@/service/user"
type ANSWER_STATUS = {
  is_answer: boolean;
  question_id: number;
  answer: number[];
}
export const useExamStore = defineStore('exam', () => {
  const showProcessDialog = ref(false)
  const $route = useRoute()
  const $router = useRouter()
  const exam_data = reactive<{
    list: any[];
    pageArr: { start: number; end: number; id: number; }[];
  }>({
    list: [],
    pageArr: [{start: 1, end: 20, id: 0}]
  })
  const examing_data = reactive<{
    curQuestionIndex: number; // 答题下标
    curQuestionChildrenIndex: number;
    childrenLength: number;
    curIndex: number;
    time_remain: number;
    sheet_id: string;
    questions: any[];
    answerData: ANSWER_STATUS[]
  }>({
    curQuestionIndex: 0,
    curIndex: 0,
    childrenLength: 0,
    curQuestionChildrenIndex: 0,
    time_remain: 0,
    sheet_id: '0',
    questions: [],
    answerData: []
  })

  const resultData = reactive<{
    aiComment: string;
    questions: {
      title: string;
      total: number;
      correct: number;
    }[];
    mockScoreTotal: number;
    mockScore: number;
    basisScoreTotal: number;
    basisScore: number;
    intensifyScoreTotal: number;
    intensifyScore: number;
    summarySourceTotal: number;
    summarySource: number
  }>({
    aiComment: '在使用鹦鹉智学时，您可以随时与AI助教交流。我们深知托福学习的困难与沮丧。所以她不仅是一个经验丰富的托福老师，更是一个可以给您情绪价值的好友，帮您排解托福学习的压力。',
    questions: [
      {
        title: '细节题',
        total: 3,
        correct: 2,
      },
      {
        title: '排除题',
        total: 3,
        correct: 2,
      }
    ],
    mockScoreTotal: 0,
    mockScore: 0,
    basisScoreTotal: 0,
    basisScore: 0,
    intensifyScoreTotal: 0,
    intensifyScore: 0,
    summarySourceTotal: 0,
    summarySource: 0,
  })
  const processData = reactive<any[]>([])
  const limit = 20;
  const getExamResource = async (page: number) => {
    const res = await request_getExamResource({
      exam_id: 1,
      pattern_id: $route.params.patternId as string,
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
  /**
   * [startExam 开始考试 获取sheet_id]
   */
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
  /**
   * [getExamData 考试或者练习页面根据 sheet_id 获取试题数据]
   *
   */
  const getExamData = async (id: string) => {
    const [res, answerRes] = await Promise.all([request_getExam(id), request_getExamStutas(id)])
    examing_data.answerData = answerRes.map(val => ({
      is_answer: val.is_answer,
      question_id: val.question_id,
      answer: val.answer
    }));
    examing_data.sheet_id = res.sheet_id;
    examing_data.childrenLength = res.questions.reduce((prev: number, item: any) => prev + item.children.length, 0);
    examing_data.curQuestionIndex = 0;
    examing_data.curQuestionChildrenIndex = 0;
    examing_data.time_remain = res.time_remain;
    examing_data.questions = res.questions;
  }
  /**
   * [changeQuestion 点击上一步下一步]
   *
   */
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
    if (value && value.question_content && value.children.length > 0) {
      let i = 0;
      const cur_questions_content = value.question_content?.replace(/\$\$/g, () => {
        return `<span class="fill-item" data-index="${i++}">【 <b></b> 】</span>`
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
    const answerIndex = examing_data.answerData.findIndex((item) => item.question_id === question_id)
    examing_data.answerData[answerIndex] = {
      question_id,
      is_answer: true,
      answer
    }
    await request_saveAnswer({
      sheet_id: examing_data.sheet_id!,
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

  const requestSubmitExam = async (sheet_id: string) => {
    await request_submitExam(sheet_id)
    await request_computed_score(sheet_id)
    $router.push(`/result/${sheet_id}`)
  }
  const getExamResult = async (sheet_id: string) => {
    const res = await request_get_result(sheet_id)
    resultData.mockScoreTotal = res.max_score
    resultData.mockScore = res.score
  }

  return { 
    getExamProcess, 
    getExamResult,
    resultData,
    processData, 
    setShowProcessDialog, 
    showProcessDialog, 
    getExamResource, 
    exam_data, 
    startExam, 
    examing_data, 
    changeQuestion, 
    curQuestion, 
    curQuestionChildren, 
    getExamData, 
    saveQuestion, 
    isExamEnding, 
    requestSubmitExam 
  };
})