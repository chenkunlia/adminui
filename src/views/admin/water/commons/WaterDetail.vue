<template>
    <div>
        <el-dialog title="" :visible.sync="visibled" @close="onClose" width="60%" top="4vh">
            <div style="margin:0rem 1rem;">
                <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="120px" label-position="center">
                    <tip-title title="一、基础信息">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="批次日期：" prop="batchTime">
                                     <el-date-picker type="date" placeholder="选择时间" format="yyyy-MM-dd" v-model="temp.batchTime" style="width: 100%;" disabled></el-date-picker>
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
                                <el-form-item prop="updateName" label="修改人：">
                                    <el-input v-model="temp.updateName" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="updateTime" label=修改时间：>
                                    <el-date-picker type="date" placeholder="选择时间" format="yyyy.MM.dd HH:mm" v-model="temp.updateTime" style="width: 100%;" disabled></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </tip-title>
                    <tip-title title="二、报送信息">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="水库水情" name="rv">
                        <div class="filter-container-detail" v-if="activeName=='rv'">
                        <el-button  type="primary" @click.native="editAll">{{editFlag?'保存所有':'编辑所有'}}</el-button>
                        </div>
                        <el-table v-loading="listLoading" ref="rv-table" :key="tableKey" height="450" :data="rvList" border fit highlight-current-row  style="width: 100%;">
                            <el-table-column label="来源" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.dataSource}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="站名" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.stationName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="河名" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.riverName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="水位(m)" align="center">
                                <template slot-scope="scope">
                                    <el-input v-if="scope.row.editFlag" v-model="scope.row.waterLevel" @keyup.native="changeValue(scope.row,'waterLevel')"></el-input>
                                    <span v-else>
                                    <span v-if="scope.row.waterLevelFlag" style="color:red;">{{scope.row.waterLevel}}</span>
                                    <span v-else>{{scope.row.waterLevel}}</span>
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column label="蓄水量(百万m³)" align="center">
                                <template slot-scope="scope">
                                    <el-input v-if="scope.row.editFlag" v-model="scope.row.storageQuantity" @keyup.native="changeValue(scope.row,'storageQuantity')"></el-input>
                                    <span v-else>
                                    <span v-if="scope.row.storageQuantityFlag" style="color:red;">{{scope.row.storageQuantity}}</span>
                                    <span v-else>{{scope.row.storageQuantity}}</span>
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column label="入库流量(m³/s)" align="center">
                                <template slot-scope="scope">
                                    <el-input v-if="scope.row.editFlag" v-model="scope.row.inQuantity" @keyup.native="changeValue(scope.row,'inQuantity')"></el-input>
                                    <span v-else>
                                    <span v-if="scope.row.inQuantityFlag" style="color:red;">{{scope.row.inQuantity}}</span>
                                     <span v-else>{{scope.row.inQuantity}}</span>
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column label="出库流量(m³/s)" align="center">
                                <template slot-scope="scope">
                                    <el-input v-if="scope.row.editFlag" v-model="scope.row.outQuantity" @keyup.native="changeValue(scope.row,'outQuantity')"></el-input>
                                    <span v-else>
                                    <span v-if="scope.row.outQuantityFlag" style="color:red;">{{scope.row.outQuantity}}</span>
                                    <span v-else>{{scope.row.outQuantity}}</span>
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column label="日雨量(mm)" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.rainfallQuantity}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button type='text' v-if="scope.row.waterLevelFlag||scope.row.storageQuantityFlag||scope.row.inQuantityFlag||scope.row.outQuantityFlag"
                                     @click="editRvDetail(scope.row,scope.$index)">{{scope.row.editFlag?'保存':'编辑'}}</el-button>
                                    <el-button type='text' v-if="scope.row.dataSource==='测站上传'" @click="rvDetail(scope.row)">明细</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="站点水情" name="st">
                        <el-table v-loading="listLoading" ref="st-table" :key="tableKey" height="450" :data="stList" border fit highlight-current-row style="width: 100%;">
                            <el-table-column label="来源" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.dataSource}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="站名" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.stationName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="河名" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.riverName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="水位(m)" align="center">
                                <template slot-scope="scope">
                                    <span  >{{scope.row.waterLevel}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="流量(m³/s)" align="center">
                                <template slot-scope="scope">
                                     <span>{{scope.row.quantity}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="涨势" align="center">
                                <template slot-scope="scope">
                                     <span  :style="'color:'+trendColor[scope.row.trend]+';'">{{scope.row.trend}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="日均流量(m³/s)" align="center">
                                <template slot-scope="scope">
                                     <span>{{scope.row.dailyAvgQuantity}}</span>
                                </template>
                            </el-table-column>


                            <el-table-column label="警戒水位(m)" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.warningLevel}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button type='text' v-if="scope.row.dataSource==='测站上传'" @click="stDetail(scope.row)">明细</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
                    </tip-title>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="saveData">提交</el-button>
                    <el-button @click="visibled = false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <rv-detail v-model="rvVisible" :id="rowId"></rv-detail>
        <st-detail v-model="stVisible" :id="rowId"></st-detail>
        
    </div>
</template>

<script>
import TipTitle from "@/components/TipTitle";

import {getStattionList,getReservoirList,getReservoirStationDetail} from '@/commons/api/water'
import water from '@/commons/api/water'
import RvDetail from './RvDetail'
import StDetail from './StDetail'
import qs from 'querystring'
export default {
    components: {
    TipTitle,RvDetail,StDetail
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
      if(newValue){
          let id=this.id
          if (id && id !== null && id !== "") {
        this.rvlistQuery.id=id
        this.stlistQuery.id=id
        this.listLoading=true
        getStattionList(this.stlistQuery).then(res=>{
            if(res.code===0){
                this.stList=res.data.list
            }else{
                this.$message.error(res.msg)
            }
            this.listLoading=false
        })
        getReservoirList(this.rvlistQuery).then(res=>{
            if(res.code===0){
                this.rvList=res.data.list
                this.handleData(this.rvList)
            }else{
                this.$message.error(res.msg)
            }
            this.listLoading=false
        })
      } else {

      }
      }
    },
    visibled(val) {
      this.$emit("input", val);
    },
    id(newValue, oldValue) {
      
    },
    defaultValue(newValue,oldValue){
        this.temp=newValue
    }
  },
  data() {
    return {
      listLoading: false,
      tableKey: "water",
      activeName: "rv",
      visibled:false,
      temp:{

      },
      trendColor:{'涨':'red','平':'green','降':'purple','落':'purple','-':'black'},
      rvList:[],
      rvTotal:0,
      stList:[],
      stTotal:0,
      rvlistQuery:{
          pageNum:1,
          pageSize:10,
          id:""
      },
      stlistQuery:{
          pageNum:1,
          pageSize:10,
          id:""
      },
      editFlag:false,
      editAllFlag:false,
      rvVisible:false,
      stVisible:false,
      rowId:'',
      rules:{},
      reg1:/[^\d.]/g,
      reg2:/^(\-)*(\d+)\.(\d\d\d).*$/
    };
  },
  methods:{
      handleClick(tab,event){

      },
      changeValue(row,key){
          row[key]=row[key].replace(this.reg1, "").replace(this.reg2, "$1$2.$3")
      },
      rvDetail(row){
          this.rowId=row.waterId
          this.rvVisible=true
      },
      //查看水库详细
      stDetail(row){
          this.rowId=row.waterId
          this.stVisible=true
      },
      editAll(){
          console.log('editAll')
          
          if(this.editFlag){
              this.editFlag=false
              this.rvList.map(item=>{
                if(item.updateFlag){
                    item.editFlag=false
                }
              })
              this.handleData(this.rvList)
          }else{
              this.rvList.map(item=>{
                if(item.updateFlag){
                    item.editFlag=true
                }
              })
              this.editFlag=true
          }
          this.flushList()
          
      },
      //刷新表格
    flushList(){
    this.listLoading=true
    let _this=this
    setTimeout(()=>{_this.listLoading=false},200)
    if(this.rvList[0]){
              this.$refs['rv-table'].setCurrentRow(this.rvList[0])
     }
     setTimeout(()=>{
         if(this.rvList[1]){
              _this.$refs['rv-table'].setCurrentRow(_this.rvList[1])
     }
     },200)
    },
      onClose(){
          this.editFlag=false
          this.editAllFlag=false
      },
      handleData(list){
          console.log('handleData')
          for(var i=0;i<list.length-1;){
              let row1=list[i]
              let row2=list[i+1]
              if(row1.stationName===row2.stationName){
                  if(Number(row1.inQuantity)!==Number(row2.inQuantity)){
                      row1.inQuantityFlag=true
                      row2.inQuantityFlag=true
                  }else{
                      row1.inQuantityFlag=false
                      row2.inQuantityFlag=false
                  }
                  if(Number(row1.outQuantity)!==Number(row2.outQuantity)){
                      row1.outQuantityFlag=true
                      row2.outQuantityFlag=true
                  }else{
                      row1.outQuantityFlag=false
                      row2.outQuantityFlag=false
                  }
                  if(Number(row1.storageQuantity)!==Number(row2.storageQuantity)){
                      row1.storageQuantityFlag=true
                      row2.storageQuantityFlag=true
                  }else{
                      row1.storageQuantityFlag=false
                      row2.storageQuantityFlag=false
                  }
                  if(Number(row1.waterLevel)!==Number(row2.waterLevel)){
                      row1.waterLevelFlag=true
                      row2.waterLevelFlag=true
                  }else{
                      row1.waterLevelFlag=false
                      row2.waterLevelFlag=false
                  }
                  if(row1.inQuantityFlag||row1.outQuantityFlag||row1.waterLevelFlag||row1.storageQuantityFlag){
                      row1.updateFlag=true
                      row2.updateFlag=true
                  }
                  i+=2
              }else{
                  i++
              }
          }
      },
      editRvDetail(row,index){
          console.log("editRvDetail")
          let cur=index>1?index-1:index+1
          let r=this.rvList[cur]?this.rvList[cur]:{}
          if(row.editFlag){
              row.editFlag=false
              row.saveFlag=true
              this.handleData(this.rvList)
          }else{
              row.editFlag=true
          }
          this.$refs['rv-table'].setCurrentRow(r)
          this.flushList()
          console.log("editFlag",row.editFlag)
      },
      saveData(){
          let that=this
          let data=[]
          this.rvList.map(item=>{
              if(item.updateFlag){
                  let t={}
                  t.waterId=item.waterId
                  t.stationName=item.stationName
                  t.dataSource=item.dataSource
                  t.inQuantity=item.inQuantity
                  t.outQuantity=item.outQuantity
                  t.storageQuantity=item.storageQuantity
                  t.waterLevel=item.waterLevel
                  data.push(t)
              }
          })
          if(data.length>0){
              water.updateReservoirDetail({list:data}).then(res=>{
                  if(res.code==0){
                      this.$notify({
                        title: '成功',
                        message: res.msg,
                        type: 'success',
                        duration:2*1000
                        });
                        this.visibled=false
                        that.$emit('success',res)
                  }else{
                      this.$notify({
                        title: '失败',
                        message: res.msg,
                        type: 'error',
                        duration:2*1000
                        });
                  }
              })
          }
      }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
    .dialog-footer{
        margin-top: 1rem;
    }
  .filter-container-detail {
  margin-top: 1px;
  margin-bottom: 7px;
  text-align: left;
}
</style>

