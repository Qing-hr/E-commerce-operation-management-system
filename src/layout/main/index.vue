<template>
  <!--路由组件出口的位置-->
  <router-view v-slot="{ Component }">
  <transition name="fade">
    <!--渲染layout一级路由组件的子路由-->
    <component :is="Component" v-if="flag"/>
  </transition>
</router-view>
</template>

<script setup lang="ts">
import { watch,ref,nextTick } from 'vue';
import useLayOutSettingStore from '../../store/modules/setting';
const layOutSettingStore = useLayOutSettingStore()
//控制当前组件是否销毁
const flag = ref(true)
//监听仓库数据是否发生变化，如果发生变化，说明用户点击过刷新按钮
watch(()=>layOutSettingStore.refresh,()=>{
  //点击刷新按钮，内容组件销毁
  flag.value = false
  //当响应式数据发生变化后，获取更新后的路径
  nextTick(() => {
    flag.value=true
  })
})
</script>

<style scoped>
.fade-enter-from{
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active{
  transition: all 0.3s;
}
.fade-enter-to{
  opacity: 1;
  transform: scale(1);
}
</style>