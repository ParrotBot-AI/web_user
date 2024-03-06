// 单词统计
import http from "@/utils/http";

export const request_get_vocabs_statics = (id:number) => {
  return http.get(`api/system/microservice/get_vocabs_statics/${id}/`)
}

export const request_get_vocabs_tasks = (id:number) => {
  return http.get(`api/system/microservice/get_vocabs_tasks/${id}/`)
}