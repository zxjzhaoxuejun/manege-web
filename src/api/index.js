import request from '@/utils/request'

export function leftMenu() {
  return request({
    url:`/users/menu`,
    method:'get',
  })
}