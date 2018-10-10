import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/commons/store'
import { getToken } from '@/commons/utils/auth'
import proxy from '../../../config/build.proxy'
// create an axios instance
axios.defaults.withCredentials = true
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})
export const fetch = (url, data) => {
  const params = {...data.params, t: new Date().getTime()}
  data.params && data.params.push(params)
  return axios(url, data)
}
export const configProxy = (config) => {
  if (process.env.NODE_ENV === 'production') {
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    for (var p in proxy.buildlist) {
      let reg = proxy.buildlist[p].pathRewrite
      let url = config.url
      for (var r in reg) {
        let t = url.match(r)
        if (t) {
          config.url = url.replace(t[0], reg[r])
        }
      }
    }
  }
  if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    config.data = {
      ...config.data,
      _t: Date.parse(new Date()) / 1000
    }
  } else if (config.method === 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }
  return config
}
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      // config.headers['X-Token'] = getToken()
    }
    console.log('env', process.env.NODE_ENV)
    configProxy(config)
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  response => response.data,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export const get = (url, params) => {
  return service({
    url: url,
    method: 'get',
    params: params
  })
}
export const post = (url, data) => {
  return service({
    url: url,
    method: 'get',
    data
  })
}

export default service
