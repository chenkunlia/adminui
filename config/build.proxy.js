// let url = {
//   pms: 'http://jsj-1809-006:8081',
//   app: 'http://jsj-1809-006:8082'
// } //lilu
// let url={
//     pms:'http://192.168.0.72:8081',
//     app:'http://192.168.0.72:8082'
// }  //weixian
let url={
    pms:'http://v-2008-dev78:8081',
    app:'http://v-2008-dev78:8082'
}  //devtest
// let url={
//     pms:'http://v-2012-test85:8081',
//     app:'http://v-2012-test85:8082'
// }  //qa
module.exports = {
  buildlist: {
    '/pms': {
      target: url.pms, // 你要代理的域名和端口号，要加上
      changeOrigin: true,
      pathRewrite: {
        '^/pms': url.pms + '/pms' // 这里用‘/api’代替target里面的地址，组件中调用接口时直接用api代替 比如我要调用'http://xxx.com:8080/api/NEWS/getNews.json?page=1&pageSize=10
        // '，直接写‘/api/NEWS/getNews.json?page=1&pageSize=10’即可
      }
    },
    '/dutyList': {
      target: url.app,
      changeOrigin: true,
      pathRewrite: {
        '^/dutyList': url.app + '/dutyList'
      }
    }
  }
}
