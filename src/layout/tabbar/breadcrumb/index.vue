<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router';
import { ref } from 'vue'
// 获取layout配置的相关参数
const LayOutSettingStore = useLayOutSettingStore()
//获取路由对象
const $route = useRoute()
// 点击图标的方法
function changeIcon() {
  // 图标进行切换
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>

<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px;" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'" />
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!--面包屑动态展示路由名字与标题-->
    <el-breadcrumb-item v-for="(item,index) in $route.matched" key="index" v-show="item.meta.title" :to="item.path">
      <!--面包屑展示匹配路由的图标-->
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!--面包屑展示匹配路由的标题-->
      <span style="margin: 0px 2px;">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>

</style>
