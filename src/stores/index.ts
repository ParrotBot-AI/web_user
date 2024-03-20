import { reactive, computed, h, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { request_userInfo } from '@/service/user'
import type { MENUITEM } from "@/service/user"
import { IconFont } from "@/plugins/ui"
import { useRoute } from "vue-router"
import { formatStr } from "@/utils/utils"
import Union from "@/assets/homeIcon/Union.svg"
import Hourglass from "@/assets/homeIcon/Hourglass.svg"
import Group from "@/assets/homeIcon/Group.svg"
import { request_getAccount_id } from '@/service/user' 


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
      id: 'total_study_days',
      icon: Group,
      val: 0,
      desc: '已经学习天数',
    },
    {
      id: 'next_test',
      val: 0,
      icon: Hourglass,
      desc: '距离考试天数',
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

  const requestUserInfo = async (userId: number) => {
    const res = await request_userInfo(userId)
    const { account_id } = await request_getAccount_id(userId, { exam_id: 1 })
    userTargets.forEach(val => {
      val.val = res[val.id]
    })
    userTargetsList.today = res.tdy
    userTargetsList.tomorrow = res.tmr
    userInfo.userId = userId
    userInfo.username = res.username
    userInfo.email = res.email
    userInfo.mobile = res.mobile
    userInfo.avatar = res.avatar
    userInfo.name = res.name
    userInfo.account_id = account_id
  }

  return { getMenuValue, menuData, menuList, userTargets, requestUserInfo, userTargetsList, userInfo, menuBottomList };
})

