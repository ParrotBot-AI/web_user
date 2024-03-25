import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import {dely} from "@/utils/utils"
import {
  request_get_result,
  request_computed_score,
  request_get_repeat_result
} from '@/service/exam'
const exam_range = {
  27: 'A+',
  25: 'A',
  23: 'A-',
  21: 'B+',
  19: 'B',
  17: 'B-',
  15: 'C+',
  13: 'C',
  10: 'C-',
  0: 'F'
}
const practice_range = {
  10: 'A+',
  9: 'A',
  8: 'A-',
  '7.5': 'B+',
  7: 'B',
  6: 'B-',
  '5.5':'C+',
  5: 'C',
  4: 'C-',
  0: 'F'
}

export const useResultStore = defineStore('result', () => {
  const showAnswerHistoryDialog = ref(false)
  const {query} = useRoute()
  const resultData = reactive<{
    loading: boolean;
    title: String;
    aiComment: string;
    level: string;
    indexData: Array<any>;
    questions: {
      title: string;
      total: number;
      correct: number;
    }[];
    mockScoreTotal: number;
    mockScore: number;
    questions_r: object;
    format_question: Array<any>
    score_d: Array<any>
  }>({
    loading: true,
    title: '',
    level: '',
    indexData: [],
    aiComment: '',
    questions: [
      // {
      //   title: '细节题',
      //   total: 3,
      //   correct: 2,
      // },
    ],
    mockScoreTotal: 0,
    mockScore: 0,
    questions_r: {},
    format_question: [],
    score_d: []
  })
  const footerData = reactive<Array<{title: string; id:string}>>([])
  // 考试列表区分不同类型
  const customData = reactive({
    'read': {
      name: '阅读得分',
      indexLayout: 'row',
    },
    'hearing': {
      name: '听力得分',
      indexLayout: 'col',
    },
    'spoken': {
      name: '口语得分',
      indexLayout: 'col',
    },
    'writing': {
      name: '写作得分',
      indexLayout: 'col',
    },
    'mock': {
      name: '总分',
      indexLayout: 'col',
    }
  })
  const formatRemarkName = (name: string) => {
    return name.replace(/TPO\s?\d+/g,'')
  }

  const setShowAnswerHistoryDialog = () => {
    showAnswerHistoryDialog.value = !showAnswerHistoryDialog.value
  }
  const startLoopRequsetResult = async (sheet_id: string) => {
    await dely(5000)
    await request_computed_score(sheet_id)
    const res = await request_get_repeat_result(sheet_id)
    if(res.score === null) {
      startLoopRequsetResult(sheet_id)
    } else {
      setResultData(res)
    }
  }
  const formatData = (res:any) => {
    const score_d = Object.values(res.score_d)
    if(query.type === 'hearing') {
      resultData.mockScoreTotal = res.max_score
      resultData.mockScore = res.score
      return (resultData.indexData = score_d.map((val,i) => ({
        title: 'Section ' + (val.find(v => v.name.endsWith('Conversation2') || v.name.endsWith('Lecture3') || v.name.endsWith('Lecture4')) ? 2 : 1),
        id: `${i}`,
        children: val.map((v: any, j: number) => ({
          title: v.name.split(/\s/).slice(-1)[0],
          id: `${i}-${j}`,
          count: v.count,
          total: v.total,
          isComputed: val.score !== null,
        }))
      })))
    } else if(query.type === 'spoken') {
      resultData.indexData = res.questions_r.questions.map((val: any, i: number) => {
        return {
          title: 'Task ' + val.order,
          id: i,
          isComputed: val.score !== null,
          count: val.score,
          total: val.max_score
        }
      }) 
      resultData.mockScoreTotal = res.max_score
      resultData.mockScore = resultData.indexData.reduce((def, item) => def + item.count, 0)
      return score_d[0].map((val,i) => ({
        title: 'Task ' + val.name.split(/\s/).slice(-1)[0],
        id: `${i}`
      }))
    } else if(query.type === 'writing') {
      resultData.indexData = res.questions_r.questions.map((val: any, i: number) => {
        return {
          title: val.keywords.r === 1200 ? 'Integrated Writing' : 'Academic discussion',
          id: i,
          isComputed: val.score !== null,
          count: val.score,
          total: val.max_score
        }
      }) 
      resultData.mockScoreTotal = res.max_score
      resultData.mockScore = resultData.indexData.reduce((def, item) => def + item.count, 0)
      return score_d.map((val,i) => ({
        title: Number(val[0].name.slice(-1)) === 1 ? 'Integrated Writing' : 'Academic discussion',
        id: `${i}`
      }))
    } else {
      resultData.mockScoreTotal = res.max_score
      resultData.mockScore = res.score
      return score_d.map((val,i) => ({
        title: formatRemarkName(val[0].name),
        id: `${i}`
      }))
    }
  }
  const computedLevel = (type:number, score:number) => {
    const key = Object.keys(type === 1 ? exam_range : practice_range).find(val => score >= Number(val))
    return type === 1 ? exam_range[key] : practice_range[key]
  }
  const setResultData = (res: any) => {
    resultData.questions_r = res.questions_r
    resultData.score_d = Object.values(res.score_d)
    resultData.format_question = res.questions_r.questions.reduce((def, item) => {
      def.push(...item.children.map(val => ({
        ...val,
        question_parent: {
          ...item,
          question_content: item.question_content?.split(/\\n/),
          question_title: item.question_title ? item.question_title : '听力原文',
          children: null
        }
      })))
      return def;
    }, [])
    footerData.length = 0;
    footerData.push(...[
      {
        title: '报告',
        id: 'all',
      },
      ...formatData(res)
    ])
    resultData.title = `${resultData.score_d[0][0].name.match(/^(TPO\s?\d+)/)[1]} 成绩单`
    resultData.level = computedLevel(res.type,res.score)
    resultData.loading = false
  }
  /**
   * [getExamResult 获取考试结果]
   *
   */
  const getExamResult = async (sheet_id: string) => {
    // resultData回到初始状态 
    resultData.title = ''
    resultData.level = ''
    resultData.indexData = []
    resultData.aiComment = ''
    resultData.questions = []
    resultData.mockScoreTotal = 0
    resultData.mockScore = 0
    resultData.questions_r = {}
    resultData.format_question = []
    resultData.score_d = []
    resultData.loading = true
    await request_computed_score(sheet_id)
    const res = await request_get_result(sheet_id)
    if(res.score !== null){
      setResultData(res)
    } else {
      startLoopRequsetResult(sheet_id)
    }
  }


  return {
    getExamResult,
    resultData,
    setShowAnswerHistoryDialog,
    showAnswerHistoryDialog,
    customData,
    footerData
  };
})