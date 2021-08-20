import storage from '@/utils/storage.js'

const state = {
  userInfo: storage.getItem('userInfo') || {},
  token: '',
  menuList: [],
  actionList: [],
  roles: []
}

const mutations = {
  SAVE_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    storage.setItem('userInfo', userInfo)
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SAVE_USER_ACTIVELIST: (state, actionList) => {
    state.actionList = actionList
    storage.setItem('actionList', actionList)
  },
  SAVE_USER_MENULIST: (state, menuList) => {
    state.menuList = menuList
    storage.setItem('menuList', menuList)
  }
}

const actions = {
  saveUserInfo({ commit }, userInfo) {
    commit('SAVE_USER_INFO', userInfo)
  },
  saveUserMenuList({ commit }, menuList) {
    commit('SAVE_USER_MENULIST', menuList)
  },
  saveUserActiveList({ commit }, actionList) {
    commit('SAVE_USER_ACTIVELIST', actionList)
  }
}
const namespaced = true
export {
  namespaced,
  state,
  mutations,
  actions
}
