<template>
  <div class="app-container intake-record">
    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="取水单位">
          <el-input v-model="listQuery.organName" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="取水日期">
          <el-date-picker v-model="listQuery.month" type="month" placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </el-form>
    </div>

    <!--工具栏-->
    <div class="operate-container">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">添加</el-button>
      <el-button type="danger" icon="el-icon-remove-outline" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
    </div>

    <!--表格数据-->
    <div class="data-container">
      <el-table v-loading="listLoading" :key="tableKey" height="550px" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>

        <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
        </el-table-column>

        <!-- <el-table-column label="取水记录ID" width="220" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.id }}</span>
          </template>
        </el-table-column> -->

        <el-table-column label="取水日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>

        <el-table-column label="取水单位" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="许可证取水量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.license }}</span>
          </template>
        </el-table-column>

        <el-table-column label="实际取水量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.intake }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划取水量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.plan }}</span>
          </template>
        </el-table-column>
        <el-table-column label="取水偏差量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.biased }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
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

        <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
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
        <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="120px">
          <el-form-item label="取水日期" prop="time">
            <el-date-picker v-model="temp.time" clearable type="month" placeholder="选择月">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="取水单位" prop="organId">
            <el-select v-model="temp.organId" clearable value-key="department">
              <el-option v-for="item in organOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="许可证取水量" prop="license">
            <el-input v-model="temp.license" clearable />
          </el-form-item>
          <el-form-item label="实际取水量" prop="intake">
            <el-input v-model="temp.intake" clearable />
          </el-form-item>
          <el-form-item label="计划取水量" prop="plan">
            <el-input v-model="temp.plan" clearable />
          </el-form-item>
          <el-form-item label="取水偏差量" prop="biased">
            <el-input v-model="temp.biased" clearable />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="temp.remark" clearable />
          </el-form-item>

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
import {
  getOrganStatusList,
  addRecord,
  deleteRecord,
  getRecordList,
  updateRecord
} from "@/commons/api/eneralize";

import { notify } from "@/commons/utils/notify";
import { intakeRecordRules } from "@/commons/utils/validate";
import { parseTime } from "@/commons/utils";

export default {
  data() {
    return {
      //标签页相关
      activeName: "intake",

      //=====筛选条件相关=====
      //操作类型备选值
      organOptions: {},
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
        update: "编辑取水记录",
        create: "添加取水记录"
      },
      //表单对话框临时数据
      temp: {},
      // 编辑窗口表单验证规则
      rules: intakeRecordRules
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  mounted() {
    this.getList(); //获取表数据
  },

  methods: {
    //=====筛选条件相关=====

    //获取取水单位参数备选值
    getOrganListOptions() {
      getOrganStatusList().then(response => {
        this.organOptions = response.data;
      });
    },
    //重置按钮操作
    handleReset() {
      this.listQuery.pageNum = 1; //前往到第一页
      this.listQuery.organName = "";
      this.listQuery.time = "";
      this.listQuery.month = "";
    },
    //搜索按钮操作
    handleFilter() {
      this.listQuery.pageNum = 1; //前往到第一页
      if (this.listQuery.month) {
        this.listQuery.time = parseTime(this.listQuery.month, "{y}-{m}");
      } else {
        this.listQuery.time = "";
      }
      this.getList(); //刷新表格数据
    },

    //=====工具栏相关=====

    //添加按钮操作
    handleCreate() {
      this.getOrganListOptions();
      this.resetTemp(); //重置表单项
      this.dialogStatus = "create"; //对话框状态为添加
      this.dialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); //清除校验
      });
    },
    //批量删除按钮操作
    batchRemove: function() {
      var ids = this.sels.map(item => item.id); //获取所有选中的账号
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteRecordInfo = { ids: ids };
          deleteRecord(deleteRecordInfo).then(response => {
            var res = notify(this, response);
            if (res) {
              this.getList();
            }
          });
        })
        .catch(() => {});
    },

    //=====表格数据相关=====

    //获取表数据
    getList() {
      this.listLoading = true; //显示加载标识
      getRecordList(this.listQuery).then(response => {
        //通知
        var res = notify(this, response, true);
        if (res) {
          this.list = response.data.list;
          this.total = response.data.total;
        }
        this.listLoading = false;
      });
    },
    // 选中行
    selsChange: function(sels) {
      this.sels = sels;
    },
    //刪除按钮操作
    handleDelete(row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteRecordInfo = { ids: [row.id] };
          deleteRecord(deleteRecordInfo).then(response => {
            var res = notify(this, response);
            if (res) {
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    //编辑按钮操作
    handleUpdate(row) {
      this.getOrganListOptions();
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
    //插入数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.temp.time) {
            this.temp.time = parseTime(this.temp.time, "{y}-{m}");
          }

          addRecord(this.temp).then(response => {
            var res = notify(this, response);
            if (res) {
              this.dialogFormVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    //更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.temp.time) {
            this.temp.time = parseTime(this.temp.time, "{y}-{m}");
          }
          updateRecord(this.temp).then(response => {
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
.intake-record {
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

  /* 设置弹窗宽度 */
  .el-dialog {
    width: 30%;
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