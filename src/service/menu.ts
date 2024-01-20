import http from "@/utils/http";

export const request_menu = (data) => {
  return http.post('/menu', data)
}