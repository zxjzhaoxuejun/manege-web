import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data,
    mock: false
  })
}

export function register(data) {
  return request({
    url: '/users/register',
    method: 'post',
    data
  })
}

export function password(data) {
  return request({
    url: '/users/password',
    method: 'post',
    data
  })
}

export function getCode() {
  return request({
    url: '/users/code-captcha',
    method: 'get'
  })
}

export function getUserList(data) {
  return request({
    url: '/users/list',
    method: 'post',
    data,
    mock: false
  })
}

// 用户创建/编辑
export function postUserOperate(data) {
  return request({
    url: '/users/operate',
    method: 'post',
    data,
    mock: false
  })
}
