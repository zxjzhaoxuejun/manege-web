import request from '@/utils/request'

export function getMenuList(params) {
  return request({
    url: '/menu/list',
    method: 'get',
    params,
    mock: false
  })
}

/**
 *
 * 获取权限菜单
 * /get/permission/list
 */

export function getPermissionMenuList(params) {
  return request({
    url: '/menu/get/permission/list',
    method: 'get',
    params,
    mock: false
  })
}

/**
 * 新增、编辑
 * @param {*} data
 */
export function postMenuData(data) {
  return request({
    url: '/menu/operate',
    method: 'post',
    data,
    mock: false
  })
}

/**
 * 删除postDelete
 */
export function postDelete(data) {
  return request({
    url: '/menu/delete',
    method: 'post',
    data,
    mock: false
  })
}
