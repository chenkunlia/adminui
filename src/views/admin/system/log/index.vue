<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="操作">
          <el-select v-model="listQuery.operationType" clearable style="width: 200px" class="filter-item">
            <el-option v-for="(val, key) in operationTypeOptions" :key="val" :label="key" :value="val" />
          </el-select>
        </el-form-item>

        <el-form-item label="操作人">
          <el-input v-model="listQuery.operationUser" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>

        <el-form-item label="模块">
          <el-select v-model="listQuery.operationModule" clearable class="filter-item" style="width: 200px">
            <el-option v-for="(val, key) in moduleTypeOptions" :key="key" :label="val" :value="key" />
          </el-select>
        </el-form-item>

        <el-form-item label="操作时间">
          <el-date-picker v-model="listQuery.operationTime" clearable type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </el-form>

    </div>

    <div class="data-container">
      <el-table v-loading="listLoading" height="550" :key="tableKey" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.actionType }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="模块" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.module }}</span>
          </template>
        </el-table-column>

        <el-table-column label="请求地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {
  getLogList,
  getModuleListSelect,
  getTypeListSelect
} from "@/commons/api/system";

import { parseTime } from "@/commons/utils";

export default {
  name: "Log",

  //数据部分
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,

      // 参数默认值
      listQuery: {
        operationModule: undefined,
        operationUser: "",
        operationType: undefined,
        operationTime: "",
        pageNum: 1,
        pageSize: 10
      },

      //操作类型备选值
      operationTypeOptions: {},

      //模块类型备选值
      moduleTypeOptions: {}
    };
  },

  //周期函数，创建时获取数据列表
  created() {
    this.getList();
    this.getModuleList();
    this.getTypeList();
  },
  methods: {
    //获取数据列表
    getList() {
      //记载标识
      this.listLoading = true;
      //调用fetchList获取数据

      if (this.listQuery.operationTime) {
        this.listQuery.operationTime = parseTime(
          this.listQuery.operationTime,
          "{y}-{m}-{d}"
        );
      }

      getLogList(this.listQuery).then(response => {
        try {
          console.log("打印时间" + this.listQuery.operationTime.toString());

          this.list = response.data.list;
          this.total = response.data.total;
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000);
        } catch (e) {
          console.log(e);
        }
      });
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
      this.listQuery.operationModule = undefined;
      this.listQuery.operationUser = "";
      this.listQuery.operationType = undefined;
      this.listQuery.operationTime = "";
      this.getList();
    },

    //显示每页条数
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },

    //跳转页码
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
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