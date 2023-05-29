import request from '@/utils/request'

// 查询列表
export function queryList(data) {
  return request({
    url: '/manage/deal-template/listDealTemplate',
    method: 'post',
    data: data
  })
}

// 新增
export function createTemplate(data) {
  return request({
    url: '/manage/deal-template/createDealTemplate',
    method: 'post',
    data: data
  })
}

// 修改
export function updateTemplate(data) {
  return request({
    url: '/manage/deal-template/updateDealTemplate',
    method: 'post',
    data: data
  })
}

// 删除
export function deleteTemplate(data) {
  return request({
    url: '/manage/deal-template/deleteDealTemplate',
    method: 'post',
    data: data
  })
}
// 检查dealCode是否已存在
export function dealCodeIsExist(data) {
  return request({
    url: '/manage/deal-template/dealCodeIsExist?dealCode='+data,
    method: 'post',
  })
}
// 详情
export function detail(query) {
  return request({
    url: '/manage/deal-template/getDealTemplateById',
    method: 'get',
    params: query
  })
}
