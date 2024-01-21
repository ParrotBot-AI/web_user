import http from "@/utils/http";
export type LOGIN_TYPE_SMS = {
  type: 'sms';
  mobile: string;
  code: string;
}
export type LOGIN_TYPE_PHOME = {
  type: 'account';
  password: string;
  username: string;
}
export const request_login = (data:LOGIN_TYPE_SMS | LOGIN_TYPE_PHOME) => {
  return http.post('/api/login', data)
}
type SMS_TYPE = {
  phone: string;
  type: 1
}
export const request_sms = (data:SMS_TYPE) => {
  return http.post('/api/sms/send_login_sms', data)
}

export const request_logout = () => {
  return http.post('/api/logout')
}

export const request_menu = () => {
  return http.get('/api/system/menu/')
}