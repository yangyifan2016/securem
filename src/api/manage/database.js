import request from '@/utils/request'

// 查询列表
export function queryList(data) {
  return request({
    url: '/manage/databaseType/listDatabaseType',
    method: 'post',
    data: data
  })
}

// 新增
export function createData(data) {
  return request({
    url: '/manage/databaseType/createDatabaseType',
    method: 'post',
    data: data
  })
}

// 修改
export function updateData(data) {
  return request({
    url: '/manage/databaseType/updateDatabaseType',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteData(data) {
  return request({
    url: '/manage/databaseType/deleteDatabaseType',
    method: 'post',
    data: data
  })
}
// 详情
export function detail(query) {
  return request({
    url: '/manage/databaseType/getDatabaseTypeById',
    method: 'get',
    params: query
  })
}
// 修改状态
export function changeStatus(data) {
  return request({
    url: '/manage/databaseType/changeStatus',
    method: 'post',
    data: data
  })
}
// 检查dbType是否存在
export function dbTypeIsExist(data) {
  return request({
    url: '/manage/databaseType/dbTypeIsExist',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
// 检查dbTypeName是否存在
export function dbTypeNameIsExist(data) {
  return request({
    url: '/manage/databaseType/dbTypeNameIsExist',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}