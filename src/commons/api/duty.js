import request from '@/commons/utils/request'

// 值班管理相关
// 获取值班列表
export function getDutyList (query) {
  return request({
    url: '/pms/duty/get_duty_list',
    method: 'post',
    data: query
  })
}

// 获取值班列表
export function getUserDetail (url) {
  return request({
    url: url,
    method: 'get'
  })
}


