<template>
    <div>
        <el-dialog title="" :visible.sync="visibled" @close="onClose" width="40%"  top="4vh">
            <div style="margin:0rem 1rem;">
                <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" label-position="center">
                    <tip-title title="一、导入信息">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="批次日期：" prop="batchTime">
                                    <el-date-picker type="date" style="width:100%" v-model="temp.batchTime" @change="batchChange"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="批次编号：" prop="batchCode">
                                    <el-input v-model="temp.batchCode" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="importName" label="修改人：">
                                    <el-input v-model="temp.importName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="importTime" label=修改时间：>
                                    <el-date-picker type="date" placeholder="选择时间" v-model="temp.importTime" style="width: 100%;" disabled></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </tip-title>
                    <tip-title title="二、上传数据">
                         <el-upload class="avatar-uploader" action="/app/file/upload" :multiple="false" :file-list="fileList" drap :show-file-list="true" :limit="1" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" >
                            <img v-if="temp.url" :src="temp.url" class="avatar-import">
                            <i v-else class="el-icon-plus avatar-uploader-icon-import"></i>
                            <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件</div>
                        </el-upload> 
                        <!-- <input type="file"  name="file" value="选择文件"/> -->
                    </tip-title>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="importData">保存</el-button>
                    <el-button @click="visibled = false">关闭</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import TipTitle from "@/components/TipTitle";
import {importWaterRules} from '@/commons/utils/validate'
import water from "@/commons/api/water";
import RvDetail from "./RvDetail";
import StDetail from "./StDetail";
import {format} from "@/commons/utils";
import { notify } from "@/commons/utils/notify";
import { mapGetters } from "vuex";
export default {
  components: {
    TipTitle,
    RvDetail,
    StDetail
  },
  props: {
    value: {},
    defaultValue: {
      type: Object
    },
    id: {
      type: String,
      default: ""
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.visibled = newValue;
      if(newValue){
        this.temp.importName=this.name
        this.temp.importTime=format(new Date(),'yyyy-MM-dd hh:mm:ss')
      }
    },
    visibled(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      listLoading: false,
      visibled: false,
      temp: {
          batchTime:'',
          batchCode:'',
          importName:'',
          importTime:'',
          file:''
      },
      config:{

      },
      rules:importWaterRules,
      fileList:[]
    };
  },
  computed: {
    ...mapGetters([ "name"])
  },
  methods: {
    handleClick(tab, event) {},
    batchChange() {
      this.temp.batchCode = "SYQ-BS-" + format(this.temp.batchTime, "yyyyMMdd");
    },
    onClose() {
        this.temp={
          batchTime:'',
          batchCode:'',
          importName:'',
          importTime:'',
          file:''
      }
      this.fileList=[]
    },
    handleAvatarSuccess(res, file) {
      if(res.code==0){
        console.log("file",res,file)
        this.temp.file=file.raw
        this.temp.fileUrl =res.data.docUrl
        this.temp.docId=res.data.docId
      }else{
        this.$notifyNative(this,res.msg,'error')
        this.fileList=[]
      }
    },
    beforeAvatarUpload(file) {
      if(this.fileList.length>0){
        this.fileList=[]
      }
      let names=file.name.split('.')
      let fileType=names[names.length-1]
      const isExcel = fileType === "xls"||fileType==='xlsx';
      if (!isExcel) {
        this.$notifyNative(this,"上传文件只能是 xls/xlsx 格式!",'error')
      }
      return isExcel ;
    },
    importData(){
        this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if(!this.temp.fileUrl||this.temp.fileUrl==''){
            this.$notifyNative(this,"上传文件不能为空!",'error')
           return
          }
          this.temp.importTime=format(new Date(),'yyyy-MM-dd hh:mm:ss')
          this.temp.batchTime=format(this.temp.batchTime,'yyyy-MM-dd hh:mm:ss')
          water.importWaterList(this.temp).then(res => {
            var res = notify(this, res);
            if (res) {
              this.visibled = false;
              this.$emit("success", res);
            }
          });
          this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate(); //清除校验
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon-import {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.avatar-import {
  width: 178px;
  height: 80px;
  display: block;
}
.dialog-footer{
    margin-top: 1rem;
}
</style>
