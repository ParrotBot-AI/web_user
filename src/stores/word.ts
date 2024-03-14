import { defineStore } from 'pinia'
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
    },
    is_answer: boolean
  }>({})
  const get_vocabs_statics = async () => {
    const res = await request_get_vocabs_statics(indexStore.userInfo.account_id)
    vocabs_statics_data.series = res.series
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

  const submit_task = async (i: number) => {
    wordTaskData.payload.answer[i] = 1
    wordTaskData.is_answer = true
    const data = {
      task_account_id: Number($route.query.id),
      payload: {
        payload:wordTaskData.payload
      }
    }
    const { payload } = await request_learn_vocabs_tasks(data)
    wordTaskData.payload = {
      ...payload,
    }
    wordTaskData.is_answer = false
  }
  return {
    vocabs_statics_data,
    get_vocabs_statics,
    get_vocabs_tasks,
    start_task,
    to_task,
    wordTaskData,
    submit_task
  }
  
})