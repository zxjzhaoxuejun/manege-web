const getters = {
  language: state => state.app.language,
  permission_routes: state => state.permission.routes,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles
}
export default getters

