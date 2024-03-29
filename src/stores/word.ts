import { defineStore } from 'pinia'
import http from "@/utils/http";
import { reactive } from 'vue'
import { useIndexStore } from "./index"
import { useRouter, useRoute } from 'vue-router'
import {request_get_vocabs_statics, request_get_vocabs_tasks, request_start_vocabs_tasks, request_learn_vocabs_tasks} from "@/service/word";
export const useWordStore = defineStore('word', () => {
  const indexStore = useIndexStore()
  const $router = useRouter()
  const $route = useRoute()
  const vocabs_statics_data = reactive<{
    last_day_review: number; 
    last_day_study: number;
    series: any[];
    status_book: any[];
    today_day_review: number;
    today_day_study: number;
    total_review: number;
    total_study: number;
  }>({
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
    status_book: [
      {       
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
      }
    ],
    
    today_day_review: 0,
    today_day_study: 0,
    total_review: 0,
    total_study: 0,
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
    },
    is_end: boolean,
    is_answer: boolean
  }>({})
  const get_vocabs_statics = async () => {
    const res = await request_get_vocabs_statics(indexStore.userInfo.account_id)
    console.log(res)
    vocabs_statics_data.series = res.series
    vocabs_statics_data.last_day_review = res.last_day_review
    vocabs_statics_data.last_day_study = res.last_day_study
    vocabs_statics_data.today_day_review = res.today_day_review
    vocabs_statics_data.today_day_study= res.today_day_study
    vocabs_statics_data.total_review = res.total_review
    vocabs_statics_data.total_study = res.total_study
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
    const task_account_id = Number($route.query.id)
    const { payload } = await request_start_vocabs_tasks(task_account_id!)
    wordTaskData.payload = {
      ...payload,
    }
    wordTaskData.is_answer = false
  }
  const connectSSE = (url:string) => {
    const eventSource = new EventSource(url);

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

  const next = async (data:any) => {
    try {
      const { payload } = await request_learn_vocabs_tasks({
        task_account_id: Number($route.query.id),
        payload: data
      })
      // console.log(payload)
      if(payload.endpoints) {
        const {
          input,
          method,
          url
        } = payload.endpoints.init
        const streaming = payload.endpoints.streaming
        const { clientId } = await http[method](url, input)
        wordTaskData.is_end = false
        wordTaskData.payload = {
          ...payload,
          response: [],
        }
        connectSSE(streaming.url.replace('{ClientID}', clientId));
      } else {
        wordTaskData.payload = {
          ...payload,
        }
        wordTaskData.is_answer = false
      }
    } catch (error) {
      console.log(error)
    }
  }

  const submit_task = async (i: number) => {
    wordTaskData.payload.answer[i] = 1
    wordTaskData.is_answer = true
    next({payload:wordTaskData.payload})
  }

  const submit_unknown = () => {
    wordTaskData.payload.unknown = true
    wordTaskData.is_answer = true
    next({payload:wordTaskData.payload})
  }

  const aiNext = async () => {
    console.log(wordTaskData)
    await request_learn_vocabs_tasks({
      task_account_id: Number($route.query.id),
      payload: {
        payload: {
          ...wordTaskData.payload,
          execute: true,
          response: wordTaskData.payload.response?.join('').replaceAll('\n', ''),
        }
      }
    })
  }

  return {
    vocabs_statics_data,
    get_vocabs_statics,
    get_vocabs_tasks,
    start_task,
    to_task,
    aiNext,
    wordTaskData,
    submit_task,
    submit_unknown
  }
  
})