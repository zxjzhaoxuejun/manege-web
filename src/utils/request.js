/**
 * axios二次封装
 */
import axios from 'axios'
import config from './../config'
import router from './../router'
import storage from './storage'
import { ElMessage } from 'element-plus'

const TOKEN_INVALID = 'Token认证失败，请重新登录!'
const NETWORK_ERROR = '网络异常!'

// 创建axios实列对象，添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 60000
})

// 请求拦截
service.interceptors.request.use((req) => {
  // TODO
  const headers = req.headers
  const { token } = storage.getItem('userInfo') || ''
  if (!headers.Authorization) headers.Authorization = `Bearer ${token}`
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  const { code, msg } = res.data
  if (code === 200) {
    // 成功
    return res.data
  } else if (code === 50001) {
    // 未登录
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * options请求配置
 */

function request(options) {
  console.log(options)
  let isMock = config.mock
  if (typeof options.mock !== 'undefined') {
    isMock = options.mock
  }
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }

  return service(options)
}
export default request
