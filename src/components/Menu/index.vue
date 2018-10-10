<template>
    <router-link :to="resolvePath(path)">
        <el-menu-item :index="path" class="submenu-title-noDropdown:false">
            <svg-icon v-if="iconClass" :icon-class="iconClass" />
            <span v-if="title" slot="title">{{ generateTitle(title) }}</span>
        </el-menu-item>
    </router-link>
</template>
<script>
import path from "path";
import { generateTitle } from "@/commons/utils/i18n";

export default {
  name: "Menu",
  props: {
    // route object
    path: {
      type: String,
      required: true
    },
    class: {
      type: String,
      default: false
    },
    iconClass: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  methods: {
    generateTitle
  }
};
</script>