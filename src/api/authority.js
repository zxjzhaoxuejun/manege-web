import request from '@/utils/request'

export function addAuth(data) {
  return request({
    url: '/auth/add',
    method: 'post',
    data
  })
}

export function findAuth() {
  return request({
    url: '/auth/list',
    method: 'post'
  })
}

export function editAuth(data) {
  return request({
    url: '/auth/edit',
    method: 'post',
    data
  })
}

