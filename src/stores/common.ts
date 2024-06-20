import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useIndexStore } from "./index"
export const useCommonStore = defineStore('utils', () => {
  const index = useIndexStore()
  const $router = useRouter()
  const $route = useRoute()
  const toQuestionList = () => {
    const pattern_id = index.menuData.list.find(val => val.key === $route.name)?.pattern_id
    if(pattern_id){
      $router.push(`/questions/${pattern_id}`)
    } else {
      console.error('Route jump failed : pattern_id is not found')
    }
  }
  return {
    toQuestionList
  }
})