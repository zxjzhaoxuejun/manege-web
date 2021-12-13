import storage from '@/utils/storage.js'
import {getApproveCount} from '@/api/leave'

const state = {
  userInfo: storage.getItem('userInfo') || {},
  token: '',
  menuList: [],
  actionList: [],
  roles: [],
  count:0,
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
  },
  SET_COUNT:(state, count)=>{
    state.count=count
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
  },
  getLeaveCount({commit}){
    getApproveCount().then(res=>{
      commit('SET_COUNT',res.data)
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
