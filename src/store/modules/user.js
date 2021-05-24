import storage from '@/utils/storage.js'

const state = {
  userInfo: '' || storage.getItem('userInfo'),
  token: ''
}

const mutations = {
  SAVE_USER_INFO(state, userInfo) {
    console.log(userInfo)
    state.userInfo = userInfo
    storage.setItem('userInfo', userInfo)
  }
}

const actions = {
  saveUserInfo({ commit }, userInfo) {
    console.log(userInfo)
    commit('SAVE_USER_INFO', userInfo)
  }
}
const namespaced = true
export {
  namespaced,
  state,
  mutations,
  actions
}
