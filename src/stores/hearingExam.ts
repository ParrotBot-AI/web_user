import {
  request_computed_score,
  request_getExam,
  request_getExamStutas,
  request_get_result,
  request_saveAnswer,
  request_submitExam
} from '@/service/exam'
import { useExamStore } from '@/stores/exam'
import { getWithExpiry } from '@/utils/storage'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
  
  export const useHearingExam = defineStore('hearingExam', () => {
    const $router = useRouter()
    const $route = useRoute()
    const examStore = useExamStore()
    const processData = reactive<any[]>([])
    const answerData = reactive<any[]>([])
    const questionData = ref<any>({})
    const showHelp = ref(false)
    const step = ref(0)
    /**
     * [getExamData 考试或者练习页面根据 sheet_id 获取试题数据]
     *
     */
    const getExamData = async (id: string) => {
      const {query} = $route
      questionData.value = {}
      step.value = query?.step ? Number(query?.step) : 0
      try {
        const [res, answerRes] = await Promise.all([request_getExam(id), request_getExamStutas(id)])
        questionData.value = res
        let initNum = 0;
        const sumLength = res.questions.reduce((def, v) => def + v.children.length, 0)
        questionData.value.formatQuestion = res.questions.reduce((val, item: any, i) => {
            val.push({
                type: 'audio',
                voice_link: item.voice_link,
                question_id: item.question_id,
                order: initNum + 1,
                title: "Please listen carefully.",
                url: item.voice_link,
                headBtns: {
                    horn: {
                        title: 'horn',
                        id: 'horn',
                        disabled: false,
                        isShow: true,
                    },
                    continue: {
                    title: 'CONTINUE',
                    id: 'continue',
                    disabled: false,
                    isShow: true,
                    onClick: () => {
                      step.value++
                    }
                  },
                },
            })
            item.children.forEach((child, i) => {
                initNum++
                if(child.voice_link) {
                    val.push({
                        type: 'audio',
                        voice_link: child.voice_link,
                        question_id: child.question_id,
                        order: initNum,
                        title: child.question_content,
                        url: child.voice_link,
                        headBtns: {
                            horn: {
                                title: 'horn',
                                id: 'horn',
                                disabled: true,
                                isShow: true,
                            },
                            continue: {
                            title: 'CONTINUE',
                            id: 'continue',
                            disabled: false,
                            isShow: true,
                            onClick: () => {
                                step.value++
                            }
                          },
                          
                        },
                    })
                }
                val.push({
                    ...child,
                    type: 'question',
                    order: initNum,
                    headBtns: {
                        help: {
                            title: 'HELP',
                            id: 'help',
                            disabled: false,
                            isShow: true,
                            onClick: () => {
                              console.log('help')
                              showHelp.value = true
                            }
                        },
                        prev: {
                            title: 'BACK',
                            disabled: false,
                            id: 'prev',
                            isShow: true,
                            onClick: () => {
                                if(step.value > 0) {
                                    step.value--
                                }
                            }
                        },
                        next: {
                            title: 'NEXT',
                            id: 'next',
                            disabled: false,
                            isShow: sumLength !== initNum,
                            onClick: () => {
                                step.value++
                            }
                        },
                        submit: {
                            title: 'SUBMIT',
                            id: 'submit',
                            disabled: false,
                            isShow: sumLength === initNum,
                            onClick: () => {
                              requestSubmitExam()
                            }
                        },
                    },
                })
            })
            return val
        }, [
            {
                type: 'info',
                headBtns: {
                    continue: {
                    title: 'CONTINUE',
                    id: 'continue',
                    disabled: false,
                    isShow: true,
                    onClick: () => {
                      if(showHelp.value) {
                        showHelp.value = false
                      }else {
                        step.value++
                      }
                        
                    }
                  }
                },
                title: 'Listening',
                info_title: 'Listening Section Directions',
                is_show_footer: true,
                question_title: [
                    `In this section, you will be able to demonstrate your ability to understand conversations and lectures in English. The section is divided into two separately timed parts. You will hear each conversation or lecture only one time.`,
                    `A clock will indicate how much time remains. The clock will count down only while you are answering questions, not while you are listening. In some questions, you`,
                    `will see this icon: <div class="listen-icon"></div> . This means that you will hear, but not see, part of the question.`,
                    `You must answer each question. After you answer, select <button class="nextbtn">Next</button> . In the actual test, you cannot return to previous questions.`
                ]
            }
        ])
        answerData.length = 0
        answerData.push(...answerRes)
        questionData.value.sumQuesLength = sumLength;
      } catch (error) {
        $router.back()
      }
    }
    const nextQuestion = () => {
      step.value = step.value + 1
    }
    const curQuestion = computed(() => {
        if(!questionData.value?.formatQuestion) return {}
        $router.replace({
            query: {
                ...$route.query,
                step: step.value
            }
        })
        return showHelp.value ? questionData.value?.formatQuestion?.[0] : questionData.value?.formatQuestion?.[step.value]
    })
    /**
     * [requestSubmitExam 计算分数，跳转到result页面]
     *
     */
    const requestSubmitExam = async () => {
      const {query, meta} = $route
      await request_submitExam(query?.id)
      if(query?.type === 'mixedExam' && query?.mid && query?.mid){
        const mixdata = getWithExpiry(`mixedExam-${query?.mid}`)
        await request_computed_score(query?.id)
        await request_get_result(query?.id)
        await examStore.startExam('mock_exam', mixdata?.quesid[2], mixdata?.father_sheet)
        $router.push({
            name: 'spokenExam',
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
      const {query} = $route
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
      questionData,
      showHelp,
      saveQuestion,
      nextQuestion,
      curQuestion,
      processData,
      answerData,
      getExamData,
      requestSubmitExam
    };
  })