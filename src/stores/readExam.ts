import {
  request_getExam,
  request_getExamStutas,
  request_saveAnswer,
  request_submitExam,
} from '@/service/exam'
import { useExamStore } from '@/stores/exam'
import { getWithExpiry } from '@/utils/storage'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useReadExamStore = defineStore('readExam', () => {
  const showProcessDialog = ref(false)
  const showAnswerHistoryDialog = ref(false)
  const {query, meta} = useRoute()
  const $router = useRouter()
  const examStore = useExamStore()

  const questionTitle = ref('')
  const processData = reactive<any[]>([])
  const curQuestionIndex = ref(0)
  const answerData = reactive<any[]>([])
  const questionData = ref<any>({})
  /**
   * [getExamData 考试或者练习页面根据 sheet_id 获取试题数据]
   *
   */
  const getExamData = async (id: string) => {
    curQuestionIndex.value = Number(query?.qi) || 0
    questionData.value = {}
    try {
      const [res, answerRes] = await Promise.all([request_getExam(id), request_getExamStutas(id)])
      questionData.value = res
      let initNum = 1;
      questionData.value.formatQuestion = res.questions.reduce((val, item: any) => {
        const contents = item.question_content?.split(/\\n/)
        const keywords = item.keywords?.k
        const initContent = contents.map((content: string) => content.replaceAll(keywords, ''))
        item.children = item.children.map((child: any) => {
          child.parentQuestion = {
            ...item,
            original_question_content: contents,
            question_content: initContent,
            children: null,
          }
          child.num = initNum++
          child.navTitle = query?.name;
          child.viewText_open = child.question_type === 'Toefl_Reading_mc'
          child.viewText_flag = child.question_type === 'Toefl_Reading_mc'
          return child
        })
        val.push({
          navTitle: query?.name,
          isViewPassage: true,
          children: null,
          parentQuestion: {
            question_title: item.question_title,
            question_content: initContent,
          }
        },...item.children)
        return val
      }, [{
        isGuide: true,
        navTitle: query?.name,
        guideData: {
          title: 'Reading',
          info_title: 'Reading Section Directions',
          is_show_footer: true,
          question_title: [
            `In this section, you will be able to demonstrate your ability to understand academic passages in English. You will read and answer questions about two passages. A clock will indicate how much time remains. In the actual test, you will have 36 minutes to read the two passages and answer the questions.`,
            `Some passages include an underlined word or phrase. Select the word or phrase to see a definition, an explanation, or an illustration.`,
            `Move to the next question by selecting <button class="nextbtn">Next</button> . You can skip questions and go back to them later if time remains. Return to previous screens by selecting.<button class="backbtn">BACK</button> `,
            `Select <button class="reviewbtn">REVIEW</button> at any time to see which questions you have answered and which questions you have not answered. From the Review screen, you may go directly to any question you have already encountered.`
          ]
        }
      }])
      answerData.length = 0
      answerData.push(...answerRes)
      questionData.value.sumQuesLength = initNum - 1
    } catch (error) {
      $router.back()
    }
  }
  const setViewText = () => {
    questionData.value.formatQuestion[curQuestionIndex.value].viewText_flag = !questionData.value?.formatQuestion?.[curQuestionIndex.value].viewText_flag
  }
  const changeQuestion = (type) => {
    curQuestionIndex.value += type
    $router.replace({
      query: {
        ...query,
        qi: curQuestionIndex.value
      }
    })
  }

  const curQuestion = computed(() => {
    if(!questionData.value?.formatQuestion) return {}
    questionData.value.formatQuestion[curQuestionIndex.value].viewText_flag = questionData.value.formatQuestion[curQuestionIndex.value]?.viewText_open 
    return questionData.value?.formatQuestion?.[curQuestionIndex.value]
  })

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
  const requestSubmitExam = async () => {
    await request_submitExam(query?.id)
    if(query?.type === 'mixedExam' && query?.mid && query?.mid){
      const mixdata = getWithExpiry(`mixedExam-${query?.mid}`)
      await examStore.startExam('mock_exam', mixdata?.quesid[1], mixdata?.father_sheet)
      $router.push({
        name: 'hearingExam',
        query: {
          type: 'mixedExam',
          mid: mixdata?.father_sheet,
          name: mixdata.resource_name,
          id: examStore.examing_data.sheet_id
        }
      })
      return
    }
    $router.push(`/result/${query?.id}?type=${meta?.parent}`)
  }

  const saveQuestion = async (question_id: number, answer: number[]) => {
    const answerIndex = answerData.findIndex((item) => item.question_id === question_id)
    answerData[answerIndex] = {
      question_id,
      is_answer: true,
      answer
    }
    await request_saveAnswer({
      sheet_id: query?.id,
      question_id,
      answer,
      duration: 0
    })
  }

  return {
    changeQuestion,
    getExamProcess,
    setViewText,
    questionData,
    curQuestionIndex,
    saveQuestion,
    curQuestion,
    processData,
    answerData,
    setShowProcessDialog,
    showAnswerHistoryDialog,
    showProcessDialog,
    getExamData,
    requestSubmitExam,
    questionTitle,
  };
})