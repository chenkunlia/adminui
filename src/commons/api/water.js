import request from '@/commons/utils/request'
import {http} from '@/commons/utils/request'
// 水雨情相关
// 获取水雨情列表
export function getWaterList(data) {
  return request({
    url: '/app/water/page',
    method: 'post',
    data
  })
}

// 站点列表数据
export function getStattionList(data) {
  return request({
    url: '/app/water/st/page',
    method: 'post',
    data
  })
}

// 水库列表数据
export function getReservoirList(data) {
  return request({
    url: '/app/water/rv/page',
    method: 'post',
    data
  })
}


// 短信报送
// 短信模板内容生成 
export function generateSmgContent(params) {
  return request({
    url: '/app/smgRecord/',
    method: 'get',
    params
  })
}

//最近选择人员查询
export function getCurrentRecipients(params) {
  return request({
    url: '/app/smgRecord/getCurrentRecipients',
    method: 'get',
    params
  })
}


export default {
  getSentSmgRecords: (data) => http("/app/smgRecord/smgRecord", data, 'get'), //报送记录查询
  deleteWater: (data) => http("/app/water/", data, 'delete'), //删除水雨情数据
  getRVDetail: (data) => http("/app/water/rv/", data, 'get'), //水库详情数据
  updateReservoirDetail: (data) => http("/app/water/rv/", data, 'put'), //更改水库详情数据
  getSTDetail: (data) => http("/app/water/st/", data, 'get'), //站点详情数据
  sendSmg: (data) => http("/app/smgRecord/sendSmg", data, 'post'), //短信发送及发送记录的保存
  importWaterList: (data) => http("/app/water/import_excel", data, 'post'), //导入excel
}
