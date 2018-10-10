import request from '@/commons/utils/request'

// 系统日志相关
// 获取日志列表
export function getLogList(query) {
  return request({
    url: '/pms/log/get_log_list',
    method: 'post',
    data: query
  })
}

// 获取模块列表
export function getModuleListSelect() {
  return request({
    url: '/pms/log/module_list_select',
    method: 'post'
  })
}

// 获取操作类型列表
export function getTypeListSelect() {
  return request({
    url: '/pms/log/type_list_select',
    method: 'post'
  })
}

// 用户管理相关
// 获取用户数据
export function getUsersData(query) {
  return request({
    url: '/pms/users/page',
    method: 'get',
    params: query
  })
}

// 获取用户常量
export function getUserStatusList() {
  return request({
    url: '/pms/users/constant/',
    method: 'get'
  })
}

// 添加用户
export function addUser(query) {
  return request({
    url: '/pms/users/',
    method: 'post',
    data: query
  })
}

// 更新用户
export function updateUser(query) {
  return request({
    url: '/pms/users/',
    method: 'put',
    data: query
  })
}

// 删除用户
export function deleteUser(query) {
  return request({
    url: '/pms/users/',
    method: 'delete',
    data: query
  })
}

// 部门相关
// 获取所有部门列表
export function getOrganList() {
  return request({
    url: '/pms/departments/',
    method: 'get'
  })
}

// 获取部门数据
export function getOrgansData(query) {
  return request({
    url: '/pms/departments/page',
    method: 'get',
    params: query
  })
}

// 获取部门常量
export function getOrganStatusList() {
  return request({
    url: '/pms/departments/constant',
    method: 'get'
  })
}

// 添加部门
export function addOrgan(query) {
  return request({
    url: '/pms/departments/',
    method: 'post',
    data: query
  })
}

// 更新部门
export function updateOrgan(query) {
  return request({
    url: '/pms/departments/',
    method: 'put',
    data: query
  })
}

// 删除部门
export function deleteOrgan(query) {
  return request({
    url: '/pms/departments/',
    method: 'delete',
    data: query
  })
}

// 角色管理相关
// 获取角色数据列表
export function getRoleList(query) {
  return request({
    url: '/pms/authority/get_role_list/',
    method: 'post',
    data: query
  })
}

// 添加角色
export function addRole(query) {
  return request({
    url: '/pms/authority/add_role/',
    method: 'post',
    data: query,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 更新角色
export function updateRole(query) {
  return request({
    url: '/pms/authority/update_role/',
    method: 'post',
    data: query
  })
}

// 删除角色
export function deleteRole(query) {
  return request({
    url: '/pms/authority/delete_role/',
    method: 'post',
    data: query,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 树相关
// 查询菜单树
export function getRoleMenuList(data) {
  return request({
    url: '/pms/authority/get_role_menu_list/',
    method: 'post',
    data: data,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 查询用户树
export function getRoleUserList(data) {
  return request({
    url: '/pms/authority/get_role_user_list/',
    method: 'post',
    data: data,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 保存菜单树
export function saveRoleMenu(query) {
  return request({
    url: '/pms/authority/save_role_menu/',
    method: 'post',
    data: query
  })
}

// 保存用户树
export function saveRoleUser(query) {
  return request({
    url: '/pms/authority/save_role_user/',
    method: 'post',
    data: query
  })
}

//菜单管理相关
//获取菜单数据
export function getMenuList(query) {
  return request({
    url: '/pms/menu/get_menu_list/',
    method: 'post',
    data: query
  })
}
export function getMenuSelectList(query) {
  return request({
    url: '/pms/menu/get_menu_select_list/',
    method: 'post',
    data: query
  })
}

export function addMenu(query) {
  return request({
    url: '/pms/menu/add_menu/',
    method: 'post',
    data: query
  })
}

export function updateMenu(query) {
  return request({
    url: '/pms/menu/update_menu/',
    method: 'post',
    data: query
  })
}

export function deleteMenu(query) {
  return request({
    url: '/pms/menu/delete_menu/',
    method: 'post',
    data: query,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

// 获取部门常量
export function getStatusList() {
  return request({
    url: '/pms/departments/constant',
    method: 'get'
  })
}