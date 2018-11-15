import getInterface from '@/commons/api/index'

var root = 'app'

import request from '@/commons/utils/request'

// 取水征费相关
// 添加取水征费
export function addCost(query) {
  return request({
    url: '/app/intake/cost/',
    method: 'post',
    data: query
  })
}

// 删除取水征费
export function deleteCost(query) {
  return request({
    url: '/app/intake/cost/',
    method: 'delete',
    data: query
  })
}

// 分页查询取水征费
export function getCostList(query) {
  return request({
    url: '/app/intake/cost/page',
    method: 'post',
    data: query
  })
}

// 更新取水征费
export function updateCost(query) {
  return request({
    url: '/app/intake/cost/',
    method: 'put',
    data: query
  })
}

// 获取取水频率下拉列表
export function getCostFrequencyList(query) {
  return request({
    url: '/app/intake/cost/constant',
    method: 'get',
    params: query
  })
}

// 获取取水单位下拉列表
export function getOrganStatusList(query) {
  return request({
    url: '/app/intake/organ/options',
    method: 'get',
    params: query
  })
}

// 概化图展示
export function getMapList(query) {
  return request({
    url: '/app/intake/map/',
    method: 'post',
    data: query
  })
}

// 取水单位相关
// 分页查询取水单位
export function getOrganList(query) {
  return request({
    url: '/app/intake/organ/page',
    method: 'post',
    data: query
  })
}

// 更新取水单位
export function updateOrgan(query) {
  return request({
    url: '/app/intake/organ/',
    method: 'put',
    data: query
  })
}

// 取水记录相关
// 添加取水记录
export function addRecord(query) {
  return request({
    url: '/app/intake/record/',
    method: 'post',
    data: query
  })
}

// 删除取水记录
export function deleteRecord(query) {
  return request({
    url: '/app/intake/record/',
    method: 'delete',
    data: query
  })
}

// 分页查询取水记录
export function getRecordList(query) {
  return request({
    url: '/app/intake/record/page',
    method: 'post',
    data: query
  })
}

// 更新取水记录
export function updateRecord(query) {
  return request({
    url: '/app/intake/record/',
    method: 'put',
    data: query
  })
}

export default {
  // 取水征费相关
  addCost: (data) => getInterface(root, '/intake/cost/', data, 'add'), // 增加征费
  deleteCost: (data) => getInterface(root, '/intake/cost/', data, 'delete'), // 删除征费
  updateCost: (data) => getInterface(root, '/intake/cost/', data, 'put'), // 修改征费
  getCostPage: (data) => getInterface(root, '/intake/cost/', data, 'post', 'page'), // 查询征费

  // 取水单位相关
  addOrgan: (data) => getInterface(root, '/intake/organ/', data, 'add'), // 增加单位
  deleteOrgan: (data) => getInterface(root, '/intake/organ/', data, 'delete'), // 删除单位
  updateOrgan: (data) => getInterface(root, '/intake/organ/', data, 'put'), // 修改单位
  getOrganPage: (data) => getInterface(root, '/intake/organ/', data, 'post', 'page'), // 查询单位

  getOrganOptions: (data) => getInterface(root, '/intake/organ/', data, 'post', 'options'), // 获取单位下拉选项

  // 取水记录相关
  addRecord: (data) => getInterface(root, '/intake/record/', data, 'add'), // 增加记录
  deleteRecord: (data) => getInterface(root, '/intake/record/', data, 'delete'), // 删除记录
  updateRecord: (data) => getInterface(root, '/intake/record/', data, 'put'), // 修改记录
  getRecordPage: (data) => getInterface(root, '/intake/record/', data, 'post', 'page'), // 查询记录

  // 取水概化图相关
  getMapData: (data) => getInterface(root, '/intake/map/', data, 'get') // 查询记录
}
