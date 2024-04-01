import Group from "@/assets/homeIcon/Group.svg"
import Hourglass from "@/assets/homeIcon/Hourglass.svg"
import Union from "@/assets/homeIcon/Union.svg"
import { IconFont } from "@/plugins/ui"
import type { MENUITEM } from "@/service/user"
import { request_getAccount_id, request_menu, request_update_checkin, request_userInfo, requst_update_questionnaire } from '@/service/user'
import { getWithExpiry, setWithExpiry } from "@/utils/storage"
import { formatStr } from "@/utils/utils"
import { defineStore } from 'pinia'
import { computed, h, reactive, watchEffect } from 'vue'
import { useRoute } from "vue-router"


export const useIndexStore = defineStore('menu', () => {
  const curRoute = useRoute()
  const userInfo = reactive({
    "userId": 0,
    "username": "",
    "email": "",
    "mobile": "",
    "avatar": "",
    "name": "",
    "account_id": 0
  })
  const userTargets = reactive([
    {
      id: 'est_score',
      icon: Union,
      val: 0,
      desc: '目前预测分数',
    },
    {
      id: 'study_day',
      icon: Group,
      val: 0,
      desc: '已经学习天数',
    },
    {
      id: 'test_due',
      val: 0,
      icon: Hourglass,
      desc: '距离考试天数',
    },
    {
      id: 'vip_due',
      val: 0,
      icon: Hourglass,
      desc: 'VIP到期天数',
    }
  ])
  const userTargetsList = reactive({
    today: [],
    tomorrow: [],
  })
  const menuData = reactive<{
    list: MENUITEM[];
    bottomList: MENUITEM[];
    current: Array<string | number>;
  }>({
    list: [],
    bottomList: [],
    current: ['home']
  });

  async function getMenuValue(data: MENUITEM[]) {

    menuData.list = [
      { "id": "home", "name": "看板", icon: 'home', key: 'home' },
      ...data.map(item => {
        const name = formatStr(item.icon)
        return {
          key: name[0].toLowerCase() + name.slice(1),
          "id": item.id,
          "name": item.name,
          icon: item.icon,
          pattern_id: item.pattern_id
        }
      })
    ]
    menuData.bottomList = [
      { "id": "price", "name": "价格", icon: 'price', 'key': 'price' },
      { "id": "setting", "name": "设置", icon: 'setting', 'key': 'setting' }
    ]
  }
  watchEffect(() => {
    menuData.current = [(curRoute.name as string) || 'home']
  })
  const menuList = computed(() => {
    return menuData.list.map(item => {
      return {
        key: item.key,
        label: item.name,
        icon: () => h(IconFont, { type: `icon-${item.icon}` })
      }
    })
  })
  const menuBottomList = computed(() => {
    return menuData.bottomList.map(item => {
      return {
        key: item.key,
        label: item.name,
        icon: () => h(IconFont, { type: `icon-${item.icon}` })
      }
    })
  })
  const requestMenu = async () => {
    const _usermenu = getWithExpiry('usermenu')!
    if(_usermenu) {
      return Promise.resolve(_usermenu)
    }
    const res = await request_menu()
    setWithExpiry('usermenu', res, 1000 * 60 * 60 * 24)
    return res
  }
  const daka = async () => {
    const res = await request_update_checkin(userInfo.account_id)
    console.log(res)
  }
  const requestUserInfo = async (to, userId: number) => {
    const _userInfo = getWithExpiry<any>('userdata')!;
    if(_userInfo && to.name !== 'home') {
      userInfo.userId = userId
      userInfo.username = _userInfo.username
      userInfo.email = _userInfo.email
      userInfo.mobile = _userInfo.mobile
      userInfo.avatar = _userInfo.avatar
      userInfo.name = _userInfo.name
      userTargetsList.today = _userInfo.today
      userTargetsList.tomorrow = _userInfo.tomorrow
      userInfo.account_id = _userInfo.account_id
      return Promise.resolve(userInfo)
    }
    const res = await request_userInfo(userId)
    const { account_id } = await request_getAccount_id(userId, { exam_id: 1 })
    userTargetsList.today = res.tdy
    userTargetsList.tomorrow = res.tmr
    userInfo.userId = userId
    userInfo.username = res.username
    userInfo.email = res.email
    userInfo.mobile = res.mobile
    userInfo.avatar = res.avatar
    userInfo.name = res.name
    userInfo.account_id = account_id
    setWithExpiry('userdata', {
      ...userInfo,
      today: res.tdy,
      tomorrow: res.tmr
    }, 1000 * 60 * 60 * 24)
  }
  const set_update_questionnaire = async (data: any) => {
    const res = await requst_update_questionnaire({
      account_id: userInfo.account_id,
      ...data,
    })
    console.log(res);
    
  }
  return { daka, request_update_checkin, set_update_questionnaire, requestMenu, getMenuValue, menuData, menuList, userTargets, requestUserInfo, userTargetsList, userInfo, menuBottomList };
})

