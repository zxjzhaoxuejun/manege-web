import request from '@/utils/request'

// 角色列表
export function getRoleList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params,
    mock: false
  })
}

// 部门列表
export function getDeptList(params) {
  return request({
    url: '/dept/list',
    method: 'get',
    params,
    mock: true
  })
}

/**
 * 添加角色/编辑
 */
export function postRolesOperate(data) {
  return request({
    url: '/role/operate',
    method: 'post',
    data,
    mock: false
  })
}

/**
 * 删除角色
 */
export function postDelete(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data,
    mock: false
  })
}

/**
 * 更新权限
 */
export function postUpdatePermission(data) {
  return request({
    url: '/role/update/permission',
    method: 'post',
    data,
    mock: false
  })
}
