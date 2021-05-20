import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import Welcome from '@/components/Welcome.vue'

const routes = [
  {
    name: 'Login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "login" */'@/views/login/index.vue')
  },
  {
    name: 'Home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: Layout,
    redirect: '/welcome',
    children: [
      {
        name: 'Welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页'
        },
        component: Welcome
      }
    ]

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
