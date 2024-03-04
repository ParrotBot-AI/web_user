// 单词统计
import http from "@/utils/http";

export const request_get_vocabs_statics = (id:string) => {
  return http.get(`api/system/microservice/get_vocabs_statics/${id}/`)
}