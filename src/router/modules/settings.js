import Layout from '@/layout/index.vue'

export default [
  {
    name: 'Settings',
    path: '/settings',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting'
    },
    component: Layout,
    redirect: '/settings/user-control',
    children: [
      {
        name: 'AuthControl',
        path: 'auth-control',
        meta: {
          title: '权限管理',
          icon: 'el-icon-key'
        },
        component: () => import(/* webpackChunkName: "auth" */'@/views/authority/auth.vue')
      },
      {
        name: 'UserControl',
        path: 'user-control',
        meta: {
          title: '用户管理',
          icon: 'el-icon-user'
        },
        component: () => import(/* webpackChunkName: "welcome" */'@/views/authority/user.vue')
      },
      {
        name: 'MenuControl',
        path: 'menu-control',
        meta: {
          title: '菜单管理',
          icon: 'el-icon-s-order'
        },
        component: () => import(/* webpackChunkName: "welcome" */'@/views/base/index.vue')
      },
      {
        name: 'RoleControl',
        path: 'role-control',
        meta: {
          title: '角色管理',
          icon: 'el-icon-s-custom'
        },
        component: () => import(/* webpackChunkName: "welcome" */'@/views/authority/role.vue')
      },
      {
        name: 'Password',
        path: 'password',
        meta: {
          title: '修改密码'
        },
        component: () => import(/* webpackChunkName: "password" */'@/views/login/password.vue')
      }
    ]

  }
]
