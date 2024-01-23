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

export const useIndexStore = defineStore('menu', () => {
  const curRoute = useRoute()
  const userInfo = reactive({})
  const userTargets = reactive([
    {
      id: '1',
      icon: Union,
      val: 0,
      desc: '目前预测分数',
    },
    {
      id: '2',
      icon: Group,
      val: 0,
      desc: '已经学习天数',
    },
    {
      id: '3',
      val: 0,
      icon: Hourglass,
      desc: '距离考试天数',
    }
  ])
  const menuData = reactive<{
    list: MENUITEM[];
    current: Array<string | number>;
  }>({
    list: [],
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
          icon: item.icon
        }
      }),
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

  const requestUserInfo = async (userId: number) => {
    await request_userInfo(userId)
  }

  return { getMenuValue, menuData, menuList, userTargets, requestUserInfo };
})

