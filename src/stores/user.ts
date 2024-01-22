import { ref } from 'vue'
import { defineStore } from 'pinia'
import {request_login, request_sms, request_resetPassword, request_logout} from "@/service/user"
import {setWithExpiry} from "@/utils/storage"
import router from "@/router"
import type { LOGIN_TYPE_SMS, LOGIN_TYPE_PHOME, RESRPASSWOED } from "@/service/user"
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
    const res = await request_login(data)
    setWithExpiry('userinfo', res, null);
    message.success('登录成功',1, () => {
      if((res.name)) {
        router.push('/home')
      } else {
        router.push('/welcome')
      }
    })
  }
  const api_findPassword = async (data: RESRPASSWOED) => {
    const res = await request_resetPassword(data)
    console.log('api_findPassword', res)
  }
  const api_out = async () => {
    await request_logout()
  }
  return {onClickChangeLoginType, loginType, api_sms, api_login, api_findPassword, api_out}
})
