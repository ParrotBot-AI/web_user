import http from "@/utils/http";

export const request_login = (data) => {
  return http.post('/login', data)
}