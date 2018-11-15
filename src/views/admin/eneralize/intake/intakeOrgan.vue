<template>
  <div class="app-container intake-organ">
    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="区域">
          <el-input v-model="listQuery.areaName" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="取水单位">
          <el-input v-model="listQuery.organName" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </el-form>
    </div>

    <!--表格数据-->
    <div class="data-container">
      <el-table v-loading="listLoading" :key="tableKey" height="550" :data="list" border fit highlight-current-row style="width: 100%;">

        <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
        </el-table-column>

        <el-table-column label="取水单位编码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>

        <el-table-column label="取水单位名称" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.organName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="行政区划名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.areaName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位负责人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.person }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位联系电话" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位地址" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批准年取水量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.yearIntake }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最大取水量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.maxIntake }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.actions')" align="center" width="130" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <!--分页控件-->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!--添加/编辑弹窗-->
    <div class="form-container">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form width="60%" ref="dataForm" :rules="rules" :model="temp" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="取水单位编码" prop="code">
                <el-input v-model="temp.code" clearable />
              </el-form-item>
              <el-form-item label="行政区划名称" prop="areaName">
                <el-input v-model="temp.areaName" clearable />
              </el-form-item>
              <el-form-item label="单位联系电话" prop="phone">
                <el-input v-model="temp.phone" clearable />
              </el-form-item>
              <el-form-item label="最大取水量" prop="maxIntake">
                <el-input v-model="temp.maxIntake" clearable />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="temp.remark" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="取水单位名称" prop="organName">
                <el-input v-model="temp.organName" clearable />
              </el-form-item>
              <el-form-item label="单位负责人" prop="person">
                <el-input v-model="temp.person" clearable />
              </el-form-item>
              <el-form-item label="单位地址" prop="address">
                <el-input v-model="temp.address" clearable />
              </el-form-item>
              <el-form-item label="批准年取水量" prop="yearIntake">
                <el-input v-model="temp.yearIntake" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
          <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
          <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import { getOrganList, updateOrgan } from "@/commons/api/eneralize";

import { notify } from "@/commons/utils/notify";
import { intakeOrganRules } from "@/commons/utils/validate";

export default {
  data() {
    return {
      //=====筛选条件相关=====
      //筛选条件
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },

      //=====表格数据相关=====
      tableKey: 0,
      //表数据
      list: null,
      //记录总条数
      total: null,
      //数据加载标识
      listLoading: true,
      //列表选中列
      sels: [],

      //=====添加/编辑弹窗相关=====
      //表单对话框可见状态
      dialogFormVisible: false,
      //对话框状态（编辑还是添加）
      dialogStatus: "",
      //编辑框标题名称
      textMap: {
        update: "编辑",
        create: "添加"
      },
      //表单对话框临时数据
      temp: {},
      // 编辑窗口表单验证规则
      rules: intakeOrganRules
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  mounted() {
    this.getList(); //获取表数据
  },

  methods: {
    //获取取水单位参数备选值
    // getOrganListOptions() {
    //   getOrganStatusList().then(response => {
    //     this.organOptions = response.data;
    //   });
    // },

    //重置按钮操作
    handleReset() {
      this.listQuery.pageNum = 1; //前往到第一页
      this.listQuery.organName = "";
      this.listQuery.areaName = "";
    },
    //搜索按钮操作
    handleFilter() {
      this.listQuery.pageNum = 1; //前往到第一页
      this.getList(); //刷新表格数据
    },

    //=====表格数据相关=====

    //获取表数据
    getList() {
      this.listLoading = true; //显示加载标识
      getOrganList(this.listQuery).then(response => {
        //通知
        var res = notify(this, response, true);
        if (res) {
          this.list = response.data.list;
          this.total = response.data.total;
        }
        this.listLoading = false;
      });
    },

    //编辑按钮操作
    handleUpdate(row) {
      //this.getOrganListOptions();
      this.temp = Object.assign({}, row); //初始化表单
      this.dialogStatus = "update"; //对话框状态为编辑
      this.dialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); //清除校验
      });
    },

    //=====分页相关=====

    //控制每页显示条数
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    //跳转页码
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    //=====表单对话框相关=====

    //重置表单项
    resetTemp() {
      this.temp = {
        biased: "",
        intake: "",
        license: "",
        organId: "",
        plan: "",
        remark: "",
        time: ""
      };
    },

    //更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateOrgan(this.temp).then(response => {
            var res = notify(this, response);
            if (res) {
              this.dialogFormVisible = false;
              this.getList();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.intake-organ {
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

  .st1 {
    font-family: Arial;
    font-size: 5pt;
  }

  /* 设置弹窗宽度 */
  .el-dialog {
    // width: 30%;
  }

  /* 设置表单项宽度 */
  .form-container {
    .el-form-item__content {
      width: 300px;
      .el-input {
        width: 300px;
      }
    }
  }
}
</style>