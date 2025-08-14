import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig,loadEnv } from 'vite'
// https://vite.dev/config/
// mock插件提供方法
import { viteMockServe } from 'vite-plugin-mock'
// 引入svg需要的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ command,mode }) => {
  //获取各种环境下对应的变量
  //mode:加载环境，默认是开发环境
  //process.cwd：获取项目根目录
  const env = loadEnv(mode,process.cwd())
  return {
    plugins: [vue(), createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }), viteMockServe({
      localEnabled: command === 'serve', // 保证开发阶段可以使用mock接口
    })],
    // 这个resolve是添加的别名
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src',
        },
      ],
    },
    // scss全局变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@use "@/styles/variable.scss";',
        },
      },
    },
    //代理跨域
    server:{
      proxy:{
        [env.VITE_APP_BASE_API]:{
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //是否代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  }
})
