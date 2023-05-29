<template>
  <el-table v-loading="loading" :data="dataList" :border="true" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" @cell-click="cellClick">
    <el-table-column type="selection" width="55" align="center" v-if="needSelection" />
    <el-table-column v-for="column in columns" :label="column.label" :width="column.width" :prop="column.prop"
      :show-overflow-tooltip="column.showOverflowTooltip" align="center">
      <template #default="scope" v-if="column.scope">
        <div v-if="column.scope === 'time'">{{ parseTime(scope.row[column.prop]) }}</div>
        <div v-else>{{ column.scope(scope.row[column.prop]) }}</div>
      </template>
    </el-table-column>
    <el-table-column v-if="operations.length > 0" label="操作" align="center" class-name="small-padding fixed-width">
      <template #default="scope">
        <el-button v-for="operation in operations" link :type="operation.type || 'primary'" :icon="operation.icon"
          @click="operationHandler(operation.emitName, scope.row)">{{ operation.buttonName }}</el-button>
      </template>
    </el-table-column>
  </el-table>
  <pagination v-show="totalNum > 0" :total="totalNum" v-model:page="queryParams.current" v-model:limit="queryParams.size" @pagination="getList" />
</template>

<script setup>

import { ElMessage } from 'element-plus'
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  needSelection: {
    type: Boolean,
    default: true,
  },
  dataList: {
    type: Array,
    default: []
  },
  columns: {
    required: true,
    type: Array,
    default: []
  },
  operations: {
    type: Array,
    default: []
  },
  totalNum: {
    type: Number,
    default: 0
  },
  current: {
    type: Number,
    default: 1
  },
  size: {
    type: Number,
    default: 10
  },
})
const emit = defineEmits(['handleSelectionChange', 'operationHandler', 'getList'])
const queryParams = reactive({
  current: props.current,
  size: props.size,
})
/** 多选框选中数据 */
function handleSelectionChange(selection) {
  emit('handleSelectionChange', selection)
}
/** 操作按钮点击 */
function operationHandler(name, row) {
  emit('operationHandler', name, row)
}
/** pagination */
function getList() {
  emit('getList', queryParams.current, queryParams.size)
}
/** 设置行样式 */
function tableRowClassName({ row }) {
   if (row.status === 0) {
      return 'disabled-row';
   } else if (row.status === 1) {
      return 'abled-row';
   }
   return '';
}
/** 单元格点击复制内容 */
function cellClick(row, column, cell, event) {
  // ElMessage.info('已复制')
  
}
</script>

<style>
.el-table tr.disabled-row {
   background-color: oldlace;
}
.el-table tr.abled-row {
   background-color: #f0f9eb;
}
</style>