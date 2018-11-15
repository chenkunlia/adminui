<template>
  <div>
    <el-dialog title="" :visible.sync="visibled" @close="onClose"  width="50%"  top="4vh">
      <div style="margin:0rem 1rem;">
        <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="100px" label-position="left">
          <div class="log-row">
            <el-row>
              <el-col :span="4">
                <label class="log-title">一、值班日志</label>
              </el-col>
            </el-row>
            <el-input type="textarea" v-model="temp.dutyLog" :disabled="disable" />
          </div>
          <div class="log-row">
            <el-row>
              <el-col :span="4">
                <label class="log-title">二、待办事项</label>
              </el-col>
            </el-row>
            <el-input type="textarea" v-model="temp.matters" :disabled="disable" />
          </div>
          <div class="log-row">
            <el-row>
              <el-col :span="4">
                <label class="log-title">三、备注信息</label>
              </el-col>
            </el-row>
            <el-input type="textarea" v-model="temp.note" :disabled="disable" />
          </div>
          <el-form-item prop="actualDuty" label="实际值班人员：">
            <el-input v-model="temp.actualDuty" placeholder="实际值班人员"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="username" label="登记人员：">
                <el-input v-model="temp.username" placeholder="登记人员" :disabled="true">{{temp.username}}</el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="username" label="登记时间：">
                <el-input v-model="temp.createTime" placeholder="登记时间" :disabled="true"  value-format="yyyy-MM-dd">{{temp.createTime}}</el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <span v-if="!disable" style="width:100%;">
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
            <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
          </span>
          <el-button @click="visibled = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { notify } from "@/commons/utils/notify";
import { getDutyLog, addDutyLog, updateDutyLog } from "@/commons/api/duty";
import { rules } from "@/commons/utils/validate";
import {format} from '@/commons/utils'
import { mapGetters } from "vuex";
export default {
  props: {
    value: {},
    defaultValue: {
      type: Object,
      default: {}
    },
    id: {
      type: String,
      default: ""
    },
    dialogStatus: {
      type: String,
      default: "create"
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      temp: {
        dutyLog: "",
        id: "",
        matters: "",
        note: "",
        actualDuty: "",
        username: this.name,
        createTime:"" ,
        dutyDetailId:""
      },
      activeName: "first",
      positionSelectOptions: [],
      rules: {
        mobilePhone: [rules.mobile]
      },
      visibled: false,
      actualDutyOptions: []
    };
  },
  computed: {
    ...mapGetters([ "name"])
  },
  watch: {
    value(newValue, oldValue) {
      this.visibled = newValue;
      if(newValue){
        if (this.id && this.id !== null && this.id !== "") {
        this.dialogStatus = "update";
        getDutyLog(this.id).then(res => {
          this.temp = res.data;
        });
        } else {
          this.temp.username=this.name
          this.temp.createTime=format(new Date(),'yyyy-MM-dd')
        }
      }
    },
    visibled(val) {
      this.$emit("input", val);
    },
    id(newValue, oldValue) {
      
    }
  },
  created() {},
  updated() {
    this.visibled = this.value;
    console.log("mounted");
    if (this.defaultValue.id) {
      console.log("defaultValue");
      this.temp = this.defaultValue;
    }
    // if (this.id !== "") {
    //   console.log("id", this.id);
    //   getDutyLog(this.id).then(res => {
    //     this.temp = res.data;
    //   });
    // }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.temp.url = URL.createObjectURL(res.data.docUrl);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$notifyNative(this,"上传头像图片只能是 JPG 格式!",'error')
      }
      if (!isLt2M) {
        this.$notifyNative(this,"上传头像图片大小不能超过 2MB!",'error')
      }
      return isJPG && isLt2M;
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.dutyDetailId=this.defaultValue.detailId
          addDutyLog(this.temp).then(res => {
            
            if (res) {
              this.visibled = this.handleResponse(res,'add');
            }
          });
          this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate(); //清除校验
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.dutyDetailId=this.defaultValue.detailId
          updateDutyLog(this.temp).then(res => {
            if (res) {
              this.visibled = this.handleResponse(res,'update');
            }
          });
          this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate(); //清除校验
          });
        }
      });
    },
    onClose() {
      this.temp = {
        dutyLog: "",
        id: "",
        matters: "",
        note: "",
        actualDuty: "",
        username: "",
        createTime: "",
        dutyDetailId:""
      };
      this.dialogStatus="create"
      this.$refs['dataForm'].clearValidate();
    },
    handleResponse(res,msgType){
      if(res.code==0){
        if(msgType=='update'){
          this.notify('更新成功','success')
        }else if(msgType=='add'){
          this.notify('添加成功','success')
        }else if(msgType=='delete'){
          this.notify('删除成功','success')
        }
        this.$emit("success", res);
        return false
      }else if(res.code==-2){
        if(msgType=='update'){
          this.notify(res.msg,'error')
        }else if(msgType=='add'){
          this.notify(res.msg,'error')
        }else if(msgType=='delete'){
          this.notify(res.msg,'error')
        }
        return true
      }
    },
    notify(msg,showType){
      if(showType=='success'){
        this.$notify.success({
                title: "成功",
                message: msg,
                duration: 2 * 1000
              });
      }else if(showType=='error'){
        this.$notify.error({
                title: "失败",
                message: msg,
                duration: 2 * 1000
              });
      }
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
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.log-title {
  background-color: #e2e6eb;
  font-size: 1.3rem;
}
.log-row {
  margin-top: 0.5rem;
}
.dialog-footer{
  width: 95%;
  text-align: right;
}
</style>
