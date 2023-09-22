import request from '@/utils/request'

// 查询列表
export function queryList(data) {
  return request({
    url: '/manage/sxUserDataSourceToken/listUserDateSourceToken',
    method: 'post',
    data: data
  })
}

// 新增
export function createUserDataSource(data) {
  return request({
    url: '/manage/sxUserDataSourceToken/createUserDateSourceToken',
    method: 'post',
    data: data
  })
}

// 修改状态
export function updateUserDataSourceStatus(data) {
  return request({
    url: '/manage/sxUserDataSourceToken/changeUserDateSourceTokenStatus',
    method: 'post',
    data: data
  })
}
// 刷新连接状态
export function refreshConnectStatus(data) {
  return request({
    url: '/manage/sxUserDataSourceToken/getUserDateSourceTokenConnectionStatus',
    method: 'post',
    data: data
  })
}
// 修改
export function updateUserDataSource(data) {
  return request({
    url: '/manage/sxUserDataSourceToken/updateUserDataSourceToken',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteUserDataSource(data) {
  return request({
    url: '/manage/sxUserDataSourceToken/deleteUserDateSourceToken',
    method: 'post',
    data: data
  })
}
// 详情
export function detail(query) {
  return request({
    url: '/manage/sxUserDataSourceToken/getUserDateSourceTokenById',
    method: 'get',
    params: query
  })
}