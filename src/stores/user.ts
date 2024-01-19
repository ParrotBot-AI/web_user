import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {request_login} from "@/service/login"
export const useUserStore = defineStore('user', () => {
  const getCodeCountdown = ref(60)
  const getCodeCountdownFlag = ref(false)
  const loginType = ref('code')
  const getCodeBtnText = computed(() => {
    if(getCodeCountdown.value > 0 && getCodeCountdownFlag.value) {
      return `${getCodeCountdown.value}秒后重新获取`
    }
    return '获取验证码'
  })
  // 切换登录方式
  const onClickChangeLoginType = (type:'code' | 'password') => {
    loginType.value = type
  }
  function getCode(phoneNumber:string) {
    if(!phoneNumber || getCodeCountdownFlag.value){
      return
    }
    console.log('获取验证🐴')
    getCodeCountdownFlag.value = true
    let time = getCodeCountdown.value
    const timer = setInterval(() => {
      time--
      getCodeCountdown.value = time
      if (time <= 0) {
        clearInterval(timer)
        getCodeCountdown.value = 60
        getCodeCountdownFlag.value = false
      }
    }, 1000)
  }

  return { getCodeBtnText, getCode, onClickChangeLoginType, loginType}
})
