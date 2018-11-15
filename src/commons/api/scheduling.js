import {
  getInterface
} from '@/commons/api/index'
import {
  http2
} from '@/commons/utils/request'
var root = 'app'

export default {

  // 水量调度相关
  getSchedulingPlanPage: (data) => getInterface(root, '/scheduling/', data, 'post', 'page'), // 获取调度计划
  getSchedulingPlanList: (data) => getInterface(root, '/scheduling/', data, 'get', 'options'), // 获取计划编号列表
  // downloadSchedulingPlan: (data) => getInterface(root, '/scheduling/', data, 'get', 'download'), // 下载调度计划

  downloadSchedulingPlan: (data) => http2('/app/scheduling/download', data, 'post'),

  getSchedulingPlan: (data) => getInterface(root, '/scheduling/', data, 'post', 'inital'), // 初始化调度计划
  addSchedulingPlan: (data) => getInterface(root, '/scheduling/history/', data, 'post', ''), // 初始化调度计划
  deleteSchedulingPlan: (data) => getInterface(root, '/scheduling/history/', data, 'delete', ''), // 初始化调度计划

  getSchedulingHistoryList: (data) => getInterface(root, '/scheduling/history/', data, 'post', 'page'),
  getSchedulingHistoryData: (data) => getInterface(root, '/scheduling/history/', data, 'post', 'data'),
}
