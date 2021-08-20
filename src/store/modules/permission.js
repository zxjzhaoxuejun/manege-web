import { constantRoutes } from '@/router'
import { getPermissionMenuList } from '@/api/menu'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function deepGeneratRoute(menuList) {
  const routes = []
  const deepList = (list) => {
    while (list.length) {
      const item = list.pop()
      if (item.action || !item.children) {
        const url=`./../../views/${item.component}.vue`
        const routerPath=()=>import(url)
        routes.push({
          name: item.componentName,
          path: item.path,
          meta: {
            title: item.menuName,
            icon: item.icon
          },
          component:routerPath()
        })
      }
      if(item.children&&!item.action){
        deepList(item.children)
      }
    }
  }
  deepList(menuList)
  return routes
}

/**
   * Filter asynchronous routing tables by recursion
   * @param routes asyncRoutes
   * @param roles
   */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
// console.log(res)
  return res
}

const state = {
  routes: constantRoutes,
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    // console.log(state.routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(async resolve => {
      let accessedRoutes=[]
      if (roles.includes('admin')) {
        await getPermissionMenuList().then(res => {
          const { menuList } = res.data
          accessedRoutes = deepGeneratRoute(menuList) || []
        })
      } else {
        accessedRoutes = filterAsyncRoutes([], roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}
const namespaced = true
export {
  namespaced,
  state,
  mutations,
  actions
}
