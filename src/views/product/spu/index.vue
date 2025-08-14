<template>
  <div>
        <!-- 三级分类 -->
        <Category :scene="scene"></Category>
        <el-card style="margin:10px 0px">
          <div v-show="scene==0">
            <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.c3Id ? false : true" @click="addSpu">添加SPU属性</el-button>
          <!-- 展示已有的SPU数据 -->
          <el-table style="margin:10px 0px" border :data="records">
            <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
            <el-table-column label="SPU名称" prop="spuName"></el-table-column>
            <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
            <el-table-column label="SPU操作">
              <!-- row:即为已有的SPU对象 -->
               <template #="{row,$index}">
                <el-button type="primary" size="small" icon="Plus" title="添加SKU"></el-button>
                <el-button type="primary" size="small" icon="Edit" title="修改SPU" @click="updateSpu"></el-button>
                <el-button type="primary" size="small" icon="View" title="查看SKU列表"></el-button>
                <el-button type="primary" size="small" icon="Delete" title="删除SPU"></el-button>
               </template>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3,5,7,9]"
      :background="true"
      layout="prev, pager, next,jumper,->,sizes,total"
      :total="total"
      @current-change="getHasSpu"
      @size-change="changeSize"
    />
          </div>
          <!-- 添加SPU|修改SPU子组件 -->
           <SpuForm ref="spu" v-show="scene==1" @changeScene="changeScene"></SpuForm>
           <!-- 添加SKU的子组件 -->
            <SkuForm v-show="scene==2"></SkuForm>
        </el-card>
  </div>
</template>

<script setup lang="ts">
import type { HasSpuResponseData,Records,SpuData } from '../../../api/product/spu/type';
import { ref,watch } from 'vue';
import { reqHasSpu } from '../../../api/product/spu';
//引入分类的仓库
import useCategoryStore from '../../../store/modules/category';
import SpuForm from './spuForm.vue';
import SkuForm from './skuForm.vue';
const categoryStore = useCategoryStore()
//场景的数据
const scene=ref<number>(0)//0:显示已有的SPU 1：添加或者修改已有SPU 2：添加SKU结构
//分页器默认页码
const pageNo = ref<number>(1)
//每一页展示几条数据
const pageSize = ref<number>(3)
//存储已有的SPU数据
const records = ref<Records>([])
//存储已有SPU总个数
const total = ref<number>(0)
//获取子组件实例spu
const spu=ref<any>()
//监听三级分类Id变化
watch(()=>categoryStore.c3Id,()=>{
  //务必保证有三级分类Id
  if(!categoryStore.c3Id) return
  getHasSpu()
})
//此方法执行：可以获取某一个三级分类下的全部已有的SPU
const getHasSpu=async(pager=1)=>{
  //修改当前页码
  pageNo.value=pager
  const result:HasSpuResponseData = await reqHasSpu(pageNo.value,pageSize.value,categoryStore.c3Id)
  if(result.code==200){
    records.value=result.data.records
    total.value=result.data.total
  }
}
//分页器下拉菜单发生变化的时候触发
const changeSize=()=>{
  getHasSpu()
}
//添加新的SPU属性按钮回调
const addSpu=()=>{
  //切换为场景1：添加与修改已有SPU结构->spuForm
  scene.value=1
}
//子组件spuForm绑定自定义事件：目前是让子组件通知父组件切换场景为0
const changeScene=(num:number)=>{
//子组件SpuForm点击取消变为场景0：展示已有的SPU
scene.value=num
}
//修改已有的SPU按钮的回调
const updateSpu=(row:SpuData)=>{
  //切换为场景1：添加与修改已有SPU结构->spuForm
  scene.value=1
  //调用子组件实例方法获取完整已有的SPU数据
  spu.value.initHasSpuData(row)
}
</script>

<style scoped>

</style>