<template>
    <div>
        <el-dialog title="" :visible.sync="visibled" @close="onClose" width="50%"  top="4vh">
            <div style="margin:0rem 1rem;">
                <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="120px" label-position="center">
                    <tip-title title="一、记录列表">
                        <el-table v-loading="listLoading" :key="tableKey" height="350" :data="list" border fit highlight-current-row  @current-change="handleCurrentChange"  style="width: 100%;">
                            <el-table-column :label="$t('table.id')" align="center" width="65" type="index"></el-table-column>
                            <el-table-column label="批次号" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.batchCode}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="报送人" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.sendName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="状态" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.status}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="报送时间" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.sendTime}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button type='text' v-if="scope.row.status==='异常'" @click="reSend(scope.row)">重新报送</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </tip-title>
                    <tip-title title="二、报送记录">
                        <el-form-item label="短信内容：" prop="smgContent">
                            <el-input type="textarea" autosize v-model="temp.smgContent"></el-input>
                        </el-form-item>
                        <el-form-item label="接收人：" prop="recipients">
                            <el-input type="textarea" autosize v-model="temp.recipients"></el-input>
                        </el-form-item>
                        <el-form-item label="状态信息：" prop="statusInfo">
                            <el-input type="textarea" autosize v-model="temp.statusInfo"></el-input>
                        </el-form-item>
                    </tip-title>
                    
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="visibled = false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <message-send :defaultValue="row" v-model="msgV"></message-send>
    </div>
</template>

<script>
import TipTitle from "@/components/TipTitle";
import MessageSend from './MessageSend'
import water from '@/commons/api/water'
export default {
    components: {
    TipTitle,MessageSend
  },
  props: {
    value: {},
    defaultValue:{
        type:Object
    },
    id: {
      type: String,
      default: ""
    },
  },
  watch: {
    value(newValue, oldValue) {
      this.visibled = newValue;
    },
    visibled(val) {
      this.$emit("input", val);
    },
    id(newValue, oldValue) {
      if (newValue && newValue !== null && newValue !== "") {
        this.listQuery.batchId=newValue
        this.listLoading=true
        water.getSentSmgRecords(this.listQuery).then(res=>{
            if(res.code===0){
                this.list=res.data
            }else{
                // this.$message.error(res.msg)
            }
            this.listLoading=false
        })
      } else {

      }
    },
  },
  data() {
    return {
      listLoading: false,
      tableKey: "water",
      visibled:false,
      temp:{
          batchDate: "",
          batchCode: "",
          smgContent: "",
          sendName: "",
          sendTime: "",
          recipients: ""
      },
      list:[],
      total:0,
      listQuery:{
          page:1,
          pageSize:10,
          batchId:""
      },
      rowId:'',
      rules:{},
      row:{},
      msgV:false
    };
  },
  methods:{
      handleClick(tab,event){

      },
      reSend(row){
          this.row=row
          this.msgV=true
      },
      handleCurrentChange(row){
          if(row){
              this.temp=row
          }
      },
      onClose(){
          this.list=[]
          this.temp={
          batchDate: "",
          batchCode: "",
          smgContent: "",
          sendName: "",
          sendTime: "",
          recipients: ""
          }
      }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
        .dialog-footer{
            margin-top :1rem;
        }
</style>
