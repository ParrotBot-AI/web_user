import { createRouter, createWebHistory } from 'vue-router'
import { getWithExpiry } from "@/utils/storage"
import type { MENUITEM, USERINFO } from "@/service/user"
import { formatStr } from "@/utils/utils"
import { request_menu } from "@/service/user"
import { useIndexStore } from "@/stores/index"
let isRoutesAdded: boolean = false
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/home',
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
        },
      ],
      component: () => import('@/views/Layout/index.vue')
    },
    // {
    //   path: '/questions/:patternId',
    //   name: 'questionList',
    //   component: () => import('@/views/QuestionList/index.vue')
    // },
    {
      path: '/result/:sheetId',
      name: 'result',
      component: () => import('@/views/Result/index.vue')
    },
    {
      path: '/read-exam',
      name: 'readExam',
      meta: {
        parent: 'read'
      },
      component: () => import('@/views/ReadExam/index.vue')
    },
    {
      path: '/spoken-exam',
      name: 'spokenExam',
      meta: {
        parent: 'spoken'
      },
      component: () => import('@/views/SpokenExam/index.vue')
    },
    {
      path: '/hearing-exam',
      name: 'hearingExam',
      meta: {
        parent: 'hearing'
      },
      component: () => import('@/views/HearingExam/index.vue')
    },
    {
      path: '/writing-exam',
      name: 'writingExam',
      meta: {
        parent: 'writing'
      },
      component: () => import('@/views/WritingExam/index.vue')
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

function addRoutes(data: MENUITEM[]) {
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
  if (whiteList.includes(to.name as string)) {
    next()
    return
  }
  const userInfo = getWithExpiry<USERINFO>('userinfo')!;
  const isLoggedIn = userInfo?.access
  const indexStore = useIndexStore()
  if (isLoggedIn) {
    if (!isRoutesAdded) {
      try {
        const res: any = await Promise.allSettled([request_menu(), indexStore.requestUserInfo(userInfo?.userId)]);
        const menuData = res[0].value.data
        indexStore.getMenuValue(menuData)
        addRoutes(menuData)
        next({ ...to, replace: true })
      } catch (error) {
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
