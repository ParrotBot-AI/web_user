import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
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
const writing_result_data = {
  'Integrated Writing': [
    {
      key: 'Content & Details Given',
      title: '内容与细节'
    },
    {
      key: 'Grammar',
      title: '语法'
    },
    {
      key: 'Structure/Flow',
      title: '结构与流畅度'
    }
  ],
  'Academic discussion': [
    {
      key: 'Contribution',
      title: '内容贡献'
    },
    {
      key: 'Relevance',
      title: '相关性'
    },
    {
      key: 'Structure/Flow',
      title: '结构与流畅度'
    },
    {
      key: 'Grammar',
      title: '语法'
    }
  ],
}
const spoken_result_data = [
  {
    key: ['Fluency', 'Pronunciation'],
    title: '流利度'
  },
  {
    key: ['Grammar', 'Vocabulary Usage'],
    title: '语法与词汇',
  },
  {
    key: 'Content',
    title: '内容'
  },
  {
    key: 'Coherence',
    title: '连贯性'
  }
]
export const useResultStore = defineStore('result', () => {
  const showAnswerHistoryDialog = ref(false)
  const {query} = useRoute()
  const resultData = reactive<{
    footerActiveIndex: number;
    loading: boolean;
    title: String;
    aiComment: string;
    level: string;
    allData: Array<any>;
    questions_r: object;
    format_question: Array<any>
    score_d: Array<any>
  }>({
    loading: true,
    title: '',
    level: '',
    footerActiveIndex: 0,
    allData: [],
    aiComment: '',
    questions_r: {},
    format_question: [],
    score_d: []
  })
  const footerData = reactive<Array<{title: string; id:string}>>([])
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
      const footerData = score_d.map((val,i) => ({
        title: 'Section ' + (val.find(v => v.name.endsWith('Conversation2') || v.name.endsWith('Lecture3') || v.name.endsWith('Lecture4')) ? 2 : 1),
        id: `${i}`
      }))
      // 首页
      resultData.allData[0] = {
        layout: 'col',
        name: '听力得分',
        mockScore: res.score,
        mockScoreTotal: res.max_score,
        aiComment: '', // ai评语
        tags: [], // 标签
        list: score_d.map((val,i) => ({
          ...footerData[i],
          children: val.map((v: any, j: number) => ({
            title: v.name.split(/\s/).slice(-1)[0],
            id: `${i}-${j}`,
            count: v.count,
            total: v.total,
            isComputed: val.score !== null,
          }))
        }))
      }
      // 其他数据
      resultData.allData.push(...footerData.map((v,i) => {
        return {
          subtitle: v.title,
          layout: 'row',
          name: 'Raw Score',
          mockScore: score_d[i]?.reduce((def, item) => def + item.count, 0),
          mockScoreTotal: score_d[i]?.reduce((def, item) => def + item.total, 0),
          // TODO 等接口字段
          list: [], // 题型数据
          tags: [], // 标签
          aiComment: '', // ai评语
        }
      }))
      return footerData
    } else if(query.type === 'spoken') {
      const footData = score_d[0].map((val,i) => ({
        title: 'Task ' + val.name.split(/\s/).slice(-1)[0],
        id: `${i}`
      }))
      resultData.allData[0] = {
        layout: 'col',
        name: '口语得分',
        mockScore: res.questions_r.questions.reduce((def, item) => def + item.score, 0),
        mockScoreTotal : res.max_score,
        list: res.questions_r.questions.map((val: any, i: number) => {
          return {
            title: 'Task ' + val.order,
            id: i,
            isComputed: val.score !== null,
            count: val.score,
            total: val.max_score
          }
        }) 
      }
      resultData.allData.push(...footData.map((v,i) => {
        const model_answer = res.questions_r.questions[i]?.model_answer
        const model_answer_content = typeof model_answer === 'string' ? JSON.parse(model_answer) : model_answer
        return {
          layout: 'col',
          name: v.title,
          mockScore: res.questions_r.questions[i].score,
          mockScoreTotal: res.questions_r.questions[i].max_score,
          // TODO 等接口字段
          aiComment: '', // ai评语
          list: spoken_result_data.map(val => {
            const sum = Array.isArray(val.key) ? val.key.reduce((_v,_i) => {
              return Number(model_answer_content?.Grades?.[_i]) + _v
            },0) : model_answer_content?.Grades?.[val.key]
            return {
              title: val.title,
              count: model_answer_content ? (sum / 2).toFixed(1) : model_answer_content?.Grades?.[v.key],
              isComputed: model_answer_content?.Status === "OK",
              total: 4
            }
          }), // 题型数据
        }
      }))
      return footData
    } else if(query.type === 'writing') {
      const footerData = score_d.map((val,i) => ({
        title: Number(val[0].name.slice(-1)) === 1 ? 'Integrated Writing' : 'Academic discussion',
        id: `${i}`
      }))
      resultData.allData[0] = {
        layout: 'col',
        name: '写作得分',
        mockScore: res.questions_r.questions.reduce((def, item) => def + item.score, 0),
        mockScoreTotal: res.max_score,
        list: res.questions_r.questions.map((val: any, i: number) => {
          return {
            title: val.keywords.r === 1200 ? 'Integrated Writing' : 'Academic discussion',
            id: i,
            isComputed: val.score !== null,
            count: val.score,
            total: val.max_score
          }
        }),
        // TODO 等接口字段
        aiComment: '', // ai评语
      }
      resultData.allData.push(...footerData.map((v,i) => {
        const model_answer = res.questions_r.questions[i]?.model_answer
        const model_answer_content = typeof model_answer === 'string' ? JSON.parse(model_answer) : model_answer
        return {
          layout: 'col',
          name: v.title,
          mockScore: res.questions_r.questions[i].score,
          mockScoreTotal: res.questions_r.questions[i].max_score,
          // TODO 等接口字段
          aiComment: '', // ai评语
          list: writing_result_data[v.title].map(val => ({
            title: val.title,
            count: model_answer_content?.Grades[val.key] || 0,
            isComputed: model_answer_content?.Grades[val.key] !== null,
            total: 5
          })), // 题型数据
        }
      }))
      return footerData
    } else {
      const footData = score_d.map((val,i) => ({
        title: formatRemarkName(val[0].name),
        id: `${i}`
      }))
      resultData.allData[0] = {
        layout: 'row',
        name: '阅读得分',
        mockScore: res.score,
        mockScoreTotal: res.max_score,
        // TODO 等接口字段
        aiComment: '', // ai评语
        tags: [], // 标签
        list: [], // 题型数据
      }
      resultData.allData.push(...footData.map((v,i) => ({
        layout: 'row',
        name: '模考得分',
        subtitle: v.title,
        mockScore: score_d[i]?.reduce((def, item) => def + item.count, 0),
        mockScoreTotal: score_d[i]?.reduce((def, item) => def + item.total, 0),
        // TODO 等接口字段
        aiComment: '', // ai评语
        tags: [], // 标签
        list: [], // 题型数据
      })))
      return footData
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
      def.push(...(Array.isArray(item.children) && item.children.length ? item.children.map(val => ({
        ...val,
        question_parent: {
          ...item,
          question_content: item.question_content?.split(/\\n/),
          question_title: item.question_title ? item.question_title : '听力原文',
          children: null
        }
      })) : []))
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
    resultData.footerActiveIndex = 0
    resultData.allData = []
    resultData.aiComment = ''
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

  const curData = computed(() => {
    return resultData.allData[resultData.footerActiveIndex]
  })

  return {
    getExamResult,
    curData,
    resultData,
    setShowAnswerHistoryDialog,
    showAnswerHistoryDialog,
    footerData
  };
})