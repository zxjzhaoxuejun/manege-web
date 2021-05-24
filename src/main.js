import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-plus'
import stroage from './utils/storage'
import SetupI18n from '@/lang'
import store from '@/store'
// import '@/icons' // icon
import svgIcon from '@/components/SvgIcon/index.vue'

import 'element-plus/lib/theme-chalk/index.css'

// console.log('环境变量=》', import.meta.env)
const app = createApp(App).component('svg-icon', svgIcon)
app.config.globalProperties.$stroage = stroage
app.use(router).use(store).use(Element).use(SetupI18n).mount('#app')
