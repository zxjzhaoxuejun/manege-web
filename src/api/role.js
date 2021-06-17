import request from '@/utils/request'

// 角色列表
export function getRoleList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params,
    mock: true
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
