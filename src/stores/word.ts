import { startStream } from "@/service/ai";
import {
  request_get_vocabs_statics,
  request_get_vocabs_tasks,
  request_jump,
  request_learn_vocabs_tasks,
  request_refuse_jump,
  request_start_vocabs_tasks,
} from "@/service/word";
import { message } from "ant-design-vue";
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIndexStore } from "./index";
export const useWordStore = defineStore('word', () => {
  const indexStore = useIndexStore()
  const $router = useRouter()
  const $route = useRoute()
  const vocabs_statics_data = reactive<{
    last_day_review: number; 
    last_day_study: number;
    series: any[];
    status_book: any;
    today_day_review: number;
    today_day_study: number;
    total_review: number;
    total_study: number;
    vocab: number;
    refuse_skip: boolean | null;
    is_skip_remind: boolean | null;
  }>({
    is_skip_remind: null,
    last_day_review: 0,
    last_day_study: 0,
    series: [
      {
      "correct_words": 0, 
      "day": "2024-03-04",   
      "wrong_words": 0, 
      },
      {
      "correct_words": 0,    
      "day": "2024-03-03",    
      "wrong_words": 0 
      },
      {
      "correct_words": 0, 
      "day": "2024-03-02", 
      "wrong_words": 0 
      },
      {
      "correct_words": 0, 
      "day": "2024-03-01", 
      "wrong_words": 0 
      },
      {
      "correct_words": 0, 
      "day": "2024-02-29", 
      "wrong_words": 0 
      }
    ], 
    status_book: {       
      "current_level": 1,
      "level_book": [
        {
            "counts": 5262,
            "id": 1,
            "name": "4/6级单词",
            "order": 1
        },
        {
            "counts": 1905,
            "id": 2,
            "name": "托福核心词汇",
            "order": 100
        },
        {
            "counts": 335,
            "id": 3,
            "name": "托福学科词汇",
            "order": 101
        }
      ],
      "level_status": 7502,
      "level_total": 5262
    },
    today_day_review: 0,
    today_day_study: 0,
    total_review: 0,
    total_study: 0,
    vocab: 0,
  })
  const vocabs_tasks_data = reactive<Array<{
    complete_p: number 
    is_complete: boolean 
    order: number
    task_account_id: number
    task_id: number
    task_name: string
  }>>([])
  const TYPES = {
    new: '学习新单词',
    old: '复习旧单词'
  }
  const wordTaskData = reactive<{
    payload: {
      answer: number[]
      correct_answer: number[]
      stem:string[]
      study: boolean
      target: string[]
      unknown: boolean
      word:string
      word_id: number
      word_ids: number[]
      response?: string[]
      hint: string | null
    },
    is_end: boolean,
    is_answer: boolean
    is_error: boolean
  }>({
    payload: {
      answer: [],
      correct_answer: [],
      stem: [],
      study: false,
      target: [],
      unknown: false,
      word: '',
      word_id: 0,
      word_ids: [],
      hint: null
    },
    is_end: false,
    is_answer: false,
    is_error: false
  })
  const finished = ref(false)
  const get_vocabs_statics = async () => {
    const res = await request_get_vocabs_statics(indexStore.userInfo.account_id)
    vocabs_statics_data.series = res.series
    vocabs_statics_data.last_day_review = res.last_day_review
    vocabs_statics_data.last_day_study = res.last_day_study
    vocabs_statics_data.today_day_review = res.today_day_review
    vocabs_statics_data.today_day_study= res.today_day_study
    vocabs_statics_data.total_review = res.total_review
    vocabs_statics_data.total_study = res.total_study
    vocabs_statics_data.status_book = res.status_book
    vocabs_statics_data.is_skip_remind = res.is_skip_remind
    vocabs_statics_data.refuse_skip = res.refuse_skip
    vocabs_statics_data.vocab = res.vocab
  }
  const get_vocabs_tasks = async () => {
    const res = await request_get_vocabs_tasks(indexStore.userInfo.account_id)
    vocabs_tasks_data.length = 0
    vocabs_tasks_data.push(...res)
  } 
  const to_task = async (task_type: keyof typeof TYPES) => {
    const task_name = TYPES[task_type]
    const task_account_id = vocabs_tasks_data.find(val => val.task_name === task_name)?.task_account_id
    $router.push({
      name: 'wordTask',
      query: {
        type: task_type,
        id: task_account_id
      }
    })
    
  }
  const start_task = async () => {
    try {
      const task_account_id = Number($route.query.id)
      if(task_account_id) {
        const { payload } = await request_start_vocabs_tasks(task_account_id!)
        wordTaskData.payload = {
          ...payload,
        }
        wordTaskData.is_answer = false
      } else {
        message.warning('今日任务已完成')
        $router.push('/wordRecite')
      }
    } catch (error) {
      $router.push('/wordRecite')
    }
  }
  const connectSSE = (clientId:string) => {
    const eventSource = new EventSource(`${import.meta.env.VITE_AI_APP_BASEURL}/v1/modelapi/getVocabContent/${clientId}/`)

    eventSource.onmessage = function(event) {
      wordTaskData.payload.response = [...wordTaskData.payload.response, event.data.replace(/\[DONE!\]/, '')]
      if(event.data.match(/\[DONE!\]/)) {
        wordTaskData.is_end = true
        eventSource.close();
      }
    };

    eventSource.onerror = function(error) {
        console.error("SSE error:", error);
        eventSource.close();
    };
  }
  const nextDataFormat = async (payload:any) => {
    if(payload.endpoints) {
      const {
        input,
      } = payload.endpoints.init
      const streaming = payload.endpoints.streaming
      const {clientId} = await startStream(input)
      // const { clientId } = await http[method](url, input)
      wordTaskData.is_end = false
      wordTaskData.payload = {
        ...payload,
        response: [],
      }
      connectSSE(clientId);
    } else {
      wordTaskData.payload = {
        ...payload,
      }
      wordTaskData.is_answer = false
    }
  }
  const next = async (data:any) => {
    try {
      const res = await request_learn_vocabs_tasks({
        task_account_id: Number($route.query.id),
        payload: data
      })
      if(res === 'finished') { 
        finished.value = true
      } else {
        const {payload} = res
        nextDataFormat(payload)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const submit_task = async (i: number) => {
    if(wordTaskData.is_error) {
      return
    }
    wordTaskData.payload.answer = wordTaskData.payload.answer.map(() => 0)
    wordTaskData.payload.answer[i] = 1
    // 正确的
    if(wordTaskData.payload.answer.join('') === wordTaskData.payload.correct_answer.join('')) {
      wordTaskData.is_answer = true
      next({payload:wordTaskData.payload})
    } else {
      wordTaskData.is_error = true
      wordTaskData.is_answer = true
    }
    
  }
  const error_next = () => {
    next({payload:wordTaskData.payload})
    wordTaskData.is_error = false
  }

  const submit_unknown = () => {
    wordTaskData.payload.unknown = true
    wordTaskData.is_answer = true
    wordTaskData.is_error = true
    // next({payload:wordTaskData.payload})
  }
  const submit_Study = () => {
    wordTaskData.payload.execute = true
    wordTaskData.payload.study = true
    wordTaskData.payload.response = wordTaskData.payload.response?.join('').replaceAll('\n','')
    wordTaskData.is_answer = true
    next({payload:wordTaskData.payload})
  }
  const aiNext = async () => {
    const { payload } = await request_learn_vocabs_tasks({
      task_account_id: Number($route.query.id),
      payload: {
        payload: {
          ...wordTaskData.payload,
          execute: true,
          response: wordTaskData.payload.response?.join('').replaceAll('\n', ''),
        }
      }
    })
    nextDataFormat(payload)
  }
  const dialogEvent = async (type) => {
    if(type) {
      const {current_level} = vocabs_statics_data.status_book
      const currentBook = vocabs_statics_data.status_book.level_book.findIndex(val => val.id === current_level)
      const next_level = vocabs_statics_data.status_book.level_book[currentBook + 1]
      if(next_level) {
        await request_jump({
          account_id: indexStore.userInfo.account_id,
          category_id: next_level.id
        })
      } else {
        await request_refuse_jump(indexStore.userInfo.account_id)
      }
    } else {
      await request_refuse_jump(indexStore.userInfo.account_id)
    }
    vocabs_statics_data.is_skip_remind = null
    vocabs_statics_data.refuse_skip = true
  }
  const on_jump_vocabs = async (i) => {
    await request_jump({
      account_id: indexStore.userInfo.account_id,
      category_id: vocabs_statics_data.status_book.level_book[i]?.id
    })
    get_vocabs_statics()
  }
  return {
    submit_Study,
    vocabs_statics_data,
    vocabs_tasks_data,
    on_jump_vocabs,
    dialogEvent,
    get_vocabs_statics,
    get_vocabs_tasks,
    start_task,
    to_task,
    aiNext,
    wordTaskData,
    submit_task,
    submit_unknown,
    finished,
    error_next
  }
  
})