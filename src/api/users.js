import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
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
