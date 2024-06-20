import { startStream } from "@/service/ai";
import { useIndexStore } from "@/stores/index";
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
let starindex = 0;
export const useAIStore = defineStore('ai', () => {
  const list = reactive<any>([])
  const indexStore = useIndexStore()
  const indexInit = ref(false)
  const aiParams = {
    // Contains a string of which category of TOEFL the query is from
    // Can be "Reading","Listening", "Speaking", or "Writing"
    toeflType: '',
    // Contains a string of which 快键 was used
    // Can be“,“段落逻辑”,or“听力逻辑"
    // 段落逻辑 is exclusive to Reading toeflType
    // 听力逻辑 is exclusive to Listening toeflType
    // Speaking and Writing toeflType can only have 其他问题
    // 【阅读】： 错题解析”,“解题思路”,“重点信息",段落逻辑  /  其他问题 input 发送的时候
    // 【听力】： 错题解析”,“解题思路”,“重点信息",听力逻辑  /  其他问题 input 发送的时候
    // 【口语】： 其他问题 input 发送的时候
    // 【写作】： 其他问题 input 发送的时候
    queryType: '', 
    // Contains the query the student enters into the chatbox
    // Only needed for 其他问题 queryType
    // 输入的文本内容
    chatbotQuery: '',
    // Contains the "passage" for whatever toeflType
    // Needed for every queryTypel
    // Reading -the corresponding paragraph in the reading question
    // Listening -the corresponding transcript for the listening question
    // Speaking-the corresponding stimulus the student reads/listens to for their question
    // Writing - the corresponding stimulus the student reads/listens to for their question
    // '\n'
    'Main Content': '',
    // Contains the multiple choice question the student is asking questions about
    // Only used for 错题解析,解题思路,重点信息 queryTypes
    // 题目
    mcq: '',
    // Contains the general method to find the solution for that question type
    // Only used for 解题思路 queryType
    problemMethod: ''
  }
  const init = async () => {
    if(indexInit.value) return
    list.push({
      type: 'receive',
      name: '鹦鹉AI助教',
      isEnd: false,
      id: 'init',
      content: ['Hi\n there! \nNice \nto \nmeet \nyou! \n如\n果\n你\n对\n托\n福\n学\n习\n有\n任\n何\n问\n题\n都\n可\n以\n在\n这\n里\n向\n我\n提\n问\n！']
    })
    indexInit.value = true
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
            isEnd: false,
            name: '鹦鹉AI助教',
            content: massages
          })
          eventSource.close()
      }
    }
  }
  const setIsEnd = (id) => {
    const res = list.find(item => item.id === id);
    if(res && res.isEnd){
      res.isEnd = true
    }
  }
  return {
    init,
    list,
    sendMessage,
    setIsEnd
  }
})