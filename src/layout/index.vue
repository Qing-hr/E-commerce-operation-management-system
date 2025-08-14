<script setup lang="ts">
//获取路由对象
import { useRoute } from 'vue-router';
//引入左侧菜单子组件
import Logo from './logo/index.vue'
//引入菜单组件
import Menu from './menu/index.vue'
//右侧内容展示区域
import Main from './main/index.vue'
//引入顶部tabbar组件
import Tabbar from './tabbar/index.vue'
//获取用户相关的小仓库
import useUserStore from '../store/modules/user';
import useLayOutSettingStore from '@/store/modules/setting';
const userStore=useUserStore()
//获取layout配置仓库
const LayOutSettingStore = useLayOutSettingStore()
//获取路由对象
const $route = useRoute()
</script>

<template>
  <div class="layout_container">
    <!--左侧菜单-->
    <div class="layout_solider">
      <Logo></Logo>
      <!--展示菜单-->
      <!--滚动组件-->
      <el-scrollbar class="scrollbar">
        <!--菜单组件-->
        <el-menu :collapse="LayOutSettingStore.fold ? true : false" :default-active="$route.path" background-color="#001529" text-color="white">
          <!--根据路由动态生成菜单-->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!--顶部导航-->
    <div class="layout_tabbar" :class="{fold:LayOutSettingStore.fold ? true : false}">
      <!--layout组件的顶部导航tabbar-->
      <Tabbar></Tabbar>
    </div>
    <!--内容展示区域-->
    <div class="layout_main" :class="{fold:LayOutSettingStore.fold ? true : false}">
      <Main></Main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_solider{
    color:white;
    width:variable.$base-menu-width;
    height: 100vh;
    background:variable.$base-menu-background;
    transition:all 0.3s;

    .scrollbar{
      width:100%;
      height: calc(100vh - variable.$base-menu-logo-height);
      .el-menu{
        border-right: none;
      }
    }
    &.fold{
      width:variable.$base-menu-min-width;
    }
  }
  .layout_tabbar{
    position:fixed;
    width:calc(100% - variable.$base-menu-width);
    height:variable.$base-tabbar-height;
    top:0px;
    left:variable.$base-menu-width;
    transition:all 0.3s;
    &.fold{
      width:calc(100vw - variable.$base-menu-min-width);
      left:variable.$base-menu-min-width;
    }
  }
  .layout_main{
    position:absolute;
    width:calc(100% - variable.$base-menu-width);
    height: calc(100vh - variable.$base-tabbar-height);
    left:variable.$base-menu-width;
    top:variable.$base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold{
      width:calc(100vw - variable.$base-menu-min-width);
      left:variable.$base-menu-min-width;
    }
  }
}
</style>
