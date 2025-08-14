<template>
   <div>
    <el-card>
    <!--卡片顶部添加品牌按钮-->
    <el-button type="primary" icon="Plus" @click="addTrademark">添加品牌</el-button>
    <!--表格组件：用于展示已有的品牌数据-->
    <!--
        table
        ---border:设置表格纵向是否有边框
        table-column
        ---label：列标题
        ---width：列宽度
        ---align:设置列对齐方式
    -->
    <el-table style="margin:10px 0px" border :data="trademarkArr">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="品牌名称">
        <template #="{row,$index}">
          <pre style="color:brown">{{ row.tmName }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{row,$index}">
          <img :src="row.logoUrl" alt="没有图片" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{row,$index}">
          <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>
          <el-popconfirm :title="`确定要删除${row.tmName}吗?`" width="250px" icon="Delete" @confirm="removeTradeMark(row.id)">
              <template #reference>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器组件
        pagination
        --- v-model:current-page:分页器当前页码
        --- v-model:page-size:每页展示数据的条数
        --- page-sizes：设置下拉菜单数据
        --- background:设置分页器按钮背景颜色
        --- layout：调整分页器六个字组件布局
    -->
    <el-pagination
    @size-change="sizeChange"
      @current-change="getHasTrademark"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    />
  </el-card>
  <!-- 对话框组件：在添加品牌和修改已有品牌的业务时使用 -->
   <!-- v-model：控制对话框显示与隐藏 -->
    <!-- title：设置对话框左上角标题 -->
  <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" width="500">
    <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- upload组件属性：action：图片上传路径书写要带/api，不带/api则代理服务器不发送这次post请求 -->
        <el-upload
    class="avatar-uploader"
    action="/api/admin/product/fileUpload"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽：footer 显示确定与取消按钮 -->
     <template #footer>
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
     </template>
  </el-dialog>
   </div>
</template>

<script setup lang="ts">
import { ElMessage, type UploadProps } from 'element-plus'
//引入组合式API函数ref
import { ref,onMounted,reactive,nextTick } from 'vue';
import { reqHasTrademark,reqAddOrUpdateTrademark,reqDeleteTrademark } from '@/api/product/trademark';
import type { Records,TradeMarkResponseData,TradeMark } from '@/api/product/trademark/type';
//分页器当前页码
const pageNo = ref<number>(1)
//每页展示多少条数据
const limit = ref<number>(3)
//存储已有品牌数据总数
const total = ref<number>(0)
//存储已有品牌的数组
const trademarkArr=ref<Records>([])
//控制对话框显示与隐藏
const dialogFormVisible = ref<boolean>(false)
//定义一个收集新增品牌数据的参数
const trademarkParams = reactive<TradeMark>({
  tmName:'',
  logoUrl:'',
})
//获取el-form表单实例
const formRef = ref()
//获取已有品牌的接口封装为一个函数：在任何情况下想获取数据，调用此函数即可
const getHasTrademark = async(pager=1)=>{
  //当前页码
  pageNo.value=pager
  const result:TradeMarkResponseData = await reqHasTrademark(pageNo.value,limit.value)
  if(result.code==200){
    //存储已有品牌总数
    total.value = result.data.total
    trademarkArr.value=result.data.records
  }
}
//组件挂载完毕钩子---获取第一页已有的三个品牌数据
onMounted(()=>{
  getHasTrademark()
})

//分页器当前页码发生变化的时候会触发
//对于当前页码变化发生自定义事件，组件pagination向父组件回传了数据（数据为当前的页码）
// const changePageNo=()=>{
//   //当前页码发生变化时再次发请求获取对应已有品牌数据展示
//   getHasTrademark()
// }

//当下拉菜单发生变化的时候触发此方法
//这个自定义事件，分页器组件会将下拉菜单选中数据返回
const sizeChange=()=>{
  getHasTrademark()
}
//添加品牌按钮的回调
const addTrademark=()=>{
  //对话框显示
  dialogFormVisible.value=true
  //收集数据清空
  trademarkParams.id=0,
  trademarkParams.tmName='',
  trademarkParams.logoUrl='',
//第一种写法：ts的？语法
  // formRef.value?.clearValidate('tmName')
  // formRef.value?.clearValidate('logoUrl')

  nextTick(()=>{
  formRef.value.clearValidate('tmName')
  formRef.value.clearValidate('logoUrl')
})
}
//修改已有品牌按钮的回调
//row：当前已有的品牌
const updateTrademark=(row:TradeMark)=>{
  //清空校验规则的错误提示信息
  nextTick(()=>{
  formRef.value.clearValidate('tmName')
  formRef.value.clearValidate('logoUrl')
})
  //对话框显示
  dialogFormVisible.value=true
  //ES6语法合并对象
  Object.assign(trademarkParams,row)
  // trademarkParams.id=row.id
  // //展示已有品牌的数据
  // trademarkParams.tmName=row.tmName
  // trademarkParams.logoUrl=row.logoUrl
}
//对话框底部取消按钮
const cancel = ()=>{
  //对话框隐藏
  dialogFormVisible.value=false
  
}
const confirm = async()=>{
  //在发请求之前对整个表单进行校验
  //调用这个方法对全部表单进行校验，如果校验全部通过，再执行后面的语句
  await formRef.value.validate()
  const result: any = await reqAddOrUpdateTrademark(trademarkParams)
  //添加品牌||修改已有品牌
  if(result.code==200){
    //关闭对话框
    dialogFormVisible.value=false
    //弹出提示信息
    ElMessage({
      type:'success',
      message:trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    //再次发请求获取已有的全部的品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
    // //收集数据清空
    // trademarkParams.tmName='',
    // trademarkParams.logoUrl=''
  }else{
    //添加品牌失败
    ElMessage({
      type:'error',
      message:trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
      //关闭对话框
      dialogFormVisible.value=false
  }
}
//上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
 //钩子是在图片上传成功之前触发，可以约束文件类型与大小
 //要求：上传文件格式png、jpg或gif 大小要小于4MB
 if(rawFile.type=='image/png'||rawFile.type=='image/jpeg'||rawFile.type=='image/gif'){
  if(rawFile.size/1024/1024<4){
    return true
  }else{
    ElMessage({
    type:'error',
    message:'上传文件大小不能超过4MB'
  })
    return false
  }
 }else{
  ElMessage({
    type:'error',
    message:'请上传png、jpg或gif格式文件'
  })
  return false
 }
}
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response,uploadFile) => {
//response：即为当前这次上传图片post请求返回的服务器数据
//收集上传图片的地址，添加一个新的品牌的时候带给服务器
trademarkParams.logoUrl=response.data
//图片上传成功，则清理掉对于图片验证结果
formRef.value.clearValidate('logoUrl')
}
//品牌自定义校验规则方法
const validatorTmName = (rule:any,value:any,callBack:any)=>{
  //当表单元素触发blur时，会触发此方法
  //自定义校验规则
  if(value.trim().length>=2){
    callBack()
  }else{
    //校验未通过返回的错误提示信息
    callBack(new Error('品牌名称不得小于两位'))
  }
}
//品牌logo的自定义校验方法
const validatorLogoUrl = (rule:any,value:any,callBack:any)=>{
  //如果图片上传
  if(value){
    callBack()
  }else{
    callBack(new Error('请上传图片'))
  }
}
//表单校验规则对象
const rules={
  tmName:[
    //required:表示这个字段务必要校验，表单项前面会出现*
    //trigger:代表触发校验规则的时机【blur：文本框失去焦点时出发 change：文本框内容发生变化时触发】
    {required:true,trigger:'blur',validator:validatorTmName}
  ],
  logoUrl:[
    {required:true,trigger:'blur',validator:validatorLogoUrl}
  ]
}
//气泡确认框确定按钮的回调
const removeTradeMark = async (id:number)=>{
  //点击确定按钮，删除已有品牌的id
  const result = await reqDeleteTrademark(id)
  if(result.code==200){
    ElMessage({
      //删除成功提示信息
      type:'success',
      message:'删除成功',
    })
    //再次获取已有的品牌数据
    getHasTrademark(trademarkArr.value.length>1?pageNo.value:pageNo.value-1)
  }else{
    ElMessage({
      type:'error',
      message:'删除失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>