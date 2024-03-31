import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import {request_login, request_sms, request_resetPassword, request_logout, request_setUserInfo, get_account_checkin} from "@/service/user"
import {setWithExpiry, removeWithExpiry} from "@/utils/storage"
import router from "@/router"
import type { LOGIN_TYPE_SMS, LOGIN_TYPE_PHOME, RESRPASSWOED, SETUSERINFO } from "@/service/user"
import {message} from "ant-design-vue"
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
    const {charts, current, daka} = await get_account_checkin(account_id)
    homeCharts.length = 0
    const todayIndex = charts.findIndex(val => val.date === current)
    homeCharts.push(...charts.map((val:any,i) => {
      let classname = ''
      if(i < todayIndex) {
        if(val.study_time > 0 && val.login_count > 0) {
          classname = 'success'
        } else {
          classname = 'fail'
        }
      } else if(i === todayIndex) { 
        classname = 'today'
      } else if (i > todayIndex) {
        classname = 'lock'
      }
      return {
        ...val,
        todayDake: daka.find(val => val.date === current) ? daka.find(val => val.date === current) : null,
        class: classname,
      }
    }))
    homeDate.value = current
    homeDaka.length = 0
    homeDaka.push(...daka)
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
