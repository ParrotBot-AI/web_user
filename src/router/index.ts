import { createRouter, createWebHistory } from 'vue-router'
import {getWithExpiry} from "@/utils/storage"
import type {MENUITEM} from "@/service/user"
import {formatStr} from "@/utils/utils"
import { request_menu } from "@/service/user"
import { useIndexStore } from "@/stores/index"
let isRoutesAdded:boolean = false
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: '/setting',
          name: 'setting',
          component: () => import('@/views/Setting/index.vue')
        }
      ],
      component: () => import('@/views/Layout/index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue')
    },
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('@/views/Welcome/index.vue')
    },
  ]
})

function addRoutes (data: MENUITEM[]) {
  data.forEach(item => {
    const filename = formatStr(item.icon)
    const pathName = filename[0].toLowerCase() + filename.slice(1)
    router.addRoute('layout', {
      name: pathName,
      path: `/${pathName}`,
      meta: {
        id: item.id,
        dynamics: true,
        title: item.name
      },
      component: () => import(`@/views/${filename}/index.vue`)
    })
  })
  isRoutesAdded = true
}

const whiteList = ['login', 'welcome']
router.beforeEach(async (to, from, next) => {
  if(whiteList.includes(to.name as string)) {
    next()
    return
  }
  const isLoggedIn = getWithExpiry('userinfo')?.access;
  const indexStore = useIndexStore()
  if(isLoggedIn) {
    if(!isRoutesAdded) {
      try {
        const {data} = await request_menu()
        indexStore.getMenuValue(data)
        addRoutes(data)
        next({...to, replace: true})
      }catch(error) {
        console.error(error)
        next(false)
      }
    } else {
      next()
    }
  } else {
    next('/login')
  }
});


export default router
