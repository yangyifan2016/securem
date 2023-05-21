import request from '@/utils/request'

// 查询列表
export function queryList(data) {
  return request({
    url: '/manage/deal-template-group/listDealTemplateGroup',
    method: 'post',
    data: data
  })
}

// 新增
export function createGroup(data) {
  return request({
    url: '/manage/deal-template-group/createDealTemplateGroup',
    method: 'post',
    data: data
  })
}

// 修改
export function updateGroup(data) {
  return request({
    url: '/manage/deal-template-group/updateDealTemplateGroup',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteGroup(data) {
  return request({
    url: '/manage/deal-template-group/deleteDealTemplateGroup',
    method: 'post',
    data: data
  })
}
// 检查dealCode是否已存在
export function dealCodeIsExist(data) {
  return request({
    url: '/manage/deal-template-group/dealCodeIsExist?dealCode='+data,
    method: 'post',
  })
}
