<template>
    <div>
        <el-dialog title="" :visible.sync="visibled" @close="onClose"  width="40%"  top="4vh">
            <div style="margin:0rem 1rem;">
                <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="120px" label-position="center">
                    <tip-title title="站点详情">

                        <el-table v-loading="listLoading" :key="tableKey" height="550" :data="list" border fit highlight-current-row  style="width: 100%;">
                            <el-table-column label="月" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.dates.split('-')[1]}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="日" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.dates.split('-')[2]}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="时" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.times}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="上游水位" align="center">
                                <el-table-column label="(米)" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.upstreamLever}}</span>
                                </template>
                                </el-table-column>
                            </el-table-column>

                            <el-table-column label="下游水位" align="center">
                                <el-table-column label="(米)" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.downstreamLever}}</span>
                                </template>
                                </el-table-column>
                            </el-table-column>

                            <el-table-column label="下泄流量" align="center">
                                <el-table-column label="(立方米/秒)" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.dischargeQuantity}}</span>
                                </template>
                                </el-table-column>
                            </el-table-column>

                        </el-table>
                   
                    </tip-title>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="visibled = false">关闭</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import TipTitle from "@/components/TipTitle";
import water from '@/commons/api/water'
export default {
    components: {
    TipTitle
  },
  props: {
    value: {},
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
        this.listQuery.id=newValue
        this.listLoading=true

        water.getSTDetail(this.listQuery).then(res=>{
            if(res.code===0){
                this.list=res.data
            }else{
                this.$message.error(res.msg)
            }
            this.listLoading=false
        })
      } else {

      }
    }
  },
  data() {
    return {
      listLoading: false,
      tableKey: "water",
      visibled:false,
      temp:{

      },
      list:[],
      total:0,
      listQuery:{
          page:1,
          pageSize:10,
          id:""
      },
      rules:{}
    };
  },
  methods:{
      handleClick(tab,event){

      },
      onClose(){}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.dialog-footer{
        margin-top: 1rem;
    }
</style>

