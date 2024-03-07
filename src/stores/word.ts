import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useIndexStore } from "./index"
import {request_get_vocabs_statics, request_get_vocabs_tasks} from "@/service/word";
export const useWordStore = defineStore('word', () => {
  const indexStore = useIndexStore()
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
  } 
  return {
    vocabs_statics_data,
    get_vocabs_statics,
    get_vocabs_tasks
  }
  
})