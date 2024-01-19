import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {request_login} from "@/service/login"
type LoginType = 'code' | 'password' | 'findPassword'
export const useUserStore = defineStore('user', () => {
  const loginType = ref<LoginType>('code')
  // 切换登录方式
  const onClickChangeLoginType = (type:LoginType) => {
    loginType.value = type
  }
  

  return {onClickChangeLoginType, loginType}
})
