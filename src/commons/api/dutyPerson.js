import request from '@/commons/utils/request'

// 获取人员列表分页数据
export function getPersonList (params) {
  return request({
    url: '/dutyPerson/page',
    method: 'get',
    params
  })
}

// 获取人员列表
export function getPersonListAll () {
  return request({
    url: '/dutyPerson/all',
    method: 'get'
  })
}

// 查看人员详情
export function getPersonDetail (params) {
  return request({
    url: '/dutyPerson/',
    method: 'get',
    params
  })
}

// 添加人员详情
export function addPersonDetail (data) {
  return request({
    url: '/dutyPerson/',
    method: 'post',
    data
  })
}

// 更新人员详情
export function updatePersonDetail (data) {
  return request({
    url: '/dutyPerson/',
    method: 'put',
    data
  })
}

// 删除人员详情
export function deletePersonDetail (data) {
  return request({
    url: '/dutyPerson/',
    method: 'delete',
    data
  })
}
