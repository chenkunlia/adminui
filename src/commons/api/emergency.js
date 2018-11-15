import {
  getInterface
} from '@/commons/api/index'

var root = 'app'

export default {

  // 预案管理相关
  getEmergencyPlanFiles: (data) => getInterface(root, '/emergency_plan/', data, 'get', 'files'), // 获取预案附件

  addEmergencyPlan: (data) => getInterface(root, '/emergency_plan/', data, 'post'), // 增加预案
  deleteEmergencyPlan: (data) => getInterface(root, '/emergency_plan/', data, 'delete'), // 删除预案
  updateEmergencyPlan: (data) => getInterface(root, '/emergency_plan/', data, 'put'), // 修改预案
  getEmergencyPlanPage: (data) => getInterface(root, '/emergency_plan/', data, 'post', 'page'), // 查询预案

  getEmergencyPlanOptions: (data) => getInterface(root, '/emergency_plan/', data, 'get', 'options'), // 获取指导预案下拉列表

  // 事件管理相关
  getEmergencyEventFiles: (data) => getInterface(root, '/emergency_event/', data, 'get', 'files'), // 获取事件附件（过程/总结）
  bubbleEmergencyEvent: (data) => getInterface(root, '/emergency_event/', data, 'get', 'bubble'), // 获取事件气泡提醒

  addEmergencyEvent: (data) => getInterface(root, '/emergency_event/', data, 'post'), // 增加事件
  deleteEmergencyEvent: (data) => getInterface(root, '/emergency_event/', data, 'delete'), // 删除事件
  updateEmergencyEvent: (data) => getInterface(root, '/emergency_event/', data, 'put'), // 修改事件
  getEmergencyEventPage: (data) => getInterface(root, '/emergency_event/', data, 'post', 'page'), // 查询事件

  getEndConditionOptions: (data) => getInterface(root, '/emergency_event/', data, 'get', 'options'), // 获取事件终止条件下拉列表

  // 事件管理-过程相关
  addProcess: (data) => getInterface(root, '/emergency_event/process/', data, 'post'), // 增加过程
  deleteProcess: (data) => getInterface(root, '/emergency_event/process/', data, 'delete'), // 删除过程
  updateProcess: (data) => getInterface(root, '/emergency_event/process/', data, 'put'), // 修改过程
  getProcessPage: (data) => getInterface(root, '/emergency_event/process/', data, 'post', 'page'), // 查询过程

  // 事件管理-总结相关
  updateSummary: (data) => getInterface(root, '/emergency_event/summary/', data, 'put') // 更新总结
}
