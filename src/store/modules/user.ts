//创建用户相关的小仓库
import { defineStore } from "pinia";
//引入接口
import { reqLogin,reqUserInfo,reqLogOut } from "@/api/user";
import type { loginFormDate,loginResponseDate,userInfoResponseData } from '@/api/user/type'
import type { UserState } from "./types/type";
//引入操作本地存储的工具方法
import { SET_TOKEN,GET_TOKEN,REMOVE_TOKEN } from "@/utils/token";
//引入路由（常量路由）
import { constantRoute } from "@/router/routes";
//创建用户小仓库
const useUserStore = defineStore('user',{
  //小仓库存储数据的地方
  state:():UserState=>{
    return {
      token:GET_TOKEN(),//用户唯一标识：token
      menuRoutes:constantRoute,//仓库存储菜单需要的数组（路由）
      username:'',
      avatar:'',
    }
  },
  //处理异步||逻辑的地方
  actions:{
    //用户登录的方法
    async userLogin(data:loginFormDate){
      //登录请求
      const result:loginResponseDate = await reqLogin(data)
      //登录请求：成功200->token
      //登录请求：失败201->登陆失败错误的信息
      if (result.code == 200){
        //pinia仓库存储一下token
        //由于pinia||vuex存储数据其实利用的是js对象
        this.token = result.data
        //本地存储持久化存储一份
        SET_TOKEN(result.data)
        //能保证当前async函数返回一个成功的promise
        return 'OK'
      }else{
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息方法
    async userInfo(){
      const result:userInfoResponseData = await reqUserInfo()
      //如果获取用户信息成功，存储一下用户信息
      if(result.code==200){
        this.username=result.data.name
        this.avatar=result.data.avatar
        return 'ok'
      }else{
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout(){
      //退出登录请求
      const result:any = await reqLogOut()
      if(result.code==200){
          //目前没有mock接口：退出登录的接口（通知服务器本地唯一用户表示失效）
          this.token=''
          this.username=''
          this.avatar=''
          //清除本地存储的token
          REMOVE_TOKEN()
          return 'ok'
      }else{
        return Promise.reject(new Error(result.message))
      }
    }
  },
  getters:{

  }
})
//对外暴露小仓库获取方法
export default useUserStore