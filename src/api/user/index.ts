// 统一管理项目用户相关的接口
import request from '@/utils/request'
import type { loginFormDate,loginResponseDate,userInfoResponseData } from './type'
//项目用户相关的请求地址
enum API{
  LOGIN_URL="/admin/acl/index/login",
  USERINFO_URL="admin/acl/index/info",
  LOGOUT_URL="admin/acl/index/logout",
}
//登录接口
export const reqLogin = (data:loginFormDate)=>request.post<any,loginResponseDate>(API.LOGIN_URL,data)
//获取用户信息接口
export const reqUserInfo = ()=>request.get<any,userInfoResponseData>(API.USERINFO_URL)
//退出登录接口
export const reqLogOut= ()=>request.post<any,any>(API.LOGOUT_URL)

