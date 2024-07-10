import { ref, computed } from "vue"
export function useGetCode(count: number = 60) {
  const getCodeCountdown = ref(count)
  const getCodeCountdownFlag = ref(false)
  const getCodeBtnText = computed(() => {
    if (getCodeCountdown.value > 0 && getCodeCountdownFlag.value) {
      return `${getCodeCountdown.value}秒后重新获取`
    }
    return '获取验证码'
  })
  function getCode(phoneNumber: string, onGetCode: (phoneNumber: string) => void) {
    if (!phoneNumber || getCodeCountdownFlag.value) {
      return
    }
    onGetCode(phoneNumber)
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
  function resetCode() {
    getCodeCountdown.value = 60
    getCodeCountdownFlag.value = false
  }
  return { getCode, getCodeBtnText, getCodeCountdownFlag, resetCode }
}