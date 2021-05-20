/**
 * 环境配置
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/f3e77dab4a38ffb29a8f12773a8ab7cf/api'
  },
  test: {
    baseApi: '/',
    mockApi: 'https://www.fastmock.site/mock/f3e77dab4a38ffb29a8f12773a8ab7cf/api'
  },
  prod: {
    baseApi: '/',
    mockApi: 'https://www.fastmock.site/mock/f3e77dab4a38ffb29a8f12773a8ab7cf/api'
  }
}

export default {
  env,
  mock: false,
  namespace: 'sieia',
  ...EnvConfig[env]
}
