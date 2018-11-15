<template>
  <div id="app">    
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
import store from '@/commons/store'
export default {
  name: 'App',
  provide(){
    return {
      reload:this.reload
    }
  },
  data(){
    return {
      isRouterAlive:true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive=false
      store.dispatch('GetUserMenu').then(res => { // 拉取user_info
          const menus = res.data // note: roles must be a array! such as: ['editor','develop']
          store.dispatch('GenPrivRoutes', menus).then(() => {
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
          })
        })
        
      this.$nextTick(function(){
        this.isRouterAlive=true
      })
    }
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
