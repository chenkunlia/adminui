<template>
  <div class="app-container user">

    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="用户">
          <el-input v-model="listQuery.name" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="listQuery.departmentId" clearable style="width: 200px" placeholder="全部">
            <el-option v-for="item in organOptions" :key="item.departmentId" :label="item.name" :value="item.departmentId" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select v-model="listQuery.status" clearable style="width: 200px" placeholder="全部">
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

    <!--添加/编辑弹窗-->
    <div class="form-container">
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="120px">
          <el-form-item label="账号" prop="account">
            <el-input v-model="temp.account" clearable :disabled="dialogStatus==='update'" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="temp.name" clearable :disabled="isAdmin&&dialogStatus!=='create'" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="temp.password" type="password" clearable @focus="clearPw" @blur="resetPw" />
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-select v-model="temp.department" clearable value-key="department" :disabled="isAdmin&&dialogStatus!=='create'">
              <el-option v-for="item in organOptions" :key="item.departmentId" :label="item.name" :value="item.departmentId" />
            </el-select>
          </el-form-item>
          <el-form-item label="账号状态" prop="status">
            <el-select v-model="temp.status" clearable value-key="key" :disabled="isAdmin&&dialogStatus!=='create'">
              <el-option v-for="(val, key) in userStatusOptions" :key="key" :label="val" :value="key" />
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
  getUsersData,
  getUserStatusList,
  getOrganList,
  addUser,
  updateUser,
  deleteUser
} from "@/commons/api/system";

import { checkNumber } from "@/commons/utils";
import { notify } from "@/commons/utils/notify";
import { userRules } from "@/commons/utils/validate";
import { constants } from "fs";
import { getName } from "@/commons/utils/auth"; //获取登录的用户名称

export default {
  name: "user",
  data() {
    return {
      //=====筛选条件相关=====
      //操作类型备选值
      organOptions: {},
      //账号状态
      userStatusOptions: {},
      //筛选条件
      listQuery: {
        page: 1,
        size: 10
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
        update: "编辑用户",
        create: "添加用户"
      },
      //表单对话框临时数据
      temp: {
        account: "",
        name: "",
        password: "",
        departmentId: "",
        departmentIds: [],
        status: ""
      },
      // 编辑窗口表单验证规则
      rules: userRules,

      isAdmin: false
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created() {
    this.getList(); //获取表数据
    this.getOrganListOptions(); //获取部门参数备选值
    this.getUserStatusOptions(); //获取账号状态参数备选值
  },

  watch: {
    dialogStatus: {
      handler(newName, oldName) {
        if (this.dialogStatus == "create") {
          this.rules = userRules;
        } else if (this.dialogStatus == "update") {
          var tempRules = Object.assign({}, userRules); //初始化表单
          tempRules.account = [];
          this.rules = tempRules;
        }
      },
      immediate: true
    }
  },

  methods: {
    //判断是否为超级用户
    //  isAdmin: function() {
    //    return this.isAdmin;
    // },

    //=====密码框相关=====
    clearPw() {
      this.temp.password = "";
    },

    resetPw() {
      // if (this.temp.password === "") {
      //   this.temp.password = "~~~~~~~~";
      // }
    },

    //=====筛选条件相关=====

    //获取部门参数备选值
    getOrganListOptions() {
      getOrganList().then(response => {
        this.organOptions = response.data;
      });
    },
    //获取账号状态参数备选值
    getUserStatusOptions() {
      getUserStatusList().then(response => {
        this.userStatusOptions = response.data.status;
      });
    },
    //重置按钮操作
    handleReset() {
      this.listQuery.page = 1; //前往到第一页
      this.listQuery.name = "";
      this.listQuery.departmentId = "";
      this.listQuery.status = "";
    },
    //搜索按钮操作
    handleFilter() {
      this.listQuery.page = 1; //前往到第一页
      this.getList(); //刷新表格数据
    },

    //=====工具栏相关=====

    //添加按钮操作
    handleCreate() {
      this.resetTemp(); //重置表单项
      this.dialogStatus = "create"; //对话框状态为添加
      this.dialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); //清除校验
      });
    },
    //批量删除按钮操作
    batchRemove: function() {
      var accounts = this.sels.map(item => item.account); //获取所有选中的账号
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteUserInfo = { ids: accounts };
          deleteUser(deleteUserInfo).then(response => {
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
      //解决启/停用取消选项报错问题
      if (!this.listQuery.status) {
        delete this.listQuery.status;
      }
      getUsersData(this.listQuery).then(response => {
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
          var deleteUserInfo = { ids: [row.account] };
          deleteUser(deleteUserInfo).then(response => {
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
      this.temp = Object.assign({}, row); //初始化表单
      if (row.account === "admin") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }

      //初始化表单时，无部门时，设置部门和部门ID的值
      if (!this.temp.departmentId) {
        this.temp.departmentId = -1;
        this.temp.department = " ";
      }

      //设死一个用于前端展现用的假密码
      this.temp.password = "~~~~~~~~";

      this.dialogStatus = "update"; //对话框状态为编辑
      this.dialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); //清除校验
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

    //=====表单对话框相关=====

    //重置表单项
    resetTemp() {
      this.temp = {
        account: "",
        name: "",
        password: "",
        departmentIds: [],
        status: ""
      };
    },
    //插入数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.departmentIds = [];

          //无部门时，设置为空
          if (!this.temp.department) {
            this.temp.department = " ";
          }
          this.temp.departmentIds.push(this.temp.department);
          addUser(this.temp).then(response => {
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
          this.temp.departmentIds = [];

          //无部门时，
          if (this.temp.departmentId == -1) {
            this.temp.departmentIds.push(this.temp.department);
          } else if (this.temp.department == -1) {
            this.temp.departmentIds.push(" ");
          }

          // 有部门时
          // 如果不是否包含中文且长度为32位，则表示修改过
          else if (checkNumber(this.temp.department)) {
            this.temp.departmentIds.push(this.temp.department);
          } else {
            // 表示没有改变部门，则获取他的部门Id来保存
            this.temp.departmentIds.push(this.temp.departmentId);
          }
          if (this.temp.password === "~~~~~~~~") {
            this.temp.password = null;
          }
          const tempData = Object.assign({}, this.temp);

          updateUser(tempData).then(response => {
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
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.user {
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