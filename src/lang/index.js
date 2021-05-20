import { createI18n } from 'vue-i18n'
// import Cookies from 'js-cookie'
import storage from '@/utils/storage.js'
import enLocale from './en'
import zhLocale from './zh'

const messages = {
  en: {
    ...enLocale
  },
  zh: {
    ...zhLocale
  }
}

// 注册i8n实例并引入语言文件
const localeData = {
//   legacy: true,
  locale: getLanguage(),
  messages
  //global Injection: true// 在Composition API模式下，您不能使用带有前缀$并注入到组件中的API 。要使用它，你需要设置globalInjection: true的createI18n。
}

export function getLanguage() {
  const chooseLanguage = storage.getItem('language')// Cookies.get('language')
  if (chooseLanguage) return chooseLanguage
  // 默认英文
  return 'zh'
}
const i18n = createI18n(localeData)

export default i18n
