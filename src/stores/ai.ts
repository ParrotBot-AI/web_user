import { defineStore } from 'pinia'
import http from "@/utils/http";
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {startStream, sendAi} from "@/service/ai";
export const useAIStore = defineStore('ai', () => {

  const aiParams = {
    toeflType: '',
    queryType: '',
    chatbotQuery: '',
    'Main Content': '',
    mcq: '',
    problemMethod: ''
  }
  const init = async (chatbotQuery:string) => {
    const {clientId} = await startStream({
      ...aiParams,
      chatbotQuery: '帮我给用合作，笨蛋，这两个词编一篇作文',
      toeflType: 'Writing',
      queryType: '其他问题'
    })
    const eventSource = new EventSource(`${import.meta.env.VITE_AI_APP_BASEURL}/v1/modelapi/assistantChatbot/${clientId}/`)
    eventSource.onmessage = function(event) {
      console.log(event)
    }
  }

  return {
    init
  }
})