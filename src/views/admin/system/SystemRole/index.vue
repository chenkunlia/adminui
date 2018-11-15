<template>
  <div class="app-container">

    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="角色">
          <el-input v-model="listQuery.roleName" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </el-form>
    </div>

    <!--工具栏-->
    <div class="operate-container">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">添加</el-button>
      <el-button type="danger" icon="el-icon-remove-outline" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
    </div>

    <el-row>
      <el-col :span="12">

        <!--表格数据-->
        <div class="data-container">
          <el-table v-loading="listLoading" :key="tableKey" height="550" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>

            <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
            </el-table-column>

            <el-table-column label="角色名" align="center">
              <template slot-scope="scope">
                <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.roleName }}</span>
              </template>
            </el-table-column>

            <el-table-column label="用户数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.num }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.remark }}</span>
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

      </el-col>
      <el-col :span="12">

        <!--添加/编辑区域-->
        <div>
          <div :title="textMap[dialogStatus]">
            <div slot="footer" class="dialog-footer" style="margin-bottom:10px" align="right">
              <el-button size="mini" v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
              <el-button size="mini" v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
              <el-button size="mini" @click="resetTemp">{{ $t('table.cancel') }}</el-button>
            </div>
            <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="120px">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="temp.roleName" clearable />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="temp.remark" clearable />
              </el-form-item>

              <el-row :gutter="20">

                <!--用户树-->
                <el-col :span="9" :offset="2">
                  <el-form-item size="mini" label="配置用户">
                    <el-tree :data="roleUserTreeData" ref="userTree" :default-checked-keys="roleUserTreeCheckedNodes" node-key="userCode" :props="userTreeProps" show-checkbox>
                    </el-tree>
                  </el-form-item>
                </el-col>

                <!--菜单树-->
                <el-col :span="9" :offset="2">
                  <el-form-item size="mini" label="菜单权限">
                    <el-tree :data="roleMenuTreeData" ref="menuTree" :default-checked-keys="roleMenuTreeCheckedNodes" node-key="menuId" :props="menuTreeProps" show-checkbox>
                    </el-tree>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  getRoleMenuList,
  getRoleUserList,
  saveRoleMenu,
  saveRoleUser
} from "@/commons/api/system";

import { constants } from "fs";
import {
  treeDataTranslate,
  treeDataTranslate2,
  getTreeCheckedNodes
} from "@/commons/utils";

import { notify } from "@/commons/utils/notify";
import { roleRules } from "@/commons/utils/validate";

export default {
  name: "role",
  data() {
    return {
      //=====筛选条件相关=====
      //操作类型备选值
      organOptions: {},
      userStatusOptions: {},
      //过滤条件
      listQuery: {
        page: 1,
        size: 10,
        roleName: ""
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

      //=====树相关=====
      treeQuery: {
        roleId: "0"
      },
      roleUserTreeData: undefined,
      roleUserTreeCheckedNodes: undefined,
      roleMenuTreeData: undefined,
      roleMenuTreeCheckedNodes: undefined,

      //=====用户树相关=====
      userTreeProps: {
        id: " ",
        children: "children",
        label: "departmentName"
      },
      //=====菜单树相关=====
      menuTreeProps: {
        id: "menuId",
        children: "children",
        label: "menuName"
      },

      //=====添加/编辑区域相关=====
      //对话框状态（编辑还是新增）
      dialogStatus: "create",
      //编辑框标题名称
      textMap: {
        update: "编辑角色",
        create: "添加角色"
      },
      //表单对话框临时数据
      temp: {
        roleName: "",
        remark: ""
      },
      // 编辑窗口表单验证规则
      rules: roleRules
    };
  },
  inject:['reload'],
  // 周期函数，创建时获取表格数据和参数备选值
  created() {
    this.getList(); //获取表数据
    this.initUserTree(); //初始化用户树
    this.initMenuTree(); //初始化菜单树
  },
  methods: {
    //=====筛选条件相关=====

    //重置按钮操作
    handleReset() {
      this.listQuery.page = 1; //前往到第一页
      this.listQuery.roleName = "";
    },
    //搜索按钮操作
    handleFilter() {
      this.listQuery.page = 1; //前往到第一页
      this.getList(); //刷新表格数据
    },

    //=====工具栏相关=====

    //新建按钮操作
    handleCreate() {
      this.resetTemp(); //重置表单项
      this.dialogStatus = "create"; //对话框状态为添加
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); //清除校验
      });
    },
    //批量删除按钮操作
    batchRemove: function() {
      var roleIds = this.sels.map(item => item.roleId);
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteRoleInfo = { roleIds: roleIds };
          deleteRole(deleteRoleInfo).then(response => {
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
      getRoleList(this.listQuery).then(response => {
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
          var deleteRoleInfo = { roleIds: [row.roleId] };
          deleteRole(deleteRoleInfo).then(response => {
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
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });

      this.treeQuery.roleId = row.roleId;
      this.initUserTree();
      this.initMenuTree();
    },

    //=====分页相关=====

    //控制每页显示条数
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.resetTemp();
      this.getList();
    },
    //跳转页码
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.resetTemp();
      this.getList();
    },

    //=====表单区域相关=====

    //重置表单项
    resetTemp() {
      this.temp = {
        remark: ""
      };
      //树相关重置
      this.treeQuery.roleId = 0; //新增时重置树节点
      this.initUserTree();
      this.initMenuTree();
    },

    //获取用户树
    initUserTree() {
      getRoleUserList(this.treeQuery).then(response => {
        //通知
        var res = notify(this, response, true);
        if (!res) {
          return;
        }
        //获取树数据
        this.roleUserTreeData = treeDataTranslate2(
          response.data.organList,
          response.data.userList,
          "userCode",
          "organId"
        );
        //获取树选中节点数据
        this.roleUserTreeCheckedNodes = getTreeCheckedNodes(
          response.data.userList,
          "userCode",
          "roleId"
        );
      });
    },

    //获取菜单树
    initMenuTree() {
      getRoleMenuList(this.treeQuery).then(response => {
        //通知
        var res = notify(this, response, true);
        if (!res) {
          return;
        }
        //获取树数据
        this.roleMenuTreeData = treeDataTranslate(
          response.data,
          "menuId",
          "menuPId"
        );
        //获取树选中节点数据
        this.roleMenuTreeCheckedNodes = getTreeCheckedNodes(
          response.data,
          "menuId",
          "roleId"
        );
      });
    },

    //插入数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          addRole(tempData).then(response => {
            var addRes = false;
            //通知
            var addRoleRes = notify(this, response, true);
            if (!addRoleRes) {
              return;
            }

            tempData.roleId = response.data;

            var roleMenuTreeNodesData = {}; //角色菜单树数据
            var cMenuIds = this.$refs.menuTree.getCheckedKeys(); //获取所有选中的树节点的key
            var pMenuIds = this.$refs.menuTree.getHalfCheckedKeys(); //获取选中树节点的父节点
            roleMenuTreeNodesData.menuIds = cMenuIds.concat(pMenuIds);
            roleMenuTreeNodesData.roleId = tempData.roleId;

            saveRoleMenu(roleMenuTreeNodesData).then(response => {
              var updateRoleMenuRes = notify(this, response, true);
              if (!updateRoleMenuRes) {
                return;
              }
              var roleUserTreeNodesData = {}; //角色用户树数据
              roleUserTreeNodesData.userCodes = this.$refs.userTree.getCheckedKeys();
              roleUserTreeNodesData.roleId = tempData.roleId;

              saveRoleUser(roleUserTreeNodesData).then(({ data }) => {
                var updateRoleUserRes = notify(this, response);
                if (!updateRoleUserRes) {
                  return;
                }
                this.getList();
              });
            });
          });
        }
      });
    },
    //更新数据
    updateData() {
      let that=this
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateRole(tempData).then(response => {
            var updateRes = false;
            var updateRoleRes = notify(this, response, true);
            if (!updateRoleRes) {
              return;
            }

            var roleMenuTreeNodesData = {}; //角色菜单树数据
            var cMenuIds = this.$refs.menuTree.getCheckedKeys(); //获取当前所有选中的树节点的key，存到一个数组里
            var pMenuIds = this.$refs.menuTree.getHalfCheckedKeys(); //获取选中节点的父节点
            roleMenuTreeNodesData.menuIds = cMenuIds.concat(pMenuIds);
            roleMenuTreeNodesData.roleId = tempData.roleId;

            saveRoleMenu(roleMenuTreeNodesData).then(response => {
              var updateRoleMenuRes = notify(this, response, true);
              if (!updateRoleMenuRes) {
                return;
              }
              var roleUserTreeNodesData = {}; //角色用户树数据
              roleUserTreeNodesData.userCodes = this.$refs.userTree.getCheckedKeys();
              roleUserTreeNodesData.roleId = tempData.roleId;

              saveRoleUser(roleUserTreeNodesData).then(response => {
                var updateRoleUserRes = notify(this, response);
                if (!updateRoleUserRes) {
                  return;
                }
                this.getList();
                that.reload()
              });
            });
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