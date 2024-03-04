import { defineStore } from 'pinia'
import { reactive } from 'vue'
import {request_get_vocabs_statics} from "@/service/word";
export const useWordStore = defineStore('word', () => {
  const vocabs_statics_data = reactive({})
  const get_vocabs_statics = async () => {
    const res = await request_get_vocabs_statics('7')
    console.log(res)
  }
  return {
    vocabs_statics_data,
    get_vocabs_statics
  }
})