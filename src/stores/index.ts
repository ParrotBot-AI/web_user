import { reactive, computed, h } from 'vue'
import { defineStore } from 'pinia'
import { request_menu } from "@/service/user"
import type {MENUITEM} from "@/service/user"
import {IconFont} from "@/plugins/ui"
import { useRoute } from "vue-router"
export const useIndexStore = defineStore('menu', () => {
  const menuData = reactive<{
    list: MENUITEM[];
    current: Array<string | number>;
  }>({
    list: [],
    current: ['home']
  });
  

  async function getMenuValue () {
    const curRoute = useRoute()
    const {data} = await request_menu()
    menuData.list = [
      { "id": "home", "name": "看板", icon: 'home'}, 
      ...data, 
      { "id": "setting", "name": "设置", icon: 'setting'},
      { "id": "write", "name": "写作", icon: 'write'},
      { "id": "read", "name": "阅读", icon: 'read'}
    ]
    menuData.current = [(curRoute.name as string) || 'home']
  }

  const menuList = computed(() => {
    return menuData.list.map(item => {
      return {
        key: item.id,
        label: item.name,
        icon: () => h(IconFont, { type: `icon-${item.icon}`})
      }
    })
  })
  return { getMenuValue, menuData, menuList } ;
})

