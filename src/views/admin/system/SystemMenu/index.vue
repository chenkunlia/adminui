<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="菜单">
          <el-input v-model="listQuery.menuName" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="启/停用">
          <el-select v-model="listQuery.status" clearable style="width: 200px">
            <el-option v-for="(val, key) in statusOptions" :key="key" :label="val" :value="key" />
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </el-form>
    </div>

    <div class="operate-container">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">添加</el-button>
      <el-button type="danger" icon="el-icon-remove-outline" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
    </div>

    <div class="data-container">
      <el-table v-loading="listLoading" :key="tableKey" height="550" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>

        <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
        </el-table-column>

        <el-table-column label="菜单名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.menuName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="上级菜单" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.menuPName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="菜单路径" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
          </template>
        </el-table-column>

        <el-table-column label="启用/停用" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
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

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="100px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="temp.menuName" />
        </el-form-item>
        <el-form-item label="上级菜单" proop="menuPId">
          <el-select v-model="temp.menuPId" value-key="menuPId">
            <el-option v-for="item in menuSelectOptions" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单路径" prop="url">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="temp.icon" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-select v-model="temp.status" value-key="status">
            <el-option v-for="(val, key) in statusOptions" :key="key" :label="val" :value="key" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
import {
  getMenuList,
  getMenuSelectList,
  getStatusList,
  addMenu,
  updateMenu,
  deleteMenu
} from "@/commons/api/system";

import { checkNumber } from "@/commons/utils";

import { constants } from "fs";

export default {
  name: "user",
  data() {
    return {
      tableKey: 0,

      //表数据
      list: null,

      //记录总条数
      total: null,

      //数据加载标识
      listLoading: true,

      //列表选中列
      sels: [],

      //过滤条件
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        menuName: "",
        status: ""
      },

      //操作类型备选值
      menuSelectOptions: {},
      statusOptions: {},

      //表单对话框临时数据
      temp: {
        name: "",
        departmentSuperiorId: undefined
      },

      //表单对话框可见状态
      dialogFormVisible: false,

      //对话框状态（编辑还是新增）
      dialogStatus: "",

      //编辑框标题名称
      textMap: {
        update: "编辑菜单",
        create: "添加菜单"
      },

      // 编辑窗口表单验证规则
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        url: [{ required: true, message: "菜单路径不能为空", trigger: "blur" }],
        status: [
          { required: true, message: "菜单状态不能为空", trigger: "change" }
        ]
      },

      downloadLoading: false
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created() {
    this.getList();
    this.getStatusOptions();
  },
  methods: {
    //筛选条件相关
    //获取组织参数备选值
    getMenuSelectOptions() {
      getMenuSelectList().then(response => {
        this.menuSelectOptions = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    //获取账号状态参数备选值
    getStatusOptions() {
      getStatusList().then(response => {
        this.statusOptions = response.data.status;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    //重置按钮操作
    handleReset() {
      //前往到第一页
      this.listQuery.pageNum = 1;
      this.listQuery.menuName = "";
      this.listQuery.status = "";
      this.getList();
    },
    //搜索按钮操作
    handleFilter() {
      //前往到第一页
      this.listQuery.pageNum = 1;
      //刷新表格数据
      this.getList();
    },

    //工具栏相关
    //新建按钮操作
    handleCreate() {
      this.getMenuSelectOptions();
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //批量删除按钮操作
    batchRemove: function() {
      var menuIds = this.sels.map(item => item.menuId);
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteMenuInfo = { menuIds: menuIds };
          deleteMenu(deleteMenuInfo).then(() => {
            this.getList();
          });
        })
        .catch(() => {});
    },

    //表格数据相关
    //获取表数据
    getList() {
      //显示加载标识
      this.listLoading = true;
      getMenuList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;

        console.log(this.list);
        console.log(this.total);
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
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
          var deleteMenuInfo = { menuIds: [row.menuId] };
          deleteMenu(deleteMenuInfo).then(() => {
            this.getList();
          });
        })
        .catch(() => {});
    },
    //编辑按钮操作
    handleUpdate(row) {
      this.getMenuSelectOptions();
      this.temp = Object.assign({}, row);
      this.temp.status = this.temp.statusId;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    //分页相关
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

    //表单对话框相关
    //重置表单项
    resetTemp() {
      this.temp = {
        name: "",
        departmentSuperiorId: undefined
      };
    },
    //插入数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          addMenu(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });

            this.getList();
          });
        }
      });
    },
    //更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // if (checkNumber(this.temp.status)) {
          // } else {
          //   //如果是数值
          //   this.temp.status = this.temp.statusId;
          //   this.temp.menuPId = this.temp.menuPName;
          // }

          const tempData = Object.assign({}, this.temp);

          updateMenu(tempData).then(response => {
            var code = response.code;

            if (code == 0) {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: response.msg,
                type: "success",
                duration: 2000
              });
            } else if (code == -2) {
              this.dialogFormVisible = false;
              this.$notify.error({
                title: "失败",
                message: response.msg,
                duration: 2000
              });
            }

            this.getList();
          });
        }
      });
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

// .components-container {
//   .el-select,.el-input {
//     width: 300px;
//   }
// }
</style>