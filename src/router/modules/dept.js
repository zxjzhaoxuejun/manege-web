import Layout from '@/layout/index.vue'

export default [
  {
    name: 'DeptControl',
    path: '/dept',
    component: Layout,
    redirect: '/dept/list',
    children: [
      {
        name: 'DeptControlList',
        path: 'list',
        meta: {
          title: '部门管理',
          icon: 'el-icon-s-custom'
        },
        component: () => import(/* webpackChunkName: "dept" */'@/views/authority/dept.vue')
      }
    ]
  }
]
