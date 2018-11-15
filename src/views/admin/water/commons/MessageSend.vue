<template>
  <div>
    <el-dialog title="" :visible.sync="visibled" @close="onClose" width="60%"  top="4vh">
      <div style="margin:0rem 1rem;">
        <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="120px" label-position="center">
          <tip-title title="一、短信信息">
            <el-row>
              <el-col :span="12">
                <el-form-item label="批次日期：" prop="batchDate">
                  <el-input v-model="temp.batchDate" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" >
                <el-form-item label="批次编号：" prop="batchCode">
                  <el-input v-model="temp.batchCode" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="smgContent" label="短信内容：">
              <el-input v-model="temp.smgContent" type="textarea" autosize></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="sendName" label=报送人：>
                  <el-input v-model="temp.sendName" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="sendTime" label=报送时间：>
                  <el-date-picker type="date" disabled placeholder="选择时间" value-format="yyyy-MM-dd HH:mm" v-model="temp.sendTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </tip-title>
          <tip-title title="二、报送目标">
            <el-row>
              <el-col :span="18">

                <el-form-item prop="recipients" label="接收人：">
                  <el-input v-model="temp.recipients" type="textarea"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-col>
                    <el-button size="small" @click.native="personSelect">人员选择</el-button>
                  </el-col>
                  <el-col>
                    <el-button size="small" @click.native="lastSelect">最近选择</el-button>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col></el-col>
                </el-row>
              </el-col>
            </el-row>
          </tip-title>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  type="primary" @click="sendData">报送</el-button>
          <el-button @click="visibled = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
     <el-dialog title="人员选择" :visible.sync="personV" >
        <el-form width="30%" ref="dataForm" :rules="rules" :model="personTemp" label-width="120px" label-position="center">
          <el-form-item label="人员" prop="persons">
             <el-select v-model="personTemp.recipients" style="width:100%;" multiple filterable remote reserve-keyword placeholder="请输或空格入关键词" :remote-method="remoteMethod" :loading="loading">
                    <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.name" />
                  </el-select>
          </el-form-item>
          </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  type="primary" @click="selectPerson">选择</el-button>
          <el-button @click="personV = false">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>


<script>
import { notify } from "@/commons/utils/notify";
import {generateSmgContent,
  getCurrentRecipients,
  getSentSmgRecords,
} from "@/commons/api/water";
import water from "@/commons/api/water"
import dutyPerson from '@/commons/api/dutyPerson'
import {getPersonOptions} from '@/commons/api/dutyPerson'
import { rules } from "@/commons/utils/validate";
import TipTitle from "@/components/TipTitle";
import { mapGetters } from "vuex";
import {format} from '@/commons/utils'
export default {
  components: {
    TipTitle
  },
  props: {
    value: {},
    defaultValue: {
      type: Object
    },
    id: {
      type: String,
      default: ""
    },
    code: {
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
        batchDate: "",
        batchCode: "",
        smgContent: "",
        sendName: "",
        sendTime: "",
        recipients: ""
      },
      personTemp:{
        recipients:""
      },
      rules: {
       
      },
      visibled: false,
      personV:false,
      personMap:{},
      personOptions:[],
      loading:false
    };
  },
  watch: {
    value(newValue, oldValue) {
      this.visibled = newValue;
      if(newValue){
        if (this.id && this.id !== null && this.id !== "") {
          generateSmgContent({batchCode:this.code}).then(res => {
            if(res.data){
            this.temp = res.data;
            }
            this.temp.sendName=this.name
            this.temp.sendTime=format(new Date(),'yyyy-MM-dd')
          });
        } else {
          this.temp = {
          batchDate: "",
          batchCode: "",
          smgContent: "",
          sendName: "",
          sendTime: "",
          recipients: ""
        };
        }
      }
    },
    visibled(val) {
      this.$emit("input", val);
    },
    id(newValue, oldValue) {
      // if (newValue && newValue !== null && newValue !== "") {
      //   generateSmgContent({batchId:newValue}).then(res => {
      //     this.temp = res.data;
      //   });
      // } else {
      //   this.temp = {
      //   batchDate: "",
      //   batchCode: "",
      //   smgContent: "",
      //   sendName: "",
      //   sendTime: "",
      //   recipients: ""
      // };
      // }
    },
    defaultValue(newValue,oldValue){
      if(newValue&&newValue.batchId){
        this.temp=newValue
      }
    }
  },
  created() {},
  updated() {
    this.visibled = this.value;
    // if (this.id !== "") {
    //   console.log("id", this.id);
    //   getDutyLog(this.id).then(res => {
    //     this.temp = res.data;
    //   });
    // }
  },
  computed: {
    ...mapGetters([ "name"])
  },
  methods: {
    onClose() {
      
    },
    personSelect(){
      this.personV=true
    },
    lastSelect(){
        getCurrentRecipients({batchId:this.id}).then(res=>{
          if(res.code==0){
            this.temp.recipients=res.data.recipients
          }else{
            this.$notifyNative(this,res.msg,'error')
          }
        })
    },
    //远程查找
    remoteMethod(query) {
      if (query && query !== "") {
        this.loading = true;
        let data
        if(query===" "){
          data={isSmgRec:"1"}
        }else{
          data={isSmgRec:"1", name: query }
        }
        dutyPerson.getSmgRecPersons(data).then(res => {
          if (res.data) {
            this.personOptions=res.data
          }
          this.loading = false;
        });
      } else {
        this.personOptions=[]
      }
    },
    sendData(){
      let that=this
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          water.sendSmg(this.temp).then(response => {
            var res = notify(this, response);
            if (res) {
              this.visibled = false;
              that.$emit("success", response);
            }
          });
          this.$nextTick(() => {
            this.$refs["dataForm"].clearValidate(); //清除校验
          });
        }
      });
    },
    selectPerson(){
      if(this.temp.recipients){
        this.temp.recipients=this.temp.recipients+","+ this.personTemp.recipients.join(',')
      }else{
        this.temp.recipients=this.personTemp.recipients.join(',')
      }
      this.personV=false
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
        margin-top: 1rem;
    }
  
</style>
