<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="140px">
         <el-form-item label="处理模板唯一code" prop="dealCode">
            <el-input v-model="queryParams.dealCode" placeholder="请输入" clearable style="width: 240px"
               @keyup.enter="handleQuery" />
         </el-form-item>
         <el-form-item label="处理模板名称" prop="name">
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
         <el-form-item>
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

      <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
         <el-table-column type="selection" width="55" align="center" />
         <el-table-column label="id" align="center" prop="id" width="55" />
         <el-table-column label="名称" align="center" prop="name" :show-overflow-tooltip="true" />
         <el-table-column label="模板唯一code" align="center" prop="dealCode" :show-overflow-tooltip="true" />
         <el-table-column label="模板组id" align="center" prop="dealTemplateGroupId" :show-overflow-tooltip="true" />
         <el-table-column label="详情" align="center" prop="detail" :show-overflow-tooltip="true" />
         <el-table-column label="数据处理前" align="center" prop="dealDataBefore" :show-overflow-tooltip="true" />
         <el-table-column label="数据处理后" align="center" prop="dealDataAfter" :show-overflow-tooltip="true" />
         <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
               <div>{{ scope.row.status == 0 ? '禁用' : '启用' }}</div>
            </template>
         </el-table-column>
         <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
            <template #default="scope">
               <span>{{ parseTime(scope.row.updateTime) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
               <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="totalNum > 0" :total="totalNum" v-model:page="queryParams.current"
         v-model:limit="queryParams.size" @pagination="getList" />

      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" v-model="open" width="800px" append-to-body>
         <el-form ref="configRef" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="模板名称" prop="name">
               <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="模板唯一code" prop="dealCode">
               <el-input v-model="form.dealCode" placeholder="请输入" :disabled="Boolean(form.id)" />
            </el-form-item>
            <el-form-item label="模板组" prop="dealTemplateGroupId">
               <el-select v-model="form.dealTemplateGroupId" filterable remote placeholder="请输入模板组名称"
                  :remote-method="getGroupList" @focus="getGroupList()" :loading="groupLoading">
                  <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="详情" prop="detail">
               <el-input v-model="form.detail" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
               <el-radio-group v-model="form.status">
                  <el-radio :label="0">禁用</el-radio>
                  <el-radio :label="1">启用</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="数据被处理之前" prop="dealDataBefore">
               <el-input v-model="form.dealDataBefore" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="数据被处理之后" prop="dealDataAfter">
               <el-input v-model="form.dealDataAfter" placeholder="请输入" />
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
import { queryList, createTemplate, deleteTemplate, updateTemplate, dealCodeIsExist } from "@/api/templateManage/template";
import { queryList as queryGroup } from "@/api/templateManage/templateGroup";
import { debounce } from "@/utils";

const { proxy } = getCurrentInstance();

const configList = ref([]);
const groupList = ref([]);
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
const groupLoading = ref(false);

const data = reactive({
   form: {},
   queryParams: {
      current: 1,
      size: 10,
      dealCode: '',
      name: '',
      status: '',
   },
   rules: {
      name: [{ required: true, message: "模板名称不能为空", trigger: "blur" }],
      dealCode: [
         { required: true, message: "模板唯一code不能为空", trigger: "blur" },
         { validator: checkDealCodeExist, trigger: "blur"}
      ],
      dealTemplateGroupId: [{ required: true, message: "模板组不能为空", trigger: "blur" }],
      detail: [{ required: true, message: "详情不能为空", trigger: "blur" }],
      status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      dealDataBefore: [{ required: true, message: "数据被处理之前不能为空", trigger: "blur" }],
      dealDataAfter: [{ required: true, message: "数据被处理之后不能为空", trigger: "blur" }],
   }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询参数列表 */
function getList() {
   loading.value = true;
   queryList(queryParams.value).then(response => {
      configList.value = response.data.data;
      totalNum.value = response.data.totalNum;
      loading.value = false;
   });
}
/** 查询模板组列表 */
function getGroupList(name) {
   groupList.value = []
   groupLoading.value = true
   debounce(function() {
      queryGroup({
         name: name,
         current: groupList.length,
         size: 20,
      }).then(response => {
         groupLoading.value = false
         groupList.value = response.data.data;
      }).catch(() => {
         groupLoading.value = false
      });
   }, 300, false)()
}
function checkDealCodeExist(rule, value, callback) {
   dealCodeIsExist(value).then(response => {
      if(response.data) {
         callback(new Error('该dealCode已存在'));
      }else{
         callback()
      }
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
      status: '',
   };
   proxy.resetForm("configRef");
}
/** 新增按钮操作 */
function handleAdd() {
   reset();
   open.value = true;
   title.value = "新增模板";
}
/** 修改按钮操作 */
function handleUpdate(row) {
   reset();
   form.value = { ...row }
   open.value = true;
   title.value = "修改模板";
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["configRef"].validate(valid => {
      if (valid) {
         btnLoading.value = true
         if (form.value.id != undefined) {
            updateTemplate(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               btnLoading.value = false
               getList();
            });
         } else {
            createTemplate(form.value).then(response => {
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
      return deleteTemplate({ idList: configIds });
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
getList();
</script>
