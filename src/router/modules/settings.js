import Layout from '@/layout/index.vue'

export default [
  {
    name: 'Settings',
    path: '/',
    meta: {
      title: '系统管理'
    },
    component: Layout,
    redirect: '/settings',
    children: [
      {
        name: 'UserControl',
        path: 'user-control',
        meta: {
          title: '用户管理'
        },
        component: () => import(/* webpackChunkName: "welcome" */'@/views/base/index.vue')
      },
      {
        name: 'MenuControl',
        path: 'menu-control',
        meta: {
          title: '菜单管理'
        },
        component: () => import(/* webpackChunkName: "welcome" */'@/views/base/index.vue')
      }
    ]

  }
]
