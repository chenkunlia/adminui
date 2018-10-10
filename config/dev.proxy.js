//  let url='http://192.168.0.99:8081' //lilu
//  let url='http://192.168.0.116:8081' //weixian
//  let url='http://v-2008-dev78:8081' //qa
 let url='http://v-2012-test85:8081'
// let url='http://localhost:8085'
module.exports={
    devlist:{
        '/pms': {
            target: url, // 你要代理的域名和端口号，要加上
            changeOrigin: true,
            pathRewrite: {
              '^/pms': '/pms' // 这里用‘/api’代替target里面的地址，组件中调用接口时直接用api代替 比如我要调用'http://xxx.com:8080/api/NEWS/getNews.json?page=1&pageSize=10
                            // '，直接写‘/api/NEWS/getNews.json?page=1&pageSize=10’即可
            }
          }
    }
}