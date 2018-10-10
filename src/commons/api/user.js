import request, {fetch} from '@/commons/utils/request'

export function loginByUsername (account, password) {
  const data = {
    account,
    password
  }
  // return fetch('/pms/login', data)
  return request({
    url: '/pms/login',
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: '/pms/logout',
    method: 'get'
  })
}

export function getUserInfo (token) {
  return request({
    url: '/pms/info',
    method: 'get',
    params: { token }
  })
}
export function getUserMenu () {
  return request({
    url: '/pms/menu/get_user_menu_list',
    method: 'post'
  })
}
