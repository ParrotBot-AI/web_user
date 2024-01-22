import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
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

export default router
