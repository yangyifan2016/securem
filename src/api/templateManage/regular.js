import request from '@/utils/request'

// 查询列表
export function queryList(data) {
  return request({
    url: '/manage/sx-regular/listRegular',
    method: 'post',
    data: data
  })
}

// 新增
export function createRegular(data) {
  return request({
    url: '/manage/sx-regular/createRegular',
    method: 'post',
    data: data
  })
}

// 修改
export function updateRegular(data) {
  return request({
    url: '/manage/sx-regular/updateRegular',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteRegular(data) {
  return request({
    url: '/manage/sx-regular/deleteRegular',
    method: 'post',
    data: data
  })
}
// 详情
export function detail(query) {
  return request({
    url: '/manage/sx-regular/getRegularById',
    method: 'get',
    params: query
  })
}
// 验证
export function match(data) {
  return request({
    url: '/manage/sx-regular/matchRegular',
    method: 'post',
    data: data
  })
}