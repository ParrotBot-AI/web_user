import http from "@/utils/http";
type LOGIN_TYPE = {
  type: 'account' | 'sms';
  mobile?: string;
  code?: string;
  password?: string;
  username?: string;
}
export const request_login = (data:LOGIN_TYPE) => {
  return http.post('/login', data)
}