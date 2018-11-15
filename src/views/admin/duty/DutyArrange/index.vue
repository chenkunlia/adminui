<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">

        <el-form-item label="日期">
          <el-date-picker v-model="listQuery.dutyDate" clearable type="date" placeholder="开始日期">
          </el-date-picker>
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </el-form>

    </div>
    <!--工具栏-->
    <div class="operate-container">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">值班安排</el-button>
    </div>

    <div class="data-container">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="水量调度值班" name="water">

          <el-table v-loading="listLoading" :key="tableKey" height="550" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
            </el-table-column>
            <el-table-column label="值班类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.typeMsg}}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始日期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.beginTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="结束日期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.endTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建人" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.creator }}</span>
              </template>
            </el-table-column>

            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.note }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showArrange(scope.row)">浏览</el-button>
                <el-button type="warning" size="mini" @click="updateArrange(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" v-if="scope.$index===0" @click="deleteArrange(scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
        <el-tab-pane label="三防值班" name="defense">

          <el-table v-loading="listLoading" :key="tableKey" height="550" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
            </el-table-column>
            <el-table-column label="值班类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.typeMsg}}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始日期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.beginTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="结束日期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.endTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建人" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.creator }}</span>
              </template>
            </el-table-column>

            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.note }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showArrange(scope.row)">浏览</el-button>
                <el-button type="warning" size="mini" @click="updateArrange(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" v-if="scope.$index===0" @click="deleteArrange(scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
        <el-tab-pane label="单位节假日值班" name="holiday">

          <el-table v-loading="listLoading" :key="tableKey" height="550" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
            <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
            <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
            </el-table-column>
            <el-table-column label="值班类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.typeMsg}}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始日期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.beginTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="结束日期" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.endTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建人" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.creator }}</span>
              </template>
            </el-table-column>

            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.note }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showArrange(scope.row)">浏览</el-button>
                <el-button type="warning" size="mini" @click="updateArrange(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" v-if="scope.$index===0" @click="deleteArrange(scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <duty-arrange-detail v-model='dVisible' :id="rowId" @success="success" :dutyType="activeName" :lastDate="lastDate" :dialogStatus="dialog"></duty-arrange-detail>
  </div>
</template>

<script>
import {
  getDutyArrangeList,
  deleteDuty,
  addWaterDuty,
  addHolidayDuty,
  addDefenseDuty
} from "@/commons/api/duty";
import { parseTime,format } from "@/commons/utils";
import DutyArrangeDetail from "../commons/DutyArrangeDetail";
export default {
  name: "DutyList",
  components: {
    DutyArrangeDetail
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
        type: 1,
        dutyDate: undefined,
        page: 1,
        size: 10
      },

      dVisible: false,
      dUrl: "",
      activeName: "water",
      selectedRows: [],
      rowId: "",
      dialog:'create',
      lastDate:''
    };
  },

  //周期函数，创建时获取数据列表
  created() {
    this.getList();
  },
  methods: {
    //获取数据列表
    getList() {
      //记载标识
      this.listLoading = true;
      //调用fetchList获取数据

      if (this.listQuery.dutyDate) {
        this.listQuery.dutyDate = format(
          this.listQuery.dutyDate,
          "yyyy-MM-dd"
        );
      }
      if (this.activeName === "defense") {
        this.listQuery.type = 2;
      } else if (this.activeName === "water") {
        this.listQuery.type = 1;
      } else {
        this.listQuery.type = 3;
      }
      getDutyArrangeList(this.listQuery).then(response => {
        try {
          this.list = response.data.list;
          this.total = response.data.total;
          this.listLoading = false;
        } catch (e) {
          console.log(e);
        }
      });
      setTimeout(() => {
        this.listLoading = false;
      }, 1.5 * 1000);
    },

    //条件查询
    handleFilter() {
      //前往到第一页
      this.listQuery.page = 1;
      this.getList();
    },

    success(){
      this.getList()
    },
    //重置
    handleReset() {
      //前往到第一页
      this.listQuery.page = 1;
      this.listQuery.type = 1;
      this.listQuery.dutyDate = undefined;
      this.getList();
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
      this.selectedRows = sels;
    },

    handleTabClick(tab, ent) {
      this.getList();
    },
    deleteArrange(row) {
      this.$confirm("确认删除此条记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteUserInfo = { id: row.id, type: row.type };
          deleteDuty(deleteUserInfo).then(res => {
            if (res.code == -2) {
              this.$notify.error({
                title: "删除失败",
                message: res.msg,
                duration: 2 * 1000
              });
            }else{
              this.$notify.info({
                title: "删除成功",
                message: res.msg,
                duration: 2 * 1000
              });
            }
            this.getList();
          });
        })
        .catch(() => {});
    },
    showArrange(row) {
      (this.dialog='show'),(this.rowId = row.id), (this.dVisible = true);
    },
    updateArrange(row) {
      (this.dialog='update'),
      (this.rowId = row.id), (this.dVisible = true);
    },
    handleCreate() {
      this.dialog='create'
      this.rowId = "";
      this.dVisible = true;
      this.lastDate=this.list[0].endTime
    },
    batchRemove() {}
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