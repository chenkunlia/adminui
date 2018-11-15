<template>
  <div>
    <el-dialog title="人员信息" :visible.sync="visibled" @close="onClose" width="45%"  top="4vh">
      <div style="margin:0rem 1rem;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="一、基本信息" name="first">
            <el-form  v-loading="formLoading" width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="100px" label-position="left">
              <el-row>
                <el-col :span="16">
                  <el-form-item label="姓名：" prop="name" >
                    <el-input v-model="temp.name" :disabled="disable"  style="width:80%;"/>
                  </el-form-item>
                  <el-form-item label="单位：" prop="companyCode" >
                    <el-input v-model="temp.companyCode" :disabled="disable"  style="width:80%;"/>
                  </el-form-item>
                  <el-form-item label="联系电话：" prop="mobilePhone" >
                    <el-input v-model="temp.mobilePhone" :disabled="disable"  style="width:80%;" />
                  </el-form-item>
                  <el-form-item label="职务：" prop="positionId">
                    <el-select  v-model="temp.positionId" value-key="positionId" :disabled="disable"  style="width:80%;">
                      <el-option v-for="item in positionSelectOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="头像：" prop="url" label-position="right" >
                    <el-upload class="avatar-uploader" action="/app/file/upload" :disabled="disable" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                      <img v-if="temp.url" :src="temp.url" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="职责：" prop="jobFunction">
                <el-input type="textarea" v-model="temp.jobFunction" :disabled="disable" />
              </el-form-item>
                  <el-form-item label="人员角色：">
                    <el-checkbox-group v-model="personRole" :disabled="disable" >
                      <el-checkbox label="isGrobalDuty" name="personRole">全局值班</el-checkbox>
                      <el-checkbox label="isWaterDuty" name="personRole" >水量调度值班</el-checkbox>
                      <el-checkbox label="isMsgRec" name="personRole" >短信接收人</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
              <el-form-item label="备注" prop="note">
                <el-input type="textarea" v-model="temp.note" :disabled="disable" />
              </el-form-item>

            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <span v-if="!disable" style="width:100%;">
            <el-button v-if="temp.id===''" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
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
import {
  addPersonDetail,
  getPersonDetail,
  updatePersonDetail
} from "@/commons/api/dutyPerson";
import { userDetailRules } from "@/commons/utils/validate";
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
        companyCode: "",
        id: "",
        isDuty: "",
        isDutyMsg: {},
        isMsgRec: "",
        isMsgRecMsg: {},
        jobFunction: "",
        mobilePhone: "",
        name: "",
        note: "",
        positionId: "",
        url: "",
        personRole:[]
      },
      personRole:[],
      activeName: "first",
      positionSelectOptions: [{id:'1',name:'业务员'},{id:'2',name:'总经理'}],
      rules: userDetailRules,
      visibled: false,
      formLoading:false,
       positionMap:{"1":'业务员',"2":'总经理'}
    };
  },
  watch: {
    value(newValue, oldValue) {
      this.visibled = newValue;
      this.temp={}
      // this.$refs["dataForm"].clearValidate();
      if(newValue){
        if (this.id && this.id != null && this.id !== "") {
            getPersonDetail({ id: this.id }).then(res => {
              if (res.data) {
                this.temp = res.data;
                this.temp.personRole=[]
                this.handleTemp(this.temp)
              }
            });
        }else if(this.defaultValue.id){
          this.temp = _.cloneDeep(this.defaultValue);
          this.handleTemp(this.temp)
        } else {
          this.resetForm()
        }
      }
    },
    id(newValue, oldValue) {
      
    },
    visibled(val) {
      this.$emit("input", val);
    },
    defaultValue(newValue, oldValue) {
    }
  },
  
  created() {
    
  },
  mounted(){
    
  },
  updated() {
    this.visibled = this.value;
    
    // console.log("mounted");
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if (res.data) {
        this.temp.url = res.data.docUrl;
      } else {
        this.$notify.error({
          title: "错误",
          message: res.msg,
          duration: 2 * 1000
        });
      }
    },
    handleTemp(temp){
      this.personRole=[] 
      temp.position= this.positionMap[temp.positionId]
      if(temp.isGrobalDuty==='1'){
        this.personRole.push("isGrobalDuty")
      }
      if(temp.isWaterDuty==='1'){
        this.personRole.push("isWaterDuty")
      }
      if(temp.isMsgRec==='1'){
        this.personRole.push("isMsgRec")
      }
  },
    //重置表单数据
    resetForm(){
      this.temp = {
          companyCode: "",
          id: "",
          isDuty: "",
          isDutyMsg: {},
          isMsgRec: "",
          isMsgRecMsg: {},
          jobFunction: "",
          mobilePhone: "",
          name: "",
          note: "",
          positionId: "",
          url: "",
          personRole:[]
        };
        this.personRole=[]
    },
    //上传文件之前进行判断
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg"||file.type==='image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log("fileType",file.type)
      if (!isJPG) {
        this.$notifyNative(this,"上传头像图片只能是 JPG 格式!",'error')
      }
      if (!isLt2M) {
        this.$notifyNative(this,"上传头像图片大小不能超过 2MB!",'error')
        
      }
      return isJPG && isLt2M;
    },

    //新建人员
    createData() {
      console.log("select",this.temp.personRole)
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.handlePersonRole(this.temp)
          this.temp.position= this.positionMap[this.temp.positionId]
          addPersonDetail(this.temp).then(res => {
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
    //处理人员角色
    handlePersonRole(temp){
      temp.dutyTypeVO={}
      temp.isDuty="0"
      if(this.personRole.includes('isGrobalDuty')){
        temp.isGrobalDuty="1"
        temp.dutyTypeVO.isGrobalDuty="1"
      }else{
        temp.isGrobalDuty="0"
        temp.dutyTypeVO.isGrobalDuty="0"
      }
      if(this.personRole.includes('isWaterDuty')){
        temp.dutyTypeVO.isWaterDuty="1"
        temp.isWaterDuty="1"
      }else{
        temp.dutyTypeVO.isWaterDuty="0"
        temp.isWaterDuty="0"
      }
      if(this.personRole.includes('isMsgRec')){
        temp.dutyTypeVO.isMsgRec="1"
        temp.isMsgRec="1"
      }else{
        temp.dutyTypeVO.isMsgRec="0"
        temp.isMsgRec="0"
      }
    },
    roleClick(){
      this.formLoading=true
      setTimeout(()=>{
        this.formLoading=false
      },1000)
    },
    //更新人员登记
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.handlePersonRole(this.temp)
          this.temp.position= this.positionMap[this.temp.positionId]
          updatePersonDetail(this.temp).then(res => {
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
  height: 191px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 191px;
  display: block;
}
.dialog-footer{
  width: 95%;
  text-align: right;
}
</style>
