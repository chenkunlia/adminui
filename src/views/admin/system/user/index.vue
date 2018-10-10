<template>
  <div class="app-container">

    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="用户">
          <el-input v-model="listQuery.name" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="listQuery.departmentId" clearable style="width: 200px">
            <el-option v-for="item in organOptions" :key="item.departmentId" :label="item.name" :value="item.departmentId" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select v-model="listQuery.status" clearable style="width: 200px">
            <el-option v-for="(val, key) in userStatusOptions" :key="key" :label="val" :value="key" />
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
      <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>

        <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
        </el-table-column>

        <el-table-column label="账号" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.account }}</span>
          </template>
        </el-table-column>

        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="部门ID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.departmentId }}</span>
          </template>
        </el-table-column> -->

        <el-table-column label="部门" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.department }}</span>
          </template>
        </el-table-column>

        <el-table-column label="账号状态" align="center">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="100px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" :disabled="dialogStatus==='update'" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="temp.department" value-key="department">
            <el-option key="-1" label="" value="" />
            <el-option v-for="item in organOptions" :key="item.departmentId" :label="item.name" :value="item.departmentId" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态" prop="status">
          <el-select v-model="temp.status" value-key="key">
            <el-option v-for="(val, key) in userStatusOptions" :key="key" :label="val" :value="key" />
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
  getUsersData,
  getUserStatusList,
  getOrganList,
  addUser,
  updateUser,
  deleteUser
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
        page: 1,
        size: 10,
        departmentIds: []
      },

      //操作类型备选值
      organOptions: {},
      userStatusOptions: {},

      //表单对话框临时数据
      temp: {
        account: "",
        departmentId: "",
        name: "",
        password: "",
        departmentObj: {
          departmentId: undefined,
          department: undefined
        }
      },

      //表单对话框可见状态
      dialogFormVisible: false,

      //对话框状态（编辑还是新增）
      dialogStatus: "",

      //编辑框标题名称
      textMap: {
        update: "编辑用户",
        create: "添加用户"
      },

      // 编辑窗口表单验证规则
      rules: {
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "账号状态不能为空", trigger: "change" }
        ]
      },

      downloadLoading: false
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created() {
    this.getList();//获取表数据
    this.getOrganListOptions();//获取部门参数备选值
    this.getUserStatusOptions();//获取账号状态参数备选值
  },
  methods: {

    //筛选条件相关

    //获取部门参数备选值
    getOrganListOptions() {
      getOrganList().then(response => {
        this.organOptions = response.data;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    
    //获取账号状态参数备选值
    getUserStatusOptions() {
      getUserStatusList().then(response => {
        this.userStatusOptions = response.data.status;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    //重置按钮操作
    handleReset() {
      //前往到第一页
      this.listQuery.page = 1;
      this.listQuery.name = "";
      this.listQuery.departmentId = "";
      this.listQuery.status = "";
      this.getList();
    },
    //搜索按钮操作
    handleFilter() {
      //前往到第一页
      this.listQuery.page = 1;
      //刷新表格数据
      this.getList();
    },

    //工具栏相关
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
      var accounts = this.sels.map(item => item.account);
      console.log("打印所有选中的用户：" + accounts.join(","));
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteUserInfo = { ids: accounts };
          deleteUser(deleteUserInfo).then(() => {
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
      //解决启/停用取消选项报错问题
      if (!this.listQuery.status) {
        delete this.listQuery.status;
      }
      getUsersData(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
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
          var deleteUserInfo = { ids: [row.account] };
          deleteUser(deleteUserInfo).then(() => {
            this.getList();
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

    //分页相关
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
        account: "",
        departmentId: [],
        name: "",
        password: "",
        status: ""
      };
    },
    //插入数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.departmentIds = [];
          this.temp.departmentIds.push(this.temp.department);
          addUser(this.temp).then(response => {
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
    },
    //更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.departmentIds = [];
          //如果是字符串，表示没有改变组织，则获取他的组织Id来保存
          if (checkNumber(this.temp.department)) {
            this.temp.departmentIds.push(parseInt(this.temp.department));
          } else {
            //如果是数值
            this.temp.departmentIds.push(this.temp.departmentId);
          }

          const tempData = Object.assign({}, this.temp);

          updateUser(tempData).then(() => {
            for (const v of this.list) {
              if (v.account === this.temp.account) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });

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