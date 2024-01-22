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

export type RESRPASSWOED = {
  mobile: string;
  code: string;
  password: string;
}
export const request_login = (data:LOGIN_TYPE_SMS | LOGIN_TYPE_PHOME) => {
  return http.post<{
    name: string;
    access: string;
    avatar: string;
    refresh: string;
    userId: number;
    user_type: number;
  }>('/api/login/', {
    ...data
  }, {
    ignoreAuth: true
  })
}
type SMS_TYPE = {
  phone: string;
  type: 1
}
export const request_sms = (data:SMS_TYPE) => {
  return http.post('/api/sms/send_login_sms/', {
    ...data,
  }, {
    ignoreAuth: true
  })
}

export const request_resetPassword = (data:RESRPASSWOED) => {
  return http.post('/api/system/user/39/reset_password/', {
    ...data,
  }, {
    ignoreAuth: true
  })
}

export const request_logout = () => {
  return http.post('/api/logout/')
}

export type MENUITEM = { id: string; name: string, icon: string }
export const request_menu = () => {
  return http.get<{
    page: number;
    limit: number; 
    total: number;
    data: MENUITEM[]
  }>('/api/system/menu/')
}