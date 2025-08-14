<template>
      <el-button size="small" icon="Refresh" circle @click="updateFresh"></el-button>
      <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
      <el-button size="small" icon="Setting" circle></el-button>
      <img :src="userStore.avatar" style="width: 24px;height: 24px;margin: 0px 10px; border-radius: 50%;">
      <!--下拉菜单-->
      <el-dropdown>
    <span class="el-dropdown-link">
      {{userStore.username}}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter,useRoute } from 'vue-router';
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
//获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting';
const layoutSettingStore = useLayOutSettingStore()
const userStore=useUserStore()
//获取路由器对象
const $router = useRouter()
//获取路由对象
const $route = useRoute()
//刷新按钮点击的回调
const updateFresh = ()=>{
  layoutSettingStore.refresh=!layoutSettingStore.refresh
}
//全屏按钮点击回调
const fullScreen = ()=>{
  //DOM对象的一个属性：可以用来判断当前是不是全屏模式[全屏：返回true 不是全屏：返回false]
  const full = document.fullscreenElement
  //切换为全屏模式
  if(!full){
    //利用文档根节点的requestFullscreen方法，实现全屏模式
    document.documentElement.requestFullscreen()
  }else{
    //推出全屏模式
    document.exitFullscreen()
}
}
//退出登录点击回调
const logout =async()=>{
  //第一件事：向服务器发出请求【退出登录接口】
  //第二件事：仓库当中与用户相关的信息清空
  //第三件事：跳转到登录页面
  await userStore.userLogout()
  //跳转到登录页面
  $router.push({path:'/login',query:{redirect:$route.path}})
}
</script>

<style scoped>

</style>