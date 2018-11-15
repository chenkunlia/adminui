var tipType = '$alert'
// var tipType = '$message'
// var tipType = '$notify'

export function notify (obj, response, noNotice) {
  // 设置默认值
  var type
  var duration = 4000
  var title = '消息'
  var result = false
  var offset = 120

  var code = response.code
  var msg = response.msg

  if (tipType === '$alert') {
    if (noNotice && code === 0) {
      return true
    } else if (code === 0) {
      type = 'success'
      title = '成功'
      result = true
    } else {
      type = 'error'
      title = '失败'
      result = false
    }
    obj.$alert(msg, title, {
      showConfirmButton: false,
      type: type,
      closeOnClickModal: true
      // center: true
    })
    return result
  }

  if (noNotice) {
    if (code === 0) {
      return true
    } else {
      type = 'error'
      title = '失败'
      obj[tipType]({
        title: title,
        message: msg,
        type: type,
        duration: duration,
        offset: offset
      })
      return false
    }
  }

  if (code === 0) {
    type = 'success'
    title = '成功'
    result = true
  } else if (code === -2 || code === 400) {
    type = 'error'
    title = '失败'
    result = false
  }
  obj[tipType]({
    title: title,
    message: msg,
    type: type,
    duration: duration,
    offset: offset
  })

  return result
}

export function notifyNative (obj, msg, type = 'info') {
  let title = ''
  if (type === 'error') {
    title = '失败'
  } else if (type === 'success') {
    title = '成功'
  } else {
    title = '提示'
  }
  obj.$alert(msg, title, {
    showConfirmButton: false,
    type,
    closeOnClickModal: true
    // center: true
  })
}
