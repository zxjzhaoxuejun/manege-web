import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-plus'
import stroage from './utils/storage'
import SetupI18n from '@/lang'
import store from '@/store'
import 'dhgate-ui/dist/css/index.css'
import MUI from 'dhgate-ui'
// import '@/icons' // icon
import svgIcon from '@/components/SvgIcon/index.vue'
import './permission'
import 'element-plus/lib/theme-chalk/index.css'

// console.log('环境变量=》', import.meta.env)
const app = createApp(App).component('svg-icon', svgIcon)
// 全局指令
app.directive('has', {
  beforeMount: (el, binding) => {
    // console.log(el, binding)
    // console.log(el.className)
    // 获取按钮权限
    const userAction = stroage.getItem('actionList')
    const value = binding.value
    // 盘点列表中是否有对应的按钮权限标识
    const hasPermission = userAction.includes(value)
    if (!hasPermission) {
      el.style = 'display:none'
      setTimeout(() => {
        el.parentNode.removeChild(el)
      }, 0)
    }
  }
})
app.config.globalProperties.$stroage = stroage
app.use(router).use(store).use(Element).use(MUI).use(SetupI18n).mount('#app')
