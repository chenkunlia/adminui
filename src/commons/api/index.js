import {
  http
} from '@/commons/utils/request'

import {
  notify
} from '@/commons/utils/notify'

import {
  removeFilePrefix,
  docToFile
} from '@/commons/utils'

// import {
//   getName
// } from '@/commons/utils/auth' // 获取登录的用户名称

export function getInterface(root, modules, data, method, action) {
  if (!action) {
    action = ''
  }
  var url = '/' + root + modules + action
  return http(url, data, method)
}

export default {
  // =====筛选条件相关=====
  // 重置按钮操作
  handleReset: function (obj) {
    obj.resetListQuery.pageSize = obj.listQuery.pageSize
    obj.listQuery = Object.assign({}, obj.resetListQuery)
  },

  // =====工具栏相关=====
  // 添加按钮操作
  handleCreate: function (obj, handleType) {
    if (handleType) {
      obj.dialogStatusProcess = 'create' // 对话框状态为添加
      obj[handleType + 'DialogFormVisible'] = true // 显示对话框
      obj.resetProcessTemp()

      if (!obj.temp.id) {
        obj.createDataAjax() // 添加事件过程前，先保存事件基础信息，返回id
      } else {
        obj.processTemp.id = obj.temp.id // 初始化表单
      }
      obj[handleType + 'FileList'] = []
      obj[handleType + 'Temp'].files = [] // 用于数据交互
      obj.$nextTick(() => {
        obj.$refs['processForm'].clearValidate() // 清除校验
      })
    } else {
      obj.dialogStatus = 'create' // 对话框状态为添加
      obj.dialogFormVisible = true // 显示对话框
      obj.resetTemp() // 重置表单项
      obj.processList = [] // 清空过程列表
      obj.$nextTick(() => {
        obj.$refs['dataForm'].clearValidate() // 清除校验
      })
    }
  },

  // 获取列表数据
  getList: function (obj, modules, fun) {
    obj.listLoading = true // 显示加载标识
    modules[fun](obj.listQuery).then(response => {
      var res = notify(obj, response, true)
      if (res) {
        obj.list = response.data.list
        obj.total = response.data.total
      }
      obj.listLoading = false
    })
  },

  // 获取过程列表数据
  getProcessList: function (obj, modules, fun, id) {
    obj.listLoading = true // 显示加载标识
    var queryInfo = {
      id: id
    }
    modules[fun](queryInfo).then(response => {
      var res = notify(obj, response, true)
      if (res) {
        obj.processList = response.data
      }
      obj.listLoading = false
    })
  },

  // 刪除按钮操作
  handleDelete: function (obj, modules, fun, row) {
    obj.$confirm('确认删除该记录吗?', '提示', {
      type: 'warning'
    }).then(() => {
      var deleteInfo = {
        ids: [row.id]
      }
      modules[fun](deleteInfo).then(response => {
        var res = notify(obj, response)
        if (res) {
          obj.getList()
        }
        // 删除过程后，重新加载过程列表
        if (fun === 'deleteProcess') {
          obj.getProcessList(obj.eventRow)
        }
      })
    }).catch(() => {})
  },

  // 编辑按钮操作
  handleUpdate: function (obj, row, handleType, withList) {
    if (withList) {
      // 打开事件编辑框时，获取过程列表
      obj.dialogStatus = 'update' // 对话框状态为编辑
      obj.getProcessList(row.id)
      obj.eventRow = row.id
      obj.dialogFormVisible = true // 显示对话框
    } else {
      if (handleType) {
        obj.dialogStatusProcess = 'update' // 对话框状态为编辑
        obj[handleType + 'DialogFormVisible'] = true // 显示对话框
        obj.getFileList(row.id, handleType)
        obj.processTemp = Object.assign({}, row) // 初始化表单
        obj.$nextTick(() => {
          if (obj.$refs.processForm) {
            obj.$refs.processForm.clearValidate() // 清除校验
          }
        })
        return
      } else {
        obj.dialogStatus = 'update' // 对话框状态为编辑
        obj.getFileList(row.id)
        obj.dialogFormVisible = true // 显示对话框
      }
    }

    obj.temp = Object.assign({}, row) // 初始化表单
    obj.dialogStatus = 'update' // 对话框状态为编辑
    obj.$nextTick(() => {
      if (obj.$refs.dataForm) {
        obj.$refs.dataForm.clearValidate() // 清除校验
      }
    })
  },

  // 控制每页显示条数
  handleSizeChange: function (obj, val) {
    obj.listQuery.pageSize = val
    obj.getList()
  },

  // 跳转页码
  handleCurrentChange: function (obj, val) {
    obj.listQuery.pageNum = val
    obj.getList()
  },

  // 重置表单项
  resetTemp: function (obj) {
    obj.temp = {}
    obj.temp.files = []
    obj.fileList = []
  },

  // 重置过程表单项
  resetProcessTemp: function (obj) {
    obj.processTemp = {}
    obj.processTemp.files = []
    obj.fileList = []
  },

  // 预览操作
  handlePreview: function (obj, row, handleType, withList) {
    obj.dialogStatus = 'view' // 对话框状态为添加
    if (withList) {
      // 打开事件编辑框时，获取过程列表
      obj.getProcessList(row.id)
      obj.eventRow = row.id
      obj.dialogFormVisible = true // 显示对话框
    } else {
      if (handleType) {
        obj[handleType + 'DialogFormVisible'] = true // 显示对话框
        obj.getFileList(row.id, handleType)
        obj.processTemp = Object.assign({}, row) // 初始化表单
        obj.$nextTick(() => {
          if (obj.$refs.processForm) {
            obj.$refs.processForm.clearValidate() // 清除校验
          }
        })
        return
      } else {
        obj.getFileList(row.id)
        obj.dialogFormVisible = true // 显示对话框
      }
    }
    obj.temp = Object.assign({}, row) // 初始化表单
    obj.dialogStatus = 'view' // 对话框状态为编辑
    obj.$nextTick(() => {
      if (obj.$refs.dataForm) {
        obj.$refs.dataForm.clearValidate() // 清除校验
      }
    })
  },

  // 插入数据
  createData: function (obj, modules, fun) {
    obj.$refs['dataForm'].validate(valid => {
      if (valid) {
        // 插入文件列表
        modules[fun](obj.temp).then(response => {
          var res = notify(obj, response)
          if (res) {
            obj.dialogFormVisible = false
            obj.getList()
          }
        })
      }
    })
  },
  // 插入数据
  createDataAjax: function (obj, modules, fun) {
    obj.$refs['dataForm'].validate(valid => {
      if (valid) {
        // 插入文件列表
        modules[fun](obj.temp).then(response => {
          var res = notify(obj, response, true)
          if (res) {
            obj.dialogFormVisible = false
            obj.getList()
            obj.processTemp.id = response.data
          }
        })
      }
    })
  },

  // 插入过程
  createProcess: function (obj, modules, fun) {
    obj.$refs['processForm'].validate(valid => {
      if (valid) {
        // 插入文件列表
        modules[fun](obj.processTemp).then(response => {
          var res = notify(obj, response)
          if (res) {
            obj.processDialogFormVisible = false
            obj.getProcessList(obj.eventRow)
          }
        })
      }
    })
  },

  // 更新数据
  updateData: function (obj, modules, fun) {
    obj.$refs['dataForm'].validate(valid => {
      if (valid) {
        const tempData = Object.assign({}, obj.temp)

        // 没有文件时，后台返回时null;回传到后台需变成[]
        if (!tempData.files) {
          tempData.files = []
        }
        modules[fun](tempData).then(response => {
          var res = notify(obj, response)
          if (res) {
            obj.dialogFormVisible = false
            obj.getList()
          }
        })
      }
    })
  },

  // 更新过程
  updateProcess: function (obj, modules, fun) {
    obj.$refs['processForm'].validate(valid => {
      if (valid) {
        const tempData = Object.assign({}, obj.processTemp)

        // 没有文件时，后台返回时null;回传到后台需变成[]
        if (!tempData.files) {
          tempData.files = []
        }
        modules[fun](tempData).then(response => {
          var res = notify(obj, response)
          if (res) {
            obj.processDialogFormVisible = false
            obj.getProcessList(obj.eventRow)
          }
        })
      }
    })
  },

  // =====文件上传相关=====
  // 获取文件列表
  getFileList: function (obj, modules, fun, id, handleType) {
    obj.queryById.id = id
    modules[fun](obj.queryById).then(response => {
      var res = notify(obj, response, true)
      if (res) {
        if (handleType) {
          obj[handleType + 'FileList'] = removeFilePrefix(response.data)
          obj[handleType + 'Temp'].files = response.data // 用于数据交互
        } else {
          obj.fileList = removeFilePrefix(response.data) // 将接口返回的文件信息格式转换成upload控件识别的格式，去掉‘file’前缀，用于列表展示
          obj.temp.files = response.data // 用于数据交互
        }
      }
    })
  },
  // 上传文件回调函数
  uploadCall: function (obj, fileData, handleType, newTemp) {
    // 添加文件信息到files数组中
    if (handleType) {
      if (newTemp) {
        obj[handleType + 'Temp'].files.push(docToFile(fileData))
        obj[handleType + 'FileList'].push(removeFilePrefix(docToFile(fileData)))
      } else {
        obj.fileList.push(removeFilePrefix(docToFile(fileData)))
        if (!obj.temp.files) {
          obj.temp.files = []
        }
        obj.temp.files.push(docToFile(fileData))
      }
    } else {
      obj.fileList.push(removeFilePrefix(docToFile(fileData)))
      if (!obj.temp.files) {
        obj.temp.files = []
      }
      obj.temp.files.push(docToFile(fileData))
    }
  },
  // 移除文件回调函数
  removeCall: function (obj, index, handleType) {
    if (handleType) {
      obj[handleType + 'Temp'].files.splice(index, 1)
    } else {
      obj.temp.files.splice(index, 1)
    }
  }

  // 判断是否为当前用户
  // isCurrentUser: function (name) {
  //   return name === getName()
  // }

}
