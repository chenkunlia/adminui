/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername (str) {
  const valid_map = ['admin', 'editor']
  return true
}

/* 合法uri */
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母 */
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validateAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail (email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
let ChangeTrigger = true
// 非空校验
const reqf = (name, changeTrigger) => {
  return {
    required: true,
    message: `${name}不能为空`,
    trigger: changeTrigger ? 'change' : 'blur'
  }
}
// 长度校验
const lenf = (min, max) => {
  return {
    min: min || 0,
    max: max || 30,
    message: `长度必须在${min || 0}到${max || 30}个字符之间`,
    trigger: 'blur'
  }
}

// 数字或带小数点数字校验
const numpf = (name) => {
  const re = /^\d+(\.\d+)?$/
  var validate = (rule, value, callback) => {
    if (re.test(value)) {
      callback()
    } else {
      callback(new Error('只能填写数字!'))
    }
  }
  return {
    validator: validate,
    trigger: 'blur'
  }
}

// 手机号码校验
const phonef = (name) => {
  const re = /^1[34578]\d{9}$/
  var validate = (rule, value, callback) => {
    if (re.test(value)) {
      callback()
    } else {
      callback(new Error('请正确填写手机号码!'))
    }
  }
  return {
    validator: validate,
    trigger: 'blur'
  }
}

// 纯数字校验
const numf = (name) => {
  const re = /^[0-9]*$/
  var validate = (rule, value, callback) => {
    if (re.test(value)) {
      callback()
    } else {
      callback(new Error('只能填写数字!'))
    }
  }
  return {
    validator: validate,
    trigger: 'blur'
  }
}

// 特殊字符校验
const specif = (name) => {
  var specialKey = "[`~!#$^&%*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
  var validate = (rule, value, callback) => {
    for (var i = 0; i < value.length; i++) {
      if (specialKey.indexOf(value.substr(i, 1)) !== -1) {
        callback(new Error('不能包含特殊字符!'))
      } else {
        callback()
      }
    };
  }
  return {
    validator: validate,
    trigger: 'blur'
  }
}

export const rules = {
  req: {
    required: true,
    message: name + '不能为空',
    trigger: 'blur'
  },
  len: {
    min: 1,
    max: 32,
    message: '长度必须在1到32个字符之间',
    trigger: 'blur'
  },
  email: {
    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: '邮件格式不正确',
    trigger: 'blur'
  },
  mobile: {
    pattern: /^1[34578]\d{9}$/,
    message: '请输入正确的手机号码',
    trigger: 'blur'
  },
  IDcard: {
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message: '请输入正确的身份证号',
    trigger: 'blur'
  },
  carId: {
    pattern: /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/,
    message: '请输入正确的车牌号，常规格式：晋B12345',
    trigger: 'blur'
  }

}

export const dutyArrangeRules = {
  dutyName: [reqf('标题'), lenf(), specif()],
  beginTime: [reqf('开始日期', ChangeTrigger)],
  endTime: [reqf('结束日期', ChangeTrigger)]
}

export const dutyLogRules = {

}
export const userDetailRules = {
  mobilePhone: [reqf('电话号码'), rules.mobile],
  name: [reqf('姓名'), specif()],
  companyCode: [reqf('单位'), specif()],
  positionId: [reqf('职务', ChangeTrigger)],
  jobFunction: [reqf('职责'), specif()]
}

export const importWaterRules = {
  batchTime: [reqf('批次日期', ChangeTrigger)]
}

export const userRules = {
  account: [reqf('账号'), lenf(6, 20)],
  name: [reqf('姓名'), lenf()],
  password: [reqf('密码'), lenf(6, 32)],
  status: [reqf('账号状态', true)]
}

export const organRules = {
  name: [reqf('部门名称'), lenf()],
  status: [reqf('部门状态', true)]
}

export const roleRules = {
  roleName: [reqf('角色名称'), lenf()]
}

export const menuRules = {
  menuName: [reqf('菜单名称'), lenf()],
  url: [reqf('菜单路径'), lenf()],
  status: [reqf('菜单状态', true)]
}

export const planRules = {
  title: [reqf('预案标题'), lenf(), specif()],
  resume: [reqf('预案概要')],
  startDate: [reqf('有效开始日期', true)],
  endDate: [reqf('有效结束日期', true)]
}

export const eventRules = {
  title: [reqf('事件标题'), lenf(), specif()],
  resume: [reqf('事件概要')],
  startDate: [reqf('开始日期', true)]
}

export const processRules = {
  startDate: [reqf('开始日期', true)],
  endDate: [reqf('结束日期', true)],
  content: [reqf('过程信息')],
  person: [reqf('应急人员')],
  organ: [reqf('参与科室')]
}

export const summaryRules = {
  summaryDate: [reqf('总结日期', true)],
  name: [reqf('总结人')],
  content: [reqf('总计内容')]
}

export const intakeRecordRules = {
  time: [reqf('取水日期', true)],
  organId: [reqf('取水单位', true)],
  license: [reqf('许可证取水量'), numpf()],
  intake: [reqf('实际取水量'), numpf()],
  plan: [reqf('计划取水量'), numpf()],
  biased: [reqf('取水偏差量'), numpf()]
}

export const intakeOrganRules = {
  code: [reqf('取水单位编码'), numf()],
  organName: [reqf('取水单位名称')],
  areaName: [reqf('行政区划名称')],
  person: [reqf('单位负责人')],
  phone: [reqf('单位联系电话')],
  address: [reqf('单位地址')],
  yearIntake: [reqf('批准年取水量'), numpf()],
  maxIntake: [reqf('最大取水量'), numpf()]
}

export const intakeCostRules = {
  time: [reqf('取水日期', true)],
  organId: [reqf('取水单位', true)],
  use: [reqf('取水用途')],
  intoke: [reqf('月实际取水量'), numpf()],
  frequency: [reqf('缴费频率', true)],
  pay: [reqf('月缴费金额'), numpf()],
  plan: [reqf('月计划取水量'), numpf()],
  ratio: [reqf('超计划取水比例'), numpf()],
  totalRatio: [reqf('超累进收费比例'), numpf()]
  // analysis: [reqf('取水分析说明')]
}

export const mapRules = {}

export const schedulingRules = {

}
