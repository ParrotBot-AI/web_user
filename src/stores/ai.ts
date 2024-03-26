import { defineStore } from 'pinia'
import http from "@/utils/http";
import { reactive, ref } from 'vue'
import { useIndexStore } from "@/stores/index"
import { useRouter, useRoute } from 'vue-router'
import {startStream, sendAi} from "@/service/ai";
let starindex = 0;
export const useAIStore = defineStore('ai', () => {
  const list = reactive<any>([])
  const indexStore = useIndexStore()
  const aiParams = {
    toeflType: '',
    queryType: '',
    chatbotQuery: '',
    'Main Content': '',
    mcq: '',
    problemMethod: ''
  }
  const init = async () => {
    list.push({
      type: 'receive',
      name: '鹦鹉AI助教',
      id: 'init',
      content: ['Hi\n there! \nNice \nto \nmeet \nyou! \n如\n果\n你\n对\n托\n福\n学\n习\n有\n任\n何\n问\n题\n都\n可\n以\n在\n这\n里\n向\n我\n提\n问\n！']
    })
    
  }

  const sendMessage = async (chatbotQuery:string) => {
    list.push({
      type: 'send',
      id: starindex++,
      name: indexStore.userInfo.name,
      content: chatbotQuery
    })
    const {clientId} = await startStream({
      ...aiParams,
      chatbotQuery,
      toeflType: 'Writing',
      queryType: '其他问题'
    })
    const massages = [] 
    const eventSource = new EventSource(`${import.meta.env.VITE_AI_APP_BASEURL}/v1/modelapi/assistantChatbot/${clientId}/`)
    eventSource.onmessage = function(event) {
      massages.push(event.data.replace(/\[DONE!\]/, ''))
      if(event.data.match(/\[DONE!\]/)){
          list.push({
            type: 'receive',
            id: starindex++,
            name: '鹦鹉AI助教',
            content: massages
          })
          eventSource.close()
      }
    }
  }
  return {
    init,
    list,
    sendMessage
  }
})