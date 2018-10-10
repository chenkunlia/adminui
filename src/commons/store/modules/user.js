import { loginByUsername, logout, getUserInfo, getUserMenu } from '@/commons/api/user'
import { getToken, setToken, removeToken, getName, setName, removeName } from '@/commons/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: getName(),
    avatar: '',
    introduction: '',
    roles: [],
    menus: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_PRIVROUTERS: (state, routers) => {
      state.menus = routers
    }
    // SET_ACCOUNT: (state, account) => {
    //   state.account = account
    // }
  },

  actions: {
    // 用户名登录
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.account.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          if (response.code === -2) {
            reject(response)
          }
          const data = response.data
          commit('SET_TOKEN', data.userCode)
          commit('SET_NAME', data.name)
          setToken(response.data.userCode)
          setName(data.name)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', ['admin'])
        getUserInfo(state.token).then(response => {
          // if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
          //   reject('error')
          // }
          const data = response
          commit('SET_ROLES', ['admin'])
          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', ['admin'])
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          // console.log('response', response)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          // commit('SET_ACCOUNT', data.userCode)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户菜单
    GetUserMenu ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserMenu(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data
          // console.log('menus', data)
          if (data && data.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_MENUS', data)
          } else {
            reject('getMenu: menus must be a non-null array !')
          }
          // console.log('response', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_MENUS', [])
          commit('SET_PRIVROUTERS', [])
          removeToken()
          removeName()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        removeName()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles ({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
