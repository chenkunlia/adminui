<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in privRouters" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'privRouters',
      // 'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      // console.log("privRouters",this.privRouters)
      return !this.sidebar.opened
    }
  }
}
</script>

<style>
.el-scrollbar__wrap{
  height: 95% !important;
  text-align: left;
}


</style>

