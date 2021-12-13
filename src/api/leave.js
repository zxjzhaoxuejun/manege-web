import request from '@/utils/request'
// 审批列表
export function getLeaveList(params) {
  return request({
    url: '/leave/list',
    method: 'get',
    params,
    mock: false
  })
}


// 提交申请
export function leaveOperate(data) {
    return request({
      url: '/leave/operate',
      method: 'post',
      data,
      mock: false
    })
  }

/**
 * 审核接口
 */
 export function approveOperate(data) {
  return request({
    url: '/leave/approve',
    method: 'post',
    data,
    mock: false
  })
}

/**
 * 获取待审批数量/approveCount
 */
 export function getApproveCount() {
  return request({
    url: '/leave/approveCount',
    method: 'get',
    mock: false
  })
}