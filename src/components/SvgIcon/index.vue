<script setup lang="ts">
// 接受父组件传递过来的参数
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: String,
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<template>
  <!-- SVG:图标外层容器节点，内部需要与use标签结合使用 -->
  <svg :style="{ width, height }">
    <!-- xlink:href指定使用哪一个图标,属性值务必#icon-图标名字 -->
    <use :xlink:href="prefix + name" :fill="color" />
  </svg>
</template>

<style scoped>

</style>
