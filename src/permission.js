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

router.beforeEach(async(to, from, next) => {
  const roles = ['admin']
  const hasRoles = store.state.user.roles && store.state.user.roles.length > 0
  if (!hasRoles) {
    store.commit('user/SET_ROLES', roles)
    const accessRoutes = await store.dispatch('permission/generateRoutes', roles) || []
    // dynamically add accessible routes
    accessRoutes.map(item => {
      router.addRoute(item)
    })
    // router.addRoute(accessRoutes[0])
    judgeInitInfoUser(to, next, null, true)
  }
  next()
})

router.afterEach(() => {
  // finish progress bar
})

