<template>
  <div class="app-container scheduling">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="年份">
          <el-date-picker v-model="changeYear" type="year" placeholder="选择年" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="调度方案编号" v-show="showPlanSelect">
          <el-select v-model="listQuery.code" clearable placeholder="全部">
            <el-option v-for="item in planTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="编制人">
          <el-input v-model="listQuery.name" clearable @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </el-form>
    </div>

    <div class="data-container">
      <el-table v-loading="listLoading" height="550" :data="list" border fit highlight-current-row style="width: 100%;">
        <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
        </el-table-column>
        <el-table-column label="编制年份" align="center" prop="year">
          <!-- <template slot-scope="scope"> 
            <span>{{ scope.row.year }}</span>
          </template> -->
        </el-table-column>

        <el-table-column label="编制编号" align="center" prop="code">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template> -->
        </el-table-column>

        <el-table-column label="方案类型" align="center" prop="type">
          <!-- <template slot-scope="type">
            <span>{{ scope.row.type }}</span>
          </template> -->
        </el-table-column>

        <el-table-column label="创建人" align="center" prop="name">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template> -->
        </el-table-column>

        <el-table-column label="创建时间" align="center" prop="time">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template> -->
        </el-table-column>

        <el-table-column :label="$t('table.actions')" align="center" width="330" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="normal" size="small" @click="handleInit(scope.row)" :disabled="scope.row.type==='汛期调度方案'">新方案</el-button>
            <el-button type="normal" size="small" @click="handleHistory(scope.row)" :disabled="scope.row.type==='汛期调度方案'||!scope.row.num">历史方案</el-button>
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
import scheduling from "@/commons/api/scheduling";
import api from "@/commons/api/";

import { schedulingRules } from "@/commons/utils/validate";

export default {
  data() {
    return {
      // =====筛选条件相关=====
      // 筛选条件
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        year: ""
      },

      changeYear: "",
      // 重置筛选条件
      resetListQuery: {
        pageNum: 1,
        code: "",
        name: "",
        year: ""
      },

      planTypeOptions: {},

      // =====表格数据相关=====
      // tableKey: 0,
      // 表数据
      list: null,
      // 记录总条数
      total: null,
      // 数据加载标识
      listLoading: true,

      // =====添加/编辑弹窗相关=====
      // 表单对话框可见状态
      dialogFormVisible: false,

      // 对话框状态（编辑还是添加）
      dialogStatus: "",
      // 操作类型（过程或者总结）

      textMap: {
        update: "编辑应急事件",
        create: "添加应急事件",
        view: "预览应急事件"
      },
      // 表单对话框临时数据
      temp: {},
      // 编辑窗口表单验证规则
      rules: schedulingRules
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created: function() {
    this.getList(); //获取表数据
  },
  mounted: function() {
    //this.$router.push({ path: "/xx/12" });
  },

  computed: {
    // changeYear: function() {
    //   return this.listQuery.year;
    // },

    showPlanSelect: function() {
      if (this.changeYear) {
        return true;
      } else {
        return false;
      }
    }
  },

  watch: {
    changeYear: {
      handler(newName, oldName) {
        if (newName) {
          this.listQuery.year = newName;
          this.getPlanTypeOptions(newName);
        } else {
          this.listQuery.year = "";
        }
      },
      immediate: true
    }
  },

  methods: {
    // =====筛选条件相关=====
    // 重置按钮操作
    handleReset: function() {
      api.handleReset(this);
      this.changeYear = ""
    },

    // 搜索按钮操作
    handleFilter: function() {
      this.listQuery.pageNum = 1; //前往到第一页
      this.getList(); //刷新表格数据
    },

    //获取调度方案类型备选值
    getPlanTypeOptions(year) {
      if (year) {
        var info = {
          time: year
        };
        scheduling.getSchedulingPlanList(info).then(response => {
          this.planTypeOptions = response.data;
        });
      }
    },

    //=====表格数据相关=====
    //获取表数据
    getList: function() {
      api.getList(this, scheduling, "getSchedulingPlanPage");
    },

    //编辑按钮操作
    handleUpdate: function(row) {
      api.handleUpdate(this, row, "", true);
    },

    //判断是否为当前用户
    isCurrentUser: function(name) {
      return name === getName();
    },

    //=====分页相关=====
    //控制每页显示条数
    handleSizeChange: function(val) {
      api.handleSizeChange(this, val);
    },
    //跳转页码
    handleCurrentChange: function(val) {
      api.handleCurrentChange(this, val);
    },

    //生成调度计划
    handleInit: function(row) {
      this.$router.push({
        path: `/scheduling/LowWaterTemplate/${row.code}/${row.year}`
      });
    },

    //历史记录
    handleHistory: function(row) {
      this.$router.push({
        path: `/scheduling/LowWaterTemplate/History/${row.code}/${row.year}`
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.scheduling {
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
}
</style>