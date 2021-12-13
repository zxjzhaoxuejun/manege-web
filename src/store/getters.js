const getters = {
  language: state => state.app.language,
  permission_routes: state => state.permission.routes,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  count:state=>state.user.count
}
export default getters

