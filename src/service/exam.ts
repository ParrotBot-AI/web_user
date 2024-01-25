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