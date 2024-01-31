import http from "@/utils/http";
type EXAM_RESOURCE = {
  exam_id: number
  pattern_id: number
  whether_zt: boolean
  page?: number
  limit?: number
}
export const request_getExamResource = (data: EXAM_RESOURCE) => {
  return http.post(`/api/system/microservice/resource/`, data)
}

type EXAN_START = {
  user_id: number
  question_ids: number[]
}

export const request_startExam = (data: EXAN_START) => {
  return http.post(`/api/system/microservice/create_mock/`, data)
}

export const request_getExam = (id: string) => {
  return http.get(`/api/system/microservice/get_mock/${id}`)
}