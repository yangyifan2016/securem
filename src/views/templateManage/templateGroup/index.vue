<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="140px">
         <el-form-item label="模板分组唯一code" prop="dealCode">
            <el-input v-model="queryParams.dealCode" placeholder="请输入" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <!-- <el-form-item label="处理模板类别id" prop="dealTemplateCategoryId">
            <el-input v-model="queryParams.dealTemplateCategoryId" placeholder="请输入" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
         </el-form-item> -->
         <el-form-item label="处理模板组名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="状态" clearable>
               <el-option label="无" :value="''" />
               <el-option label="禁用" :value="0" />
               <el-option label="启用" :value="1" />
            </el-select>
         </el-form-item>
         <el-form-item style="float:right">
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <m-table 
         :loading="loading" 
         :dataList="dataList" 
         :columns="columns" 
         :operations="operations" 
         :totalNum="totalNum"
         :current="queryParams.current" 
         :size="queryParams.size" 
         @handleSelectionChange="handleSelectionChange"
         @operationHandler="operationHandler" 
         @getList="getList"
      ></m-table>

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" v-model="open" width="800px" append-to-body>
         <el-form ref="configRef" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="模板分组唯一code" prop="dealCode">
               <el-input v-model="form.dealCode" placeholder="请输入" :disabled="Boolean(form.id)" />
            </el-form-item>
            <el-form-item label="模板分组类别id" prop="dealTemplateCategoryId">
               <el-input v-model="form.dealTemplateCategoryId" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="模板分组名称" prop="name">
               <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
               <el-switch v-model="form.status" active-text="启用" inactive-text="禁用" :active-value="1" :inactive-value="0">
               </el-switch>
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm" :loading="btnLoading">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>

<script setup name="Config">
import { queryList, createGroup, deleteGroup, updateGroup, dealCodeIsExist, detail } from "@/api/templateManage/templateGroup";

const { proxy } = getCurrentInstance();

const dataList = ref([]);
const columns = [{
   label: 'id',
   prop: 'id',
   width: 55
}, {
   label: '名称',
   prop: 'name',
   showOverflowTooltip: true
}, {
   label: '模板分组唯一code',
   prop: 'dealCode',
   showOverflowTooltip: true
}, {
   label: '状态',
   prop: 'status',
   scope: (value) => value == 0 ? '禁用' : '启用'
}, {
   label: '创建时间',
   prop: 'createTime',
   width: 180,
   scope: 'time'
}, {
   label: '修改时间',
   prop: 'updateTime',
   width: 180,
   scope: 'time'
}]
const operations = [{
   icon: 'Edit',
   emitName: 'handleUpdate',
   buttonName: '修改'
}, {
   type: 'danger',
   icon: 'Delete',
   emitName: 'handleDelete',
   buttonName: '删除'
}]
const open = ref(false);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const totalNum = ref(0);
const title = ref("");
const dateRange = ref([]);
const btnLoading = ref(false);

const data = reactive({
   form: {
      status: 0
   },
   queryParams: {
      current: 1,
      size: 10,
      dealCode: '',
      dealTemplateCategoryId: '',
      name: '',
      status: '',
   },
   rules: {
      dealCode: [{ required: true, message: "模板分组唯一code不能为空", trigger: "blur" },
      { validator: checkDealCodeExist, trigger: "blur" }],
      dealTemplateCategoryId: [{ required: true, message: "模板分组类别id不能为空", trigger: "blur" }],
      name: [{ required: true, message: "模板分组名称不能为空", trigger: "blur" }],
      status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
   }
});

const { queryParams, form, rules } = toRefs(data);
/** 设置行样式 */
function tableRowClassName({ row }) {
   console.log(row.status === 0)
   if (row.status === 0) {
      return 'disabled-row';
   } else if (row.status === 1) {
      return 'abled-row';
   }
   return '';
}
/** 查询参数列表 */
function getList(current, size) {
   if (current) queryParams.value.current = current
   if (size) queryParams.value.size = size
   loading.value = true;
   queryList(queryParams.value).then(response => {
      dataList.value = response.data.data;
      totalNum.value = response.data.totalNum;
      loading.value = false;
   });
}
/** 搜索按钮操作 */
function handleQuery() {
   queryParams.value.pageNum = 1;
   getList();
}
/** 重置按钮操作 */
function resetQuery() {
   dateRange.value = [];
   proxy.resetForm("queryRef");
   handleQuery();
}
/** 取消按钮 */
function cancel() {
   open.value = false;
   reset();
}
/** 表单重置 */
function reset() {
   form.value = {
      dealCode: '',
      dealTemplateCategoryId: '',
      name: '',
      status: 0,
   };
   proxy.resetForm("configRef");
}
/** 获取详情 */
function getDetail(row) {
   return detail({id: row.id})
}
// 操作按钮点击
function operationHandler(handleName, row) {
   getDetail(row).then((res) => {
      if (res.success) {
         if (handleName === 'handleUpdate') {
            handleUpdate(res.data)
         } else if (handleName === 'handleDelete') {
            handleDelete(res.data)
         }
      }
   })
}
/** 新增按钮操作 */
function handleAdd() {
   reset();
   form.value.dealTemplateCategoryId = '-1'
   open.value = true;
   title.value = "新增模板组";
}
/** 修改按钮操作 */
function handleUpdate(row) {
   reset();
   form.value = { ...row }
   open.value = true;
   title.value = "修改模板组";
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["configRef"].validate(valid => {
      if (valid) {
         btnLoading.value = true
         if (form.value.id != undefined) {
            updateGroup(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               btnLoading.value = false
               getList();
            });
         } else {
            createGroup(form.value).then(response => {
               proxy.$modal.msgSuccess("新增成功");
               open.value = false;
               btnLoading.value = false
               getList();
            });
         }
      }
   });
}
/** 删除按钮操作 */
function handleDelete(row) {
   const configIds = row.id ? [row.id] : ids.value;
   proxy.$modal.confirm('是否确认删除id为"' + configIds + '"的数据项？').then(function () {
      return deleteGroup({ idList: configIds });
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.id);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
}
function checkDealCodeExist(rule, value, callback) {
   if (form.value.id != undefined) {
      callback()
   } else {
      // 新增校验
      dealCodeIsExist(value).then(response => {
         if (response.data) {
            callback(new Error('该dealCode已存在'));
         } else {
            callback()
         }
      })
   }
}
getList();
</script>
