import request from '@/utils/request'

// 查询实例类型列表
export function queryInstanceTypeList(data) {
  return request({
    url: '/manage/databaseType/listDatabaseType',
    method: 'post',
    data: data
  })
}
// 查询列表
export function queryList(data) {
  return request({
    url: '/manage/sxUserDataSource/listUserDateSource',
    method: 'post',
    data: data
  })
}
// 新增
export function createData(data) {
  return request({
    url: '/manage/sxUserDataSource/createUserDateSource',
    method: 'post',
    data: data
  })
}

// 修改
export function changeStatus(data) {
  return request({
    url: '/manage/sxUserDataSource/changeUserDateSourceStatus',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteData(data) {
  return request({
    url: '/manage/sxUserDataSource/deleteUserDateSource',
    method: 'post',
    data: data
  })
}
// 详情
export function detail(query) {
  return request({
    url: '/manage/sxUserDataSource/getUserDateSourceById',
    method: 'get',
    params: query
  })
}
