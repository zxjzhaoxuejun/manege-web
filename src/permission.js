import router from './router'
import store from './store'

// 是否初始化完成
const judgeInitInfoUser = (to, next, query = {}, replace = false) => {
  query = to.query ? Object.assign(to.query, query) : query
  next({
    ...to,
    query,
    replace
  })
}

// 判断当前地址是否可以访问
function checkPermission(path) {
  console.log('=>',path)
  console.log(router.getRoutes())
  const hasPath = router.getRoutes().filter(route => route.path === path).length
  return !!hasPath
}

router.beforeEach(async(to, from, next) => {
  const roles = ['admin']
  const hasRoles = store.state.user.roles && store.state.user.roles.length > 0
  document.title = to.meta.title
  if (!hasRoles) {
    store.commit('user/SET_ROLES', roles)
    const accessRoutes = await store.dispatch('permission/generateRoutes', roles) || []
    await store.dispatch('user/getLeaveCount')
    // dynamically add accessible routes
    accessRoutes.map(item => {
      router.addRoute("Home",item)
    })
    // router.addRoute(accessRoutes[0])
    judgeInitInfoUser(to, next, null, true)
  }
  if (checkPermission(to.path)) {
    next()
  } else {
    next('/404')
  }
})

router.afterEach(() => {
  // finish progress bar
})

