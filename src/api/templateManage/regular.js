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

