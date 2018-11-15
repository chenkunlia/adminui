<template>
  <div v-loading="loading" element-loading-text="上传中...">
    <el-upload ref="upload" class="upload-demo" :action="actionUrl" :show-file-list="false" :data="params" :disabled="disabled" :on-success="handleSuccess" :on-error="handleError" :on-progress="handleProcess" :before-upload="beforeUpload" :on-change="handleChange" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="handleExceed">
      <el-button size="small" type="primary" v-show="!disabled">点击上传</el-button>
    </el-upload>
    <span class="msg">
      {{fileMsg}}
    </span>

    <ul class="list-group">
      <li class="list-group-item" v-for="(file,index) in filesList" :key='file.url'>
        <a class="file-name" type="primary" @click="download(file)">
          {{file.name}}
        </a>
        <a class="download" type="primary" @click="download(file)" title="下载">
          <i class="el-icon-download"></i>
        </a>
        <a class="remove" v-show="dialogStatus!=='view'" @click='remove(index)' title="删除">
          <i class="el-icon-close"></i>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
// import { downloadFile } from "@/commons/api/file";
import { notify } from "@/commons/utils/notify";
import axios from "axios";
import { setTimeout } from "timers";

export default {
  props: {
    //文件上传的请求地址
    actionUrl: {
      type: String,
      default: "",
      required: true
    },

    //文件列表
    filesList: {
      type: Array,
      default: "",
      required: true
    },

    //附加参数
    params: {
      type: Object,
      default: {},
      required: false
    },

    //是否禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },

    //表单状态
    dialogStatus: {
      type: String,
      default: "",
      required: false
    },
    //表单状态
    dialogFormVisible: {
      type: Boolean,
      default: true,
      required: true
    }
  },

  data() {
    return {
      list: [],
      fileMsg: "",
      loading: false
    };
  },

  watch: {
    dialogFormVisible: {
      handler(newName, oldName) {
        if (newName === false) {
          this.loading = false;
        }
      },
      immediate: true
    }
  },

  methods: {
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleExceed(file, fileList) {},
    handleProcess(event, file, fileList) {},
    beforeRemove(file, fileList) {},
    handleChange(file, fileList) {},

    //上传文件失败后操作
    handleError(response, file, fileList) {
      this.loading = false;
      var that = this;
      var limitSize = 1024 * 1024 * 2;
      if (file.size > limitSize) {
        var size = file.size / 1024 / 1024;
        that.fileMsg =
          "文件大小超过2M,不允许上传!  当前文件大小：" + size + "M";
      } else {
        that.fileMsg = "文件上传失败!";
      }

      setTimeout(function() {
        that.fileMsg = "";
      }, 6000);
    },

    //上传文件成功后操作
    handleSuccess(response, file, fileList) {
      this.loading = false;
      var that = this;
      var res = notify(this, response, true);
      if (res) {
        that.fileMsg = "";
        var fileData = response.data;
        //返回上传文件的所有信息
        this.$emit("uploadCallBack", fileData);
      }
    },
    beforeUpload(file) {
      this.loading = true;
    },

    //下载文件
    download: function(file) {
      var url = file.url;
      //方式1
      //window.open(url);

      //方式2
      //这里的download属性，可能存在同源策略限制
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", file.name);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    //删除文件
    remove: function(index) {
      this.filesList.splice(index, 1);
      //返回删除文件的下标
      this.$emit("removeCallBack", index);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.list-group {
  list-style: none;
}

.list-group a {
  display: inline-block;
}

.list-group .file-name {
  width: 300px;
}

.msg {
  color: red;
  font-size: 12px;
}
</style>