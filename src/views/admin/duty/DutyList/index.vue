<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">

        <el-form-item label="值班人员">
          <el-input v-model="listQuery.name" placeholder="人员名称" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>

        <el-form-item label="开始日期">
          <el-date-picker v-model="listQuery.beginTime" clearable type="date" placeholder="开始日期" :picker-options="beginTimeOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="listQuery.endTime" clearable type="date" placeholder="结束日期" :picker-options="endTimeOptions">
          </el-date-picker>
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="el-icon-news" @click="todayRow">今天</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </el-form>

    </div>

    <div class="data-container">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="水量调度值班" name="water">

          <el-table v-loading="listLoading" ref="tableWater" :key="tableKey" height="550" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
            <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
            </el-table-column>
            <el-table-column label="开始日期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.beginTimeMsg }}</span>
              </template>
            </el-table-column>

            <el-table-column label="值班总负责" align="center">
              <template slot-scope="scope">
                 <el-button v-for="(val, key) in scope.row.mainLeaderMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="值班负责人" align="center">
              <template slot-scope="scope">
                <el-button v-for="(val, key) in scope.row.viceLeaderMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="主班" align="center">
              <template slot-scope="scope">
               <el-button v-for="(val, key) in scope.row.mainDutyMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <!-- <el-table-column label="副班" align="center">
              <template slot-scope="scope">
               <el-button v-for="(val, key) in scope.row.viceDutyMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column> -->

            <el-table-column label="运维人员" align="center">
              <template slot-scope="scope">
                <el-button v-for="(val, key) in scope.row.operationMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.note }}</span>
              </template>
            </el-table-column>

            <!-- <el-table-column label="操作" align="center">
              <template slot-scope="scope">
               <el-button type="text" @click="dutyLog(scope.row)" >{{scope.row.logId?'值班日志':'值班登记'}}</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="三防值班" name="defense">

          <el-table v-loading="listLoading" ref="tableDefense" :key="tableKey" height="550" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
            <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
            </el-table-column>
            <el-table-column label="开始日期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.beginTimeMsg }}</span>
              </template>
            </el-table-column>

            <el-table-column label="值班领导" align="center">
              <template slot-scope="scope">
                <el-button v-for="(val, key) in scope.row.mainLeaderMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="值班负责人" align="center">
              <template slot-scope="scope">
                <el-button v-for="(val, key) in scope.row.viceLeaderMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="主班" align="center">
              <template slot-scope="scope">
               <el-button v-for="(val, key) in scope.row.mainDutyMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="副班" align="center">
              <template slot-scope="scope">
                <el-button v-for="(val, key) in scope.row.viceDutyMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="司机" align="center">
              <template slot-scope="scope">
                <el-button v-for="(val, key) in scope.row.driverMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="加派人员" align="center">
              <template slot-scope="scope">
                <el-button v-for="(val, key) in scope.row.additionMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.note }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="dutyLog(scope.row)" :plain="!scope.row.logId" >{{scope.row.logId?'值班日志':'值班登记'}}</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
        <el-tab-pane label="单位节假日值班" name="holiday">

          <el-table v-loading="listLoading" ref="tableHoliday" :key="tableKey" height="550" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
            <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
            </el-table-column>
            <el-table-column label="开始日期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.beginTimeMsg }}</span>
              </template>
            </el-table-column>

            <el-table-column label="带班领导" align="center">
              <template slot-scope="scope">
                 <el-button v-for="(val, key) in scope.row.mainLeaderMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="值班科室" align="center">
              <template slot-scope="scope">
                <span >{{ scope.row.dutySectionMap |jsonJoin(',')}}</span>
              </template>
            </el-table-column>

            <el-table-column label="坐班人员" align="center">
              <template slot-scope="scope">
                <el-button v-for="(val, key) in scope.row.clerkMap" :key="key" type="text" @click="showUserDetail(key)">{{ val }}</el-button>
              </template>
            </el-table-column>

            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.note }}</span>
              </template>
            </el-table-column>

            <!-- <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="dutyLog(scope.row)" >{{scope.row.logId?'值班日志':'值班登记'}}</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <user-detail v-model='dVisible' :id="id" :disable="true" :default-value="{}"></user-detail>
    <duty-log v-model="logVisible" :id="logId" :default-value="row" @success="getList"></duty-log>
  </div>
</template>

<script>
import {
  getDefenseDutyList,
  getHolidayDutyList,
  getWaterDutyList,
  getDutyLog,
  addDutyLog,
  updateDutyLog
} from "@/commons/api/duty";
import {format} from '@/commons/utils'
import { parseTime } from "@/commons/utils";
import UserDetail from "../commons/UserDetail";
import DutyLog from "../commons/dutyLog";
export default {
  name: "DutyList",
  components: {
    UserDetail,DutyLog
  },
  //数据部分
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,

      // 参数默认值
      listQuery: {
        name: undefined,
        beginTime: undefined,
        endTime: undefined,
        page: 1,
        size: 10
      },
      
      dVisible: false,
      id: "",
      activeName: "water",
      logId:"",
      logVisible:false,
      row:{}
    };
  },

  //周期函数，创建时获取数据列表
  created() {
    this.getList();
  },
   computed:{
     beginTimeOptions(){
      let that=this
        return {
            disabledDate(time) {
             return that.listQuery.endTime!==''?time.getTime()>new Date(that.listQuery.endTime):false;
            }
          }
      },
    endTimeOptions(){
      let that=this
        return {
            disabledDate(time) {
              if(that.listQuery.beginTime){
                return time.getTime() < new Date(that.listQuery.beginTime);
              }else{
                return false;
              }
            }
          }
      },
  },
  methods: {
    //获取数据列表
    getList() {
      //记载标识
      this.listLoading = true;
      //调用fetchList获取数据
      if(this.listQuery.beginTime){
        this.listQuery.beginTime=format(this.listQuery.beginTime,'yyyy-MM-dd')
      }
      if(this.listQuery.endTime){
        this.listQuery.endTime=format(this.listQuery.endTime,'yyyy-MM-dd')
      }else{
        let date=new Date()
        date.setDate(date.getDate()+5)
        this.listQuery.endTime=format(date,'yyyy-MM-dd')
      }
      if (this.activeName === "defense") {
        getDefenseDutyList(this.listQuery).then(response => {
          try {
            this.list = response.data.list;
            this.total = response.data.total;
            this.listLoading = false;
             this.todayRow()
          } catch (e) {
            console.log(e);
          }
        });
      } else if (this.activeName === "water") {
        getWaterDutyList(this.listQuery).then(response => {
          try {
            this.list = response.data.list;
            this.total = response.data.total;
            this.listLoading = false;
             this.todayRow()
          } catch (e) {
            console.log(e);
          }
        });
      } else {
        getHolidayDutyList(this.listQuery).then(response => {
          try {
            this.list = response.data.list;
            this.total = response.data.total;
            this.listLoading = false;
            this.todayRow()
          } catch (e) {
            console.log(e);
          }
        });
      }
      setTimeout(() => {
        this.listLoading = false;
      }, 1.5 * 1000);
    },

    //获取操作类型列表
    getTypeList() {
      getTypeListSelect().then(response => {
        this.operationTypeOptions = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    //调用模块类型列表
    getModuleList() {
      getModuleListSelect(this.listQuery).then(response => {
        this.moduleTypeOptions = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    //条件查询
    handleFilter() {
      //前往到第一页
      this.listQuery.page = 1;
      this.getList();
    },

    //重置
    handleReset() {
      //前往到第一页
      this.listQuery.page = 1;
      this.listQuery.name = undefined;
      this.listQuery.beginTime = undefined;
      this.listQuery.endTime = undefined;
      this.getList();
    },
    //滚动到今天行
    todayRow(){
      let today=format(new Date(),'yyyy/MM/dd')
      let i =_.findIndex(this.list,{beginTimeMsg:today})
      if(i){
        console.log("index",i)
      }
      this.setCurrentRow(i)
    },
    //滚动到今天行
    setCurrentRow(i) {
      if(this.activeName==='water'){
        this.$refs.tableWater.setCurrentRow(this.list[i])
        const targetTop = this.$refs.tableWater.$el.querySelectorAll('.el-table__body tr')[i - 1].getBoundingClientRect().top
        const containerTop = this.$refs.tableWater.$el.querySelector('.el-table__body').getBoundingClientRect().top
        const scrollParent = this.$refs.tableWater.$el.querySelector('.el-table__body-wrapper')
        scrollParent.scrollTop = targetTop - containerTop
        this.$refs.tableWater.bodyWrapper.scrollTop =scrollParent.scrollTop;
      }else if(this.activeName==='defense'){
        this.$refs.tableDefense.setCurrentRow(this.list[i])
        const targetTop = this.$refs.tableDefense.$el.querySelectorAll('.el-table__body tr')[i - 1].getBoundingClientRect().top
        const containerTop = this.$refs.tableDefense.$el.querySelector('.el-table__body').getBoundingClientRect().top
        const scrollParent = this.$refs.tableDefense.$el.querySelector('.el-table__body-wrapper')
        scrollParent.scrollTop = targetTop - containerTop
        this.$refs.tableDefense.bodyWrapper.scrollTop =scrollParent.scrollTop;
      }else{
        this.$refs.tableHoliday.setCurrentRow(this.list[i])
        const targetTop = this.$refs.tableHoliday.$el.querySelectorAll('.el-table__body tr')[i - 1].getBoundingClientRect().top
        const containerTop = this.$refs.tableHoliday.$el.querySelector('.el-table__body').getBoundingClientRect().top
        const scrollParent = this.$refs.tableHoliday.$el.querySelector('.el-table__body-wrapper')
        scrollParent.scrollTop = targetTop - containerTop
        this.$refs.tableHoliday.bodyWrapper.scrollTop =scrollParent.scrollTop;
      }
      console.log("滚动完成")
    },

    //显示每页条数
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },

    //跳转页码
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    // 选中行
    selsChange: function(sels) {
      this.sels = sels;
    },
    //显示人员信息
    showUserDetail(id) {
      console.log("id",id)
      this.id = id;
      this.dVisible=true
    },

    dutyLog(row){
      this.logId=row.logId
      this.row=row
      this.logVisible=true
    },

    handleTabClick(tab, ent) {
      this.list = [];
      this.total = null;
      this.getList();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
//筛选面板
.filter-container {
  margin-top: 20px;
  text-align: left;
}

//操作面板
.operate-container {
  text-align: left;
}

//数据面板
.data-container {
  margin-top: 20px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>