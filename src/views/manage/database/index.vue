<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="140px">
         <el-form-item label="数据源实例id" prop="instanceId">
            <el-input v-model="queryParams.instanceId" placeholder="请输入" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="实例类型" prop="instanceType">
            <el-select v-model="queryParams.instanceType" placeholder="状态" clearable>
               <el-option label="无" :value="''" />
               <el-option v-for="t in instanceTypeList" :label="t.dbTypeName" :value="t.dbType" />
            </el-select>
         </el-form-item>
         <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="状态" clearable>
               <el-option label="无" :value="''" />
               <el-option label="禁用" :value="0" />
               <el-option label="启用" :value="1" />
            </el-select>
         </el-form-item>
         <el-form-item label="用户id" prop="userId">
            <el-input v-model="queryParams.userId" placeholder="请输入" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
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

      <m-table :loading="loading" :dataList="dataList" :columns="columns" :operations="operations" :totalNum="totalNum"
         :current="queryParams.current" :size="queryParams.size" @handleSelectionChange="handleSelectionChange"
         @operationHandler="operationHandler" @getList="getList"></m-table>

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" v-model="open" width="800px" append-to-body>
         <el-form ref="configRef" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="实例类型" prop="instanceType">
               <el-select v-model="form.instanceType" placeholder="状态" clearable>
                  <el-option v-for="t in instanceTypeList" :label="t.dbTypeName" :value="t.dbType" />
               </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
               <el-switch v-model="form.status" active-text="启用" inactive-text="禁用" :active-value="1" :inactive-value="0">
               </el-switch>
            </el-form-item>
            <el-form-item label="用户id" prop="userId">
               <el-input v-model="form.userId" placeholder="请输入" />
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
import { queryInstanceTypeList, queryList, createData, deleteData, changeStatus, detail } from "@/api/manage/database";

const { proxy } = getCurrentInstance();
const instanceTypeList = ref([])
const dataList = ref([]);
const columns = [{
   label: 'id',
   prop: 'id',
   width: 55
}, {
   label: '资产实例id',
   prop: 'instanceId',
}, {
   label: '实例类型',
   prop: 'instanceType',
}, {
   label: '用户Id',
   prop: 'userId',
   showOverflowTooltip: true
}, {
   label: '状态',
   prop: 'status',
   scope: (value) => value == 0 ? '禁用' : value == 1 ? '启用' : ''
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
      instanceType: '',
      status: 0,
      userId: ''
   },
   queryParams: {
      current: 1,
      size: 10,
      instanceId: '',
      instanceType: '',
      status: '',
      userId: '',
   },
   rules: {
      instanceType: [
         { required: true, message: "请选择实例类型", trigger: "blur" }
      ],
      userId: [
         { required: true, message: "用户id不能为空", trigger: "blur" }
      ],
   },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询实例类型 */
function getInstanceTypeList() {
   queryInstanceTypeList({
      current: 1,
      size: 99
   }).then(response => {
      instanceTypeList.value = response.data.data;
   });
}/** 查询参数列表 */
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
      regular: '',
      description: '',
      status: 0,
   };
   proxy.resetForm("configRef");
}
/** 获取详情 */
function getDetail(row) {
   return detail({ id: row.id })
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
   open.value = true;
   title.value = "新增数据源";
}
/** 修改按钮操作 */
function handleUpdate(row) {
   reset();
   // 记录dbType与dbTypeName,查重时排除初始值
   form.value = { ...row }
   open.value = true;
   title.value = "修改数据源";
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["configRef"].validate(valid => {
      if (valid) {
         btnLoading.value = true
         if (form.value.id != undefined) {
            changeStatus(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               btnLoading.value = false
               getList();
            });
         } else {
            createData(form.value).then(response => {
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
      return deleteData({ idList: configIds });
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
getInstanceTypeList();
getList();
</script>
