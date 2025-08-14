<template>
  <div class="tabbar">
    <div class="tabbar_left">
     <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<style scoped lang="scss">
.tabbar{
  width: 100%;
  height:100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(to right,rgb(235, 203, 203),rgb(184, 135, 135),rgb(235, 204, 204));
  .tabbar_left{
    display: flex;//浮动
    align-items: center;//竖轴居中
    margin-left: 20px;
  }
  .tabbar_right{
    display: flex;//浮动
    align-items: center;//竖轴居中
  }
}
</style>