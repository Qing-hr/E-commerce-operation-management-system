import App from '@/App.vue'
// 引入自定义插件对象：注册整个项目的全局组件
import globalComponent from '@/components'
// 引入ElementPlus插件与样式
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createApp } from 'vue'
// 引入路由
import router from './router'
// 引入仓库
import pinia from './store'
// 引入模板的全局的样式
import '@/styles/index.scss'
import 'element-plus/dist/index.css'
// svg插件需要配置代码
import 'virtual:svg-icons-register'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn, // element-plus国际化配置
})
// 安装自定义插件
app.use(globalComponent)
// 安装仓库
app.use(pinia)
// 注册模板路由
app.use(router)
//引入路由鉴权文件
import './permission'
app.mount('#app')
