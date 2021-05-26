import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import Settings from './modules/settings'

export const constantRoutes = [
  {
    name: 'Login',
    path: '/login',
    meta: {
      title: '登录'
    },
    children: [],
    component: () => import(/* webpackChunkName: "login" */'@/views/login/index.vue')
  },
  {
    name: 'Register',
    path: '/register',
    meta: {
      title: '注册'
    },
    children: [],
    component: () => import(/* webpackChunkName: "Register" */'@/views/login/register.vue')
  },
  {
    name: 'Home',
    path: '/',
    meta: {
      title: '首页',
      icon: 'el-icon-s-home'
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
  }

]

export const asyncRoutes = [
  ...Settings
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router
