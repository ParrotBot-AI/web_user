import { defineStore } from 'pinia'
import { reactive, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIndexStore } from './index'
import type { EXAN_START } from "@/service/exam"
import {
  request_getExamResource,
  request_startExam,
  request_getExam,
  request_saveAnswer,
  request_getExamStutas,
  request_submitExam,
  request_get_past_result,
  request_start_mixed_exam,
} from '@/service/exam'
import type { ANSWER_STATUS } from "@/service/exam"

export const useExamStore = defineStore('exam', () => {
  const showProcessDialog = ref(false)
  const showAnswerHistoryDialog = ref(false)
  const $route = useRoute()
  const $router = useRouter()
  // 题库列表
  const exam_data = reactive<{
    allList: any[];
    list: any[];
    total: number;
    pageArr: { start: number; end: number; id: number; }[];
  }>({
    allList: [],
    list: [],
    total: 0,
    pageArr: [{ start: 1, end: 20, id: 0 }]
  })
  const examing_data_init = {
    curQuestionIndex: 1,
    curIndex: 0,
    childrenLength: 0,
    curQuestionChildrenIndex: 0,
    time_remain: 0,
    sheet_id: '0',
    questions: [],
    answerData: [],
    type: 0 // 模考还是练习类型 1是模考
  }
  // 模考练习题
  const examing_data = reactive<{
    curQuestionIndex: number; // 答题下标
    curQuestionChildrenIndex: number;
    childrenLength: number;
    curIndex: number;
    time_remain: number;
    sheet_id: string;
    questions: any[];
    answerData: ANSWER_STATUS[]
    type: number
  }>(examing_data_init)
  const pastScores = reactive<{
    'writing': number,
    'spoken' : number,
    'hear' : number,
    'read' : number,
  }>({
    'writing': 1,
    'spoken': 2,
    'hear': 3,
    'read': 4,
  })
  const types = ['read', 'spoken', 'hearing', 'writing']
  const questionTitle = ref('')
  const processData = reactive<any[]>([])
  const indexStore = useIndexStore()
  const limit = 20;
  // 考试列表区分不同类型
  const customData = reactive({
    'read': {
      remark: 'Passage',
      height: 184,
      promptText: '为适应新版托福形式变更，阅读模考需要从三篇中选择两篇.',
      maxSelectCount: 2,
      minSelectCount: 1,
    },
    'hearing': {
      remark: 'Lecture',
      height: 326,
      promptText: '为适应新版托福形式变更，听力模考section2需要选择1篇lecture',
      maxSelectCount: 1,
      minSelectCount: 1,
    },
    'spoken': {
      remark: 'Task',
      height: 249,
      promptText: '',
      maxSelectCount: 4,
      minSelectCount: 4
    },
    'writing': {
      remark: ['Integrated Writing', 'Academic discussion'],
      height: 184,
      promptText: '',
      maxSelectCount: 2,
      minSelectCount: 2,
    },
    'mock': {
      height: 249,
      remark: ['Reading', 'Listening', 'Speaking', 'Writing'],
    }
  })
  // 考试列表
  const getExamResource = async (page: number, init?: boolean) => {
    const menuData = indexStore.menuData.list
    const { pattern_id, name } = menuData.find(val => val.key === $route.name)!
    if (init) {
      questionTitle.value = name
      exam_data.pageArr = []
      const res = await request_getExamResource({
        exam_id: 1,
        pattern_id: pattern_id || '',
        limit,
        account_id: indexStore.userInfo.account_id,
        page: page + 1,
        whether_zt: false,
      })
      exam_data.allList = $route.name === 'mock'? res.data[0].children : res.data
      exam_data.total = $route.name === 'mock' ? exam_data.allList.length : res.total
      exam_data.pageArr = new Array(Math.ceil(exam_data.total / limit)).fill(0).map((item, index) => {
        return {
          start: index * limit + 1,
          end: Math.min((index + 1) * limit, exam_data.total),
          id: index
        }
      })
    }
    exam_data.list = exam_data.allList.slice(page * limit, (page + 1) * limit)
  }
  /**
   * [startExam 开始考试 获取sheet_id]
   */
  const startExam = async (q_type: EXAN_START['q_type'], question_ids: number[], father_sheet?:string) => {
    const account_id = indexStore.userInfo.account_id
    const params = {
      q_type,
      question_ids,
      account_id,
    }
    father_sheet && (params['father_sheet'] = father_sheet)
    const res = await request_startExam(params)
    examing_data.sheet_id = res.sheet_id;
    return res
  }
  const startMixedExam = async (q_type: EXAN_START['q_type'], question_ids: number[], father_sheet: number) => {
    const account_id = indexStore.userInfo.account_id
    const res = await request_start_mixed_exam({
      q_type,
      question_ids,
      account_id,
      father_sheet,
    })
    return res
  }
  /**
   * [getExamData 考试或者练习页面根据 sheet_id 获取试题数据]
   *
   */
  const getExamData = async (id: string, type: string) => {
    try {
      examing_data.curIndex = 0;
      examing_data.curQuestionIndex = 0;
      examing_data.curQuestionChildrenIndex = 0;
      examing_data.time_remain = 0;
      examing_data.sheet_id = '';
      examing_data.questions = [];
      examing_data.answerData = [];
      examing_data.type = 0;
      const [res, answerRes] = await Promise.all([request_getExam(id), request_getExamStutas(id)])
      examing_data.answerData = answerRes.map(val => ({
        is_answer: val.is_answer,
        question_id: val.question_id,
        answer: val.answer
      }));
      
      examing_data.sheet_id = res.sheet_id;
      examing_data.childrenLength = res.questions.reduce((prev: number, item: any) => prev + item.children.length, 0);
      if(type){
        examing_data.curQuestionIndex  = Number($route.query.sectionIndex) || 0
        examing_data.curQuestionChildrenIndex =  Number($route.query.quesIndex) || 0
        examing_data.curIndex = res.questions.slice(0, examing_data.curQuestionIndex).reduce((prev:number, item: any) => prev + item?.children?.length || 0, 0) + examing_data.curQuestionChildrenIndex
      } else {
        examing_data.curQuestionIndex = 0
        examing_data.curQuestionChildrenIndex = 0;
        examing_data.curIndex = 0;
      }
      examing_data.time_remain = res.time_remain;
      examing_data.questions = res.questions;
      examing_data.type = res.type;
    } catch (error) {
      $router.back()
    }
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
    $router.replace({
      query: {
        ...$route.query,
        sectionIndex: examing_data.curQuestionIndex,
        quesIndex: examing_data.curQuestionChildrenIndex
      }
    })
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
  /**
   * [getExamProcess 获取考试进度]
   *
   */
  const getExamProcess = async (id: string) => {
    try {
      const res = await request_getExamStutas(id)
      processData.length = 0
      processData.push(...res)
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * [requestSubmitExam 计算分数，跳转到result页面]
   *
   */
  const requestSubmitExam = async (sheet_id: string) => {
    await request_submitExam(sheet_id)
    $router.push(`/result/${sheet_id}?type=${$route?.meta?.parent}` )
  }
  const getPastResult = async () => {
    const account_id = indexStore.userInfo.account_id
    const res = await request_get_past_result(account_id)
    pastScores.hear = res["听力"]
    pastScores.writing = res["写作"]
    pastScores.spoken = res["口语"]
    pastScores.read = res["阅读"]
  }
  return {
    types,
    getExamProcess,
    startMixedExam,
    getPastResult,
    processData,
    pastScores,
    setShowProcessDialog,
    showAnswerHistoryDialog,
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
    requestSubmitExam,
    questionTitle,
    customData
  };
})