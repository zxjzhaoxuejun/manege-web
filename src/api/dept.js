import request from '@/utils/request'
// 部门列表
export function getDeptList(params) {
  return request({
    url: '/dept/list',
    method: 'get',
    params,
    mock: false
  })
}

/**
 * 创建、编辑
 * /operate
 */
export function postOperate(data) {
  return request({
    url: '/dept/operate',
    method: 'post',
    data,
    mock: false
  })
}

/**
 * 删除
 */
/**
 * 创建、编辑
 * /operate
 */
export function postDelete(data) {
  return request({
    url: '/dept/delete',
    method: 'post',
    data,
    mock: false
  })
}
