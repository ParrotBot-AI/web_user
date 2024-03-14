// 单词统计
import http from "@/utils/http";

export const request_get_vocabs_statics = (id:number) => {
  return http.get(`api/system/microservice/get_vocabs_statics/${id}/`)
}

export const request_get_vocabs_tasks = (id:number) => {
  return http.get(`api/system/microservice/get_vocabs_tasks/${id}/`)
}

// 开始任务
export const request_start_vocabs_tasks = (id:number) => {
  return http.post(`api/system/microservice/start_task/`, {
    task_account_id:id
  })
}
// 学习进行任务
export const request_learn_vocabs_tasks = (data) => {
  return http.post(`api/system/microservice/learning_task/`, data)
}