// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
// import VueRouter from 'vue-router'
import router from '@/router/admin.router'
// import router from './router'
import ElementUI from 'element-ui'
import proxy from 'http-proxy-middleware'
import proxyList from '../../config/build.proxy'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/common.scss'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/commons/styles/index.scss' // global css
import i18n from '@/commons/lang'
import store from '@/commons/store'
import axios from 'axios'
// import ElSearchTablePagination from 'el-search-table-pagination'
import {configProxy} from '@/commons/utils/request'
import '@/commons/icons' // icon
import '@/commons/errorLog' // error log
import '@/commons/permission' // permission control
import 'es6-promise'
import 'svg.js'
import '@/commons/mock'
import * as filters from '@/commons/filters' // global filters
import {notify, notifyNative} from '@/commons/utils/notify'
import {format} from '@/commons/utils'
Vue.config.productionTip = false
axios.defaults.withCredentials = true // 允许携带证书
axios.interceptors.request.use(
  config => {
    // var xtoken = getXtoken()
    // if (xtoken != null) {
    //   config.headers['X-Token'] = xtoken
    // }
    configProxy(config)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }

)
Vue.prototype.$axios = axios
Vue.prototype.$notify = notify
Vue.prototype.$notifyNative = notifyNative
Vue.prototype.$format = format
// Vue.use(VueRouter)
// Vue.use(ElementUI)
Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// Vue.use(ElSearchTablePagination, {
//   axios
// })
// if (process.env.NODE_ENV === 'production') {
//   for (var p in proxyList.buildlist) {
//     console.log('p', proxyList.buildlist[p])
//     Vue.use(p, proxy(proxyList.buildlist[p]))
//   }
// }
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// const router = new VueRouter({admin})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: {
    App
  },
  template: '<App/>'
})
