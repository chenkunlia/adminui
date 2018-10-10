import { loginByUsername, logout, getUserInfo, getUserMenu } from '@/commons/api/user'
import { getToken, setToken, removeToken } from '@/commons/utils/auth'

const user = {
  state: {
    user: ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    }
  },

  actions: {
    // 用户名登录
    Post ({ commit }, data) {
      
    //   return new Promise((resolve, reject) => {
    //     loginByUsername(username, userInfo.password).then(response => {
    //       const data = response.data
    //       commit('SET_TOKEN', data.userCode)
    //       commit('SET_NAME', data.name)
    //       setToken(response.data.userCode)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    }

  }
}

export default user
