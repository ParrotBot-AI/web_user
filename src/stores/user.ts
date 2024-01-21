import { ref } from 'vue'
import { defineStore } from 'pinia'
import {request_login, request_sms} from "@/service/user"
import type { LOGIN_TYPE_SMS, LOGIN_TYPE_PHOME } from "@/service/user"
import {message} from "ant-design-vue"
type LoginType = 'code' | 'password' | 'findPassword'
export const useUserStore = defineStore('user', () => {
  const loginType = ref<LoginType>('code')
  // 切换登录方式
  const onClickChangeLoginType = (type:LoginType) => {
    loginType.value = type
  }
  const api_sms = async (phoneNumber:string, resetCode: () => void) => {
    try {
      await request_sms({phone: phoneNumber, type: 1})
    }catch (e) {
      message.error('获取验证码失败')
      resetCode()
    }
  }
  const api_login = async (data: LOGIN_TYPE_SMS | LOGIN_TYPE_PHOME) => {
    await request_login(data)
  }
  return {onClickChangeLoginType, loginType, api_sms, api_login}
})
