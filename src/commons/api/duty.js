import request from '@/commons/utils/request'

// 值班管理相关
// 获取三防值班列表
export function getDefenseDutyList (params) {
  return request({
    url: '/app/dutyList/page/defense',
    method: 'get',
    params
  })
}
// 获取节假日值班列表
export function getHolidayDutyList (params) {
  return request({
    url: '/app/dutyList/page/holiday',
    method: 'get',
    params
  })
}
// 获取水量调度值班列表
export function getWaterDutyList (params) {
  return request({
    url: '/app/dutyList/page/water',
    method: 'get',
    params
  })
}

// 获取值班列表日志
export function getDutyLog (id) {
  return request({
    url: '/app/dutyList/log',
    method: 'get',
    params: { id }
  })
}
// 添加值班列表日志
export function addDutyLog (data) {
  return request({
    url: '/app/dutyList/log',
    method: 'post',
    data
  })
}
// 更新值班列表日志
export function updateDutyLog (data) {
  return request({
    url: '/app/dutyList/log',
    method: 'put',
    data
  })
}
// 获取值班安排列表
export function getDutyArrangeList (params) {
  return request({
    url: '/app/dutyArrange/page',
    method: 'get',
    params
  })
}
// 添加水量调度值班
export function addWaterDuty (data) {
  return request({
    url: '/app/dutyArrange/water',
    method: 'post',
    data
  })
}
// 添加节日值班
export function addHolidayDuty (data) {
  return request({
    url: '/app/dutyArrange/holiday',
    method: 'post',
    data
  })
}
// 添加节日值班
export function addDefenseDuty (data) {
  return request({
    url: '/app/dutyArrange/defense',
    method: 'post',
    data
  })
}
// 修改水量调度值班
export function updateWaterDuty (data) {
  return request({
    url: '/app/dutyArrange/water',
    method: 'put',
    data
  })
}
// 修改节日值班
export function updateHolidayDuty (data) {
  return request({
    url: '/app/dutyArrange/holiday',
    method: 'put',
    data
  })
}
// 修改节日值班
export function updateDefenseDuty (data) {
  return request({
    url: '/app/dutyArrange/defense',
    method: 'put',
    data
  })
}
// 获取水量调度值班
export function getWaterDuty (params) {
  return request({
    url: '/app/dutyArrange/water',
    method: 'get',
    params
  })
}
// 获取节日值班
export function getHolidayDuty (params) {
  return request({
    url: '/app/dutyArrange/holiday',
    method: 'get',
    params
  })
}
// 获取节日值班
export function getDefenseDuty (params) {
  return request({
    url: '/app/dutyArrange/defense',
    method: 'get',
    params
  })
}
// 删除值班 data: {id:'',type:''}
export function deleteDuty (data) {
  return request({
    url: '/app/dutyArrange/delete',
    method: 'delete',
    data
  })
}
