import request from '@/utils/request'

// 查询列表
export function queryList(data) {
  return request({
    url: '/manage/sxUser/listUser',
    method: 'post',
    data: data
  })
}

// 新增
export function createUser(data) {
  return request({
    url: '/manage/sxUser/createUser',
    method: 'post',
    data: data
  })
}

// 修改
export function updateUserStatus(data) {
  return request({
    url: '/manage/sxUser/changeUserDateSourceStatus',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteUser(data) {
  return request({
    url: '/manage/sxUser/deleteUser',
    method: 'post',
    data: data
  })
}
// 详情
export function detail(query) {
  return request({
    url: '/manage/sxUser/getUserById',
    method: 'get',
    params: query
  })
}
