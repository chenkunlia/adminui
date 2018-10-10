<template>
  <div>
    <div class="header-top">
        <div style="width: 100%;height: 0.7rem;"></div>
        <span class="title">欢迎登录：{{name}}</span>
    </div>
    <div :class="classObj" class="app-wrapper">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <sticky :stickyTop="49">
        <navbar />
        <tags-view />
        </sticky>
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import Menu from "@/components/Menu";
import Sticky from '@/components/Sticky'
import ResizeMixin from "./mixin/ResizeHandler";
import { mapGetters } from "vuex";
import {getName} from '@/commons/utils/auth'
export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Menu,Sticky
  },
  data(){
    return{
      name:getName()
    }
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/commons/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.header-top {
  background-color: #00003a;
  position: fixed;
  width: 100%;
  height: 3rem;
  z-index: 99;
  color: rgb(243, 236, 236);
  font-size: 1.3rem;
  .title {
    vertical-align: center;

  }
}
</style>
