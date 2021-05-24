import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import Settings from './modules/settings'

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
    name: 'Register',
    path: '/register',
    meta: {
      title: '注册'
    },
    component: () => import(/* webpackChunkName: "Register" */'@/views/login/register.vue')
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
        path: 'welcome',
        meta: {
          title: '欢迎页'
        },
        component: () => import(/* webpackChunkName: "welcome" */'@/views/base/index.vue')
      }
    ]
  },
  ...Settings
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
