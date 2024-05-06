import {
  request_computed_score,
  request_get_repeat_result,
  request_get_result
} from '@/service/exam'
import { getWithExpiry } from "@/utils/storage"
import { dely } from "@/utils/utils"
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
const practice_range = {
  10: 'A+',
  9: 'A',
  8: 'A-',
  '7.5': 'B+',
  7: 'B',
  6: 'B-',
  '5.5': 'C+',
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
const task_quesFooterType = [
  {
    type: '内容',
    id: 'Content',
    style: {
      color: '#667085',
      background: 'rgba(253, 212, 78, 0.3)',
    }
  },
  {
    type: '连贯性',
    id: 'Coherence',
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-color': '#667085'
    }
  },
  {
    type: '语法',
    id: 'Grammar and Language Use',
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-style': 'dashed',
      'text-decoration-color': '#C33473'
    }
  },
  {
    type: '优秀用句',
    id: 'Good',
    style: {
      color: '#667085',
      background: 'rgba(183, 217, 114, 0.3)',
    }
  }
]
const i_quesFooterType = [
  {
    type: '内容与细节',
    id: 'Content & Details Given',
    style: {
      color: '#667085',
      background: 'rgba(253, 212, 78, 0.3)',
    }
  },
  {
    type: '结构与流畅度',
    id: 'Structure/Flow',
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-color': '#667085'
    }
  },
  {
    type: '语法',
    id: 'Grammar',
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-style': 'dashed',
      'text-decoration-color': '#C33473'
    }
  },
  {
    type: '优秀用句',
    id: 'Good',
    style: {
      color: '#667085',
      background: 'rgba(183, 217, 114, 0.3)',
    }
  }
]
const a_writingTypes = [
  {
    type: '贡献度与相关性',
    id: ["Contribution", "Relevance"],
    style: {
      color: '#667085',
      background: 'rgba(253, 212, 78, 0.3)',
    }
  },
  {
    type: '结构与流畅度',
    id: 'Structure/Flow',
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-color': '#667085'
    }
  },
  {
    type: '语法',
    id: 'Grammar',
    style: {
      color: '#667085',
      'text-decoration-line': 'underline',
      'text-decoration-style': 'dashed',
      'text-decoration-color': '#C33473'
    }
  },
  {
    type: '优秀用句',
    id: 'Good',
    style: {
      color: '#667085',
      background: 'rgba(183, 217, 114, 0.3)',
    }
  }
]

export const useResultStore = defineStore('result', () => {
  const showAnswerHistoryDialog = ref(false)
  const $route = useRoute()
  const resultData = reactive<{
    footerActiveIndex: number;
    loading: boolean;
    title: String;
    aiComment: string;
    level: string;
    type: string;
    allData: Array<any>;
    questions_r: object;
    navData: Array<any>
    format_question: Array<any>
    score_d: Array<any>,
    AnnotationData: Array<any>
  }>({
    loading: true,
    title: '',
    level: '',
    footerActiveIndex: 0,
    allData: [],
    type: '',
    aiComment: '',
    navData: [],
    questions_r: {},
    format_question: [],
    score_d: [],
    AnnotationData: []
  })
  const footerData = reactive<Array<{ title: string; id: string }>>([])
  const formatRemarkName = (name: string) => {
    return name.replace(/TPO\s?\d+/g, '')
  }

  const setShowAnswerHistoryDialog = () => {
    const { query } = $route
    if (query.type === 'mock') {
      const curFooterData = footerData[resultData.footerActiveIndex]
      const curAllData = resultData.allData[resultData.footerActiveIndex]
      resultData.type = curFooterData.id
      resultData.format_question = formatQues(curAllData.originData)
      resultData.questions_r = curAllData.originData.questions_r
      if(resultData.type === 'spoken' || resultData.type === 'writing') {
        // console.log('curAllData:::',curAllData)
        resultData.AnnotationData = curAllData.formatAllData.allData.slice(1)
      }
      // 综合模考判断听力导航
      if(resultData.type === 'hearing') {
        resultData.navData = curAllData.list
      }
    }
    showAnswerHistoryDialog.value = !showAnswerHistoryDialog.value
  }
  const startLoopRequsetResult = async (sheet_id: string) => {
    await dely(5000)
    await request_computed_score(sheet_id)
    const res = await request_get_repeat_result(sheet_id)
    if (res.score === null) {
      startLoopRequsetResult(sheet_id)
    } else {
      setResultData(res)
    }
  }
  const formatAIModel = (res: any) => {
    const model_answer = res?.model_answer
    if (!model_answer) return {
      model_answer_content: {},
      model_answer: ''
    }
    const model_answer_content = typeof model_answer === 'string' ? JSON.parse(model_answer) : model_answer
    if (model_answer_content['General Feedback']) {
      const _arr = model_answer_content['General Feedback'].split(/\n?(.+):\s/i).slice(1)
      model_answer_content['format_G_F'] = new Array(_arr.length / 2).fill(0).reduce((def, item, index) => {
        def[_arr[index * 2]] = _arr[index * 2 + 1]
        return def
      }, {})
    }
    if (model_answer_content['Mind-Map']) {
      model_answer_content['format_M_M'] = model_answer_content['Mind-Map'].split(/\n/)
    }
    return {
      model_answer_content,
      model_answer
    }
  }
  const formatlist = (formatdata, data) => {
    const res = JSON.parse(JSON.stringify(formatdata))
    res.forEach(val => {
      const _v = data?.filter(v => val.include.includes(v.name))
      val.total = 0
      val.count = 0
      _v?.forEach(v1 => {
        val.total += v1.count
        val.count += v1.sum
      })
      val.isComputed = true
    })
    return {
      list: res,
      tags: data?.map(val => ({
        ...val,
        name: val.name.replace(/^(阅读|听力)/g, '')
      }))
    }
  }
  const formatData = (res: any, queryType) => {
    const score_d = Object.values(res.score_d)
    if (queryType === 'hearing') {
      const formatListConfig = [{
        title: '基础题',
        include: ['听力目的主旨题', '听力内容主旨题', '听力细节题'],
      },
      {
        title: '强化题',
        include: ['听力推理题', '听力句子功能题', '听力连结内容题', '听力组织结构题'],
      }]
      const footerData = score_d.map((val) => {
        const id = val.find(v => v.name.endsWith('Conversation2') || v.name.endsWith('Lecture3') || v.name.endsWith('Lecture4')) ? 2 : 1
        return {
          title: 'Section ' + id,
          id: id
        }
      })
      let navNumIndex = 0
      const allData_0 = {
        layout: 'col',
        name: '听力得分',
        mockScore: res.score,
        mockScoreTotal: res.max_score,
        level: computedLevel(res.score, res.max_score),
        aiComment: '', // ai评语
        list: score_d.map((val, i) => {
          const child = val.reduce((def, v) => {
            if (v.name.includes('Conversation')) {
              def.unshift(v)
            } else {
              def.push(v)
            }
            return def
          }, [])
          return {
            ...footerData[i],
            children: child.map((v: any, j: number) => {
              return {
                title: v.name.split(/\s/).slice(-1)[0],
                id: `${i}-${j}`,
                count: v.count,
                total: v.total,
                isComputed: val.score !== null,
                index: j + i * 3,
                navNum: res.questions_r?.questions?.[j + i * 3].children.map(() => navNumIndex++)
              }
            })
          }
        })
      }
      resultData.navData = allData_0.list
      return {
        allData: [allData_0
          , ...footerData.map((v, i) => {
            const mockScore = score_d[i]?.reduce((def, item) => def + item.count, 0)
            const mockScoreTotal = score_d[i]?.reduce((def, item) => def + item.total, 0)
            return {
              subtitle: v.title,
              layout: 'row',
              level: computedLevel(mockScore, mockScoreTotal),
              name: 'Raw Score',
              mockScore,
              mockScoreTotal,
              ...formatlist(formatListConfig, res.tag_d[i + 1]), // 题型数据 标签
              // TODO 等接口字段
              aiComment: '', // ai评语
            }
          })
        ],
        footerData
      }

    } else if (queryType === 'spoken') {
      const footData = score_d[0].map((val, i) => ({
        title: 'Task ' + val.name.split(/\s/).slice(-1)[0],
        id: `${i}`
      }))
      const allDatas = footData.map((v, i) => {
        const { model_answer, model_answer_content } = formatAIModel(res.questions_r.questions[i])
        const content = model_answer_content?.Content?.filter(val => Object.keys(val).length > 0);
        const ques_mark = task_quesFooterType;
        return {
          layout: 'col',
          name: v.title,
          level: computedLevel(res.questions_r.questions[i].score, res.questions_r.questions[i].max_score),
          mockScore: model_answer_content?.Status === 'OK' ? res.questions_r.questions[i].score : 'Na',
          mockScoreTotal: res.questions_r.questions[i].max_score,
          aiComment: model_answer_content?.Status === 'OK' ? model_answer_content?.format_G_F?.General : model_answer_content?.msg === '用量已超使用上限制' ? '🔒您的今日免费批改次数已用尽，如需批改，请前往价格页购买。' : model_answer_content?.msg,
          model_answer,
          model_answer_content: {
            ...model_answer_content,
            'sent_back': content?.map(val => Object.keys(val).reduce((def, key) => {
              const style = model_answer_content['Sentence Feedback'][key].Type?.reduce((d, v) => {
                return {
                  ...ques_mark.find(v1 => v1.id === v || v1.id.includes(v))?.style,
                };
              }, {})
              def[key] = {
                ...model_answer_content['Sentence Feedback'][key],
                original: val[key],
                style,
                curStyle: { ...style },
                aiStyle: { ...style }
              }
              return def
            }, {}))
          },
          question: res.questions_r.questions[i],
          curIndex: i + 1,
          length: res.questions_r.questions.length,
          ques_mark: task_quesFooterType,
          list: spoken_result_data.map(val => {
            const sum = Array.isArray(val.key) ? val.key.reduce((_v, _i) => {
              return Number(model_answer_content?.Grades?.[_i]) + _v
            }, 0) : model_answer_content?.Grades?.[val.key]
            return {
              title: val.title,
              count: model_answer_content?.Status === 'OK' ? (model_answer_content ? (sum / 2) : model_answer_content?.Grades?.[v.key]) : 'Na',
              isComputed: model_answer_content?.Grades?.[val.key] !== null,
              total: 4
            }
          }), // 题型数据
        }
      })
      resultData.AnnotationData = allDatas
      const _r = allDatas[0]
      return {
        allData: [
          {
            layout: 'col',
            name: '口语得分',
            level: computedLevel(res.score, footData.length === 4 ? 30 : res?.max_score),
            mockScore: _r.model_answer_content?.Status === 'OK' ? res?.score : 'Na',
            mockScoreTotal: footData.length === 4 ? 30 : res?.max_score,
            list: res.questions_r.questions.map((val: any, i: number) => {
              return {
                title: 'Task ' + val.order,
                id: i,
                isComputed: val.score !== null,
                count: _r.model_answer_content?.Status === 'OK' ? val.score : 'Na',
                total: val.max_score
              }
            })
          },
          ...allDatas
        ],
        footerData: footData
      }
    } else if (queryType === 'writing') {
      const footerData = score_d.map((val, i) => ({
        title: Number(val[0].name.slice(-1)) === 1 ? 'Integrated Writing' : 'Academic discussion',
        id: `${i}`
      }))
      const allDatas = footerData.map((v, i) => {
        const { model_answer, model_answer_content } = formatAIModel(res.questions_r.questions[i])
        const content = model_answer_content?.Content?.filter?.(val => Object.keys(val).length > 0);
        const ques_mark = v.title === 'Integrated Writing' ? i_quesFooterType : a_writingTypes;
        return {
          layout: 'col',
          name: v.title,
          ques_mark,
          mockScore: model_answer_content?.Status === 'OK' ? (res.questions_r.questions[i].score) : 'Na',
          mockScoreTotal: res.questions_r.questions[i].max_score,
          level: computedLevel(res.questions_r.questions[i].score, res.questions_r.questions[i].max_score),
          aiComment: model_answer_content?.Status === 'OK' ? model_answer_content?.format_G_F?.General : model_answer_content?.msg === '用量已超使用上限制' ? '🔒您的今日免费批改次数已用尽，如需批改，请前往价格页购买。' : model_answer_content?.msg,
          model_answer,
          model_answer_content: {
            ...model_answer_content,
            'sent_back': content?.map(val => Object.keys(val).reduce((def, key) => {
              const style = model_answer_content['Sentence Feedback'][key].Type?.reduce((d, v) => {
                return {
                  ...ques_mark.find(v1 => v1.id === v || v1.id.includes(v))?.style,
                };
              }, {})
              def[key] = {
                ...model_answer_content['Sentence Feedback'][key],
                original: val[key],
                style,
                curStyle: { ...style },
                aiStyle: { ...style }
              }
              return def
            }, {}))
          },
          question: res.questions_r.questions[i],
          curIndex: i + 1,
          length: res.questions_r.questions.length,
          list: writing_result_data[v.title].map(val => ({
            title: val.title,
            count: model_answer_content?.Status === 'OK' ? model_answer_content?.Grades?.[val.key] : 'Na',
            isComputed: model_answer_content?.Grades?.[val.key] !== null,
            total: 5
          })), // 题型数据
        }
      })
      const _r = allDatas[0]
      resultData.AnnotationData = allDatas
      return {
        footerData,
        allData: [
          {
            layout: 'col',
            name: '写作得分',
            mockScore: _r.model_answer_content?.Status === 'OK' ? res.score : 'Na',
            mockScoreTotal: footerData.length * 15,
            level: computedLevel(res.score, footerData.length * 15),
            list: res.questions_r.questions.map((val: any, i: number) => {
              return {
                title: val.keywords.r === 1200 ? 'Integrated Writing' : 'Academic discussion',
                id: i,
                isComputed: val.score !== null,
                count: _r.model_answer_content?.Status === 'OK' ? (val.score) : 'Na',
                total: val.max_score
                // total: 15,
              }
            }),
            // TODO 等接口字段
            aiComment: '', // ai评语
          },
          ...allDatas
        ]
      }
    } else {
      const formatListConfig = [{
        title: '基础题',
        include: ["阅读词汇题", "阅读指代题", "阅读简化句子题", "阅读细节题", "阅读排除题"],
      },
      {
        title: '强化题',
        include: ["阅读修辞目的题", "阅读插入句子题", "阅读推断题"],
      },
      {
        title: '文章小结题',
        include: ["阅读文章内容小结题", "阅读表格题"],
      }]
      const footData = score_d.map((val, i) => ({
        title: formatRemarkName(val[0].name),
        id: `${i}`
      }))
      return {
        footerData: footData,
        allData: [
          {
            layout: 'row',
            name: '阅读得分',
            mockScore: res.score,
            mockScoreTotal: res.max_score,
            level: computedLevel(res.score, res.max_score),
            aiComment: '', // TODO 等接口字段 ai评语
            ...formatlist(formatListConfig, res.tag_d.all), // 题型数据  标签
          },
          ...footData.map((v, i) => {
            const mockScore = score_d[i]?.reduce((def, item) => def + item.count, 0)
            const mockScoreTotal = score_d[i]?.reduce((def, item) => def + item.total, 0)
            return {
              layout: 'row',
              name: 'Raw Score',
              subtitle: v.title,
              mockScore,
              mockScoreTotal,
              level: computedLevel(mockScore, mockScoreTotal),
              // TODO 等接口字段
              aiComment: '', // ai评语
              ...formatlist(formatListConfig, res.tag_d[i + 1]), // 题型数据  标签
            }
          })
        ]
      }
    }
  }
  const computedLevel = (score: number, max_score: number) => {
    const curSore = score * (10 / max_score)
    const keys = Object.keys(practice_range).sort((a, b) => a - b)
    const key = keys.find((val, i) => {
      return curSore >= Number(val) && curSore < Number(i === keys.length - 1 ? 11 : keys[i + 1])
    }, 0)
    return practice_range[key]
  }
  const formatQues = (res) => {
    return res.questions_r.questions.reduce((def, item) => {
      def.push(...(Array.isArray(item.children) && item.children.length ? item.children.map(val => {
        const original_question_content = item.question_content?.split(/\\n/)
        return {
          ...val,
          question_parent: {
            ...item,
            original_question_content,
            question_content: original_question_content?.map(content => content.replaceAll(item.keywords.k, '')),
            question_title: item.question_title ? item.question_title : '听力原文',
            children: null
          }
        }
      }) : []))
      return def;
    }, [])
  }
  const setResultData = (res: any) => {
    resultData.questions_r = res.questions_r
    resultData.score_d = Object.values(res.score_d)
    const { query } = $route
    resultData.type = query.type
    resultData.format_question = formatQues(res)
    footerData.length = 0;
    const formatAllData = formatData(res, query.type)
    footerData.push(...[
      {
        title: '报告',
        id: 'all',
      },
      ...formatAllData.footerData
    ])
    resultData.allData = formatAllData.allData
    resultData.title = `${resultData.score_d[0][0].name.match(/^(TPO\s?\d+)/)[1]} 成绩单`
    resultData.loading = false
  }

  const setMixedResultData = async (res: any) => {
    const { params } = $route
    const mixFooterData = [
      {
        title: '阅读',
        id: 'read',
        layout: 'row',
      },
      {
        title: '听力',
        id: 'hearing',
        layout: 'col',
      },
      {
        title: '口语',
        id: 'spoken',
        layout: 'col',
      },
      {
        title: '写作',
        id: 'writing',
        layout: 'table',
      },
    ]
    resultData.questions_r = []
    resultData.score_d = []
    resultData.format_question = []
    footerData.length = 0
    footerData[0] = {
      title: '模考',
      id: 'MixedAll',
    };
    footerData.push(...mixFooterData)
    resultData.allData[0] = {
      layout: 'col',
      name: '总分',
      mockScore: res.score,
      mockScoreTotal: 120,
      level: computedLevel(res.score, 120),
      aiComment: '', // ai评语
      list: mixFooterData.map((val, i) => ({
        title: val.title,
        isComputed: true,
        total: 30 || res.detail[i].max_score,
        count: res.detail[i]?.score,
      }))
    }
    for (let i = 0; i < mixFooterData.length; i++) {
      if(res.detail[i]?.sheet_id) {
        const v = await request_get_repeat_result(res.detail[i]?.sheet_id)
        const formatAllData = formatData(v, mixFooterData[i].id)
        resultData.allData.push({
          ...formatAllData.allData[0],
          formatAllData,
          originData: v
        })
      }
    }
    resultData.title = getWithExpiry('mixedExam-' + params.sheetId)?.resource_name || '模考成绩单'
    resultData.loading = false
  }
  /**
   * [getExamResult 获取考试结果]
   *
   */
  const getExamResult = async (sheet_id: string) => {
    const { query } = $route
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
    footerData.length = 0
    await request_computed_score(sheet_id)
    const res = await request_get_result(sheet_id)
    if (res.score !== null) {
      if (query.type === 'mock') {
        setMixedResultData(res)
        return
      }
      setResultData(res)
    } else {
      startLoopRequsetResult(sheet_id)
    }
  }

  const curData = computed(() => {
    return resultData.allData[resultData.footerActiveIndex]
  })

  const showHoverMark = (key, index, i, type) => {
    const data = resultData.allData.slice(1)[i]?.model_answer_content['sent_back']
    data.map((val) => {
      Object.keys(val).map((k) => {
        if (type === 'hover') {
          if (key === k) {
            val[k].curStyle = {
              ...val[key].style,
              'font-weight': '700',
            }
          } else {
            val[k].curStyle = {}
          }
        } else {
          val[k].curStyle = val[k].style
        }
      })
    })
  }

  return {
    getExamResult,
    showHoverMark,
    curData,
    resultData,
    setShowAnswerHistoryDialog,
    showAnswerHistoryDialog,
    footerData
  };
})