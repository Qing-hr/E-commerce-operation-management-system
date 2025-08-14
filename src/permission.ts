import nprogress from 'nprogress'
// 路由鉴权：判断项目当中的路由能不能被访问的权限的设置（某个路由什么条件下可以访问，什么条件下不可以访问）
import router from './router'
import setting from './setting'
import pinia from './store'
// 获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import useUserStore from './store/modules/user'
// 引入进度条样式
import 'nprogress/nprogress.css'

nprogress.configure({ showSpinner: false })

// 全局守卫：项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  // to:你将要访问那个路由
  // from：你从哪个路由而来
  // next：路由的放行函数
  nprogress.start()
  const userStore = useUserStore(pinia)
  // 获取token数据去判断用户是登陆成功还是未登录
  const token = userStore.token
  // 获取用户名字
  const username = userStore.username
  // 用户登录成功
  if (token) {
    // 登陆成功不能访问login登录页面，指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    }
    else {
      // 登录成功访问其他六个路由（排除login登录）
      // 有用户信息放行
      if (username) {
        next()
      }
      // 没有用户信息，则在守卫这里发请求获取用户信息再放行
      else {
        try {
          // 获取用户信息
          await userStore.userInfo()
          next()
        }
        catch (error) {
          // token过期：就获取不到用户信息了或者用户手动修改本地存储的token会触发catch
          // 退出登录->用户相关的数据清空
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  }
  else {
    // 用户未登录
    if (to.path == '/login') {
      next()
    }
    else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

// 第一个问题：任意路由切换实现进度条业务 nprogress：进度条插件
// 第二个问题：路由鉴权:路由组件访问权限的设置
