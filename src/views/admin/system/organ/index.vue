<template>
  <div class="app-container department">

    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="部门">
          <el-input v-model="listQuery.name" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="启/停用">
          <el-select v-model="listQuery.status" clearable style="width: 200px">
            <el-option v-for="(val, key) in organStatusOptions" :key="key" :label="val" :value="key" />
          </el-select>
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
      <el-table v-loading="listLoading" height="550" :key="tableKey" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>

        <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
        </el-table-column>

        <el-table-column label="部门名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="部门ID" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.departmentId }}</span>
            </template>
          </el-table-column> -->

        <el-table-column label="上级部门" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.superiorName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="启用/停用" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.statusMsg }}</span>
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
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!--添加/编辑弹窗-->
    <div class="form-container">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="120px">
          <el-form-item label="部门名称" prop="name">
            <el-input v-model="temp.name" clearable />
          </el-form-item>
          <el-form-item label="上级部门">
            <el-select v-model="temp.superiorId" clearable value-key="name">
              <el-option v-for="item in organOptions" :key="item.departmentId" :label="item.name" :value="item.departmentId" />
            </el-select>
          </el-form-item>
          <el-form-item label="部门状态" prop="status">
            <el-select v-model="temp.status" clearable value-key="key">
              <el-option v-for="(val, key) in organStatusOptions" :key="key" :label="val" :value="key" />
            </el-select>
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
  getOrgansData,
  getOrganStatusList,
  getOrganList,
  addOrgan,
  updateOrgan,
  deleteOrgan
} from "@/commons/api/system";

import { notify } from "@/commons/utils/notify";
import { organRules } from "@/commons/utils/validate";
import { constants } from "fs";

export default {
  name: "organ",
  data() {
    return {
      //=====筛选条件相关=====
      organOptions: {},
      organStatusOptions: {},
      //过滤条件
      listQuery: {
        page: 1,
        size: 10,
        departmentIds: []
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
      //对话框状态（编辑还是新增）
      dialogStatus: "",
      //编辑框标题名称
      textMap: {
        update: "编辑部门",
        create: "添加部门"
      },
      //表单对话框临时数据
      temp: {
        name: "",
        departmentSuperiorId: undefined
      },
      // 编辑窗口表单验证规则
      rules: organRules
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created() {
    this.getList();
    this.getOrganListOptions();
    this.getOrganStatusOptions();
  },
  methods: {
    //=====筛选条件相关=====

    //获取部门参数备选值
    getOrganListOptions() {
      getOrganList().then(response => {
        this.organOptions = response.data;
      });
    },
    //获取账号状态参数备选值
    getOrganStatusOptions() {
      getOrganStatusList().then(response => {
        this.organStatusOptions = response.data.status;
      });
    },
    //重置按钮操作
    handleReset() {
      this.listQuery.page = 1;
      this.listQuery.name = "";
      this.listQuery.status = "";
    },
    //搜索按钮操作
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    //=====工具栏相关=====

    //新建按钮操作
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //批量删除按钮操作
    batchRemove: function() {
      var departmentIds = this.sels.map(item => item.departmentId);
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteOrganInfo = { ids: departmentIds };
          deleteOrgan(deleteOrganInfo).then(response => {
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
      this.listLoading = true;
      //解决启/停用取消选项报错问题
      if (!this.listQuery.status) {
        delete this.listQuery.status;
      }
      getOrgansData(this.listQuery).then(response => {
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
          var deleteOrganInfo = { ids: [row.departmentId] };
          deleteOrgan(deleteOrganInfo).then(response => {
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
      this.temp = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    //=====分页相关=====

    //控制每页显示条数
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },
    //跳转页码
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    //表单对话框相关
    //重置表单项
    resetTemp() {
      this.temp = {
        name: ""
      };
    },
    //插入数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          addOrgan(this.temp).then(response => {
            var res = notify(this, response);
            if (res) {
              this.dialogFormVisible = false;
              this.getList();
              this.getOrganListOptions();
            }
          });
        }
      });
    },
    //更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);

          updateOrgan(tempData).then(response => {
            for (const v of this.list) {
              if (v.account === this.temp.account) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            //通知
            var res = notify(this, response);
            if (res) {
              this.dialogFormVisible = false;
              this.getList();
              this.getOrganListOptions();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.department {
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