import router from "@/router"
import type { LOGIN_TYPE_PHOME, LOGIN_TYPE_SMS, RESRPASSWOED, SETUSERINFO } from "@/service/user"
import { get_account_checkin, request_login, request_logout, request_resetPassword, request_setUserInfo, request_sms } from "@/service/user"
import { removeWithExpiry, setWithExpiry } from "@/utils/storage"
import { message } from "ant-design-vue"
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useIndexStore } from './index'
type LoginType = 'code' | 'password' | 'findPassword'
export const useUserStore = defineStore('user', () => {
  const loginType = ref<LoginType>('code')
  const homeCharts = reactive<any[]>([])
  const homeDate = ref('')
  const homeDaka = reactive([])
  const indexStore = useIndexStore()
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
    removeWithExpiry('usermenu');
    removeWithExpiry('userdata');
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

  const api_setUserInfo = async (userId:number, data: SETUSERINFO) => {
    await request_setUserInfo(userId, data)
  } 

  const api_out = async () => {
    await request_logout()
    window.localStorage.clear()
  }
  const api_checkin = async () => {
    const account_id = indexStore.userInfo.account_id
    const {charts, current, daka, info} = await get_account_checkin(account_id)
    homeCharts.length = 0
    homeCharts.push(...charts)
    homeDate.value = current
    homeDaka.length = 0
    homeDaka.push(...daka.map(val => ({
      ...val,
      class: val.lock ? 'lock' : val.count_process === val.count_target ? 'success' : val.date === current ? 'today' : ''
    })))
    indexStore.userTargets.forEach(val => {
      val.val = info[val.id]
    })
  }
  return {
    onClickChangeLoginType, loginType, api_sms, 
    api_login, 
    api_findPassword, 
    api_out, 
    api_setUserInfo, 
    api_checkin,
    homeCharts,
    homeDate,
    homeDaka
  }
})
