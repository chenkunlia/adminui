<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="角色">
          <el-input v-model="listQuery.roleName" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </el-form>
    </div>

    <div class="operate-container">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">添加</el-button>
      <el-button type="danger" icon="el-icon-remove-outline" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
    </div>
    <el-row>
      <el-col :span="12">
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

        <div class="pagination-container">
          <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

      </el-col>
      <el-col :span="12">
        <div :visible.sync="dialogFormVisible">
          <div :title="textMap[dialogStatus]">
            <div slot="footer" class="dialog-footer" style="margin-bottom:10px" align="right">
              <el-button size="mini" @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
              <el-button size="mini" v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
              <el-button size="mini" v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
            </div>
            <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="100px">
              <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="temp.roleName" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="temp.remark" />
              </el-form-item>

              <el-row :gutter="20">
                <el-col :span="9" :offset="2">
                  <el-form-item size="mini" label="配置用户">
                    <el-tree :data="roleUserTreeData" ref="userTree" :default-checked-keys="roleUserTreeCheckedNodes" node-key="userCode" :props="userTreeProps" show-checkbox>
                    </el-tree>
                  </el-form-item>
                </el-col>
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

export default {
  name: "user",
  data() {
    return {
      data6: [
        {
          menuId: 1,
          menuName: "一级 1",
          children: [
            {
              menuId: 4,
              menuName: "二级 1-1",
              children: [
                {
                  menuId: 9,
                  menuName: "三级 1-1-1"
                },
                {
                  menuId: 10,
                  menuName: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          menuId: 2,
          menuName: "一级 2",
          children: [
            {
              menuId: 5,
              menuName: "二级 2-1"
            },
            {
              menuId: 6,
              menuName: "二级 2-2"
            }
          ]
        },
        {
          menuId: 3,
          menuName: "一级 3",
          children: [
            {
              menuId: 7,
              menuName: "二级 3-1"
            },
            {
              menuId: 8,
              menuName: "二级 3-2",
              children: [
                {
                  menuId: 11,
                  menuName: "三级 3-2-1"
                },
                {
                  menuId: 12,
                  menuName: "三级 3-2-2"
                },
                {
                  menuId: 13,
                  menuName: "三级 3-2-3"
                }
              ]
            }
          ]
        }
      ],
      userTreeProps: {
        id: " ",
        children: "children",
        label: "departmentName"
      },

      menuTreeProps: {
        id: "menuId",
        children: "children",
        label: "menuName"
      },

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
        roleName: ""
      },

      treeQuery: {
        roleId: "0"
      },

      roleUserTreeData: undefined,
      roleUserTreeCheckedNodes: undefined,

      roleMenuTreeData: undefined,
      roleMenuTreeCheckedNodes: undefined,

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
      dialogFormVisible: true,

      //对话框状态（编辑还是新增）
      dialogStatus: "create",

      //编辑框标题名称
      textMap: {
        update: "编辑用户",
        create: "添加用户"
      },

      // 编辑窗口表单验证规则
      rules: {
        roleName: [{ required: true, message: "角色不能为空", trigger: "blur" }]
      },

      downloadLoading: false
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created() {
    this.getList();
    this.initUserTree();
    this.initMenuTree();
  },
  methods: {
    //重置按钮操作
    handleReset() {
      //前往到第一页
      this.listQuery.page = 1;
      this.listQuery.roleName = "";
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
      var roleIds = this.sels.map(item => item.roleId);
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteRoleInfo = { roleIds: roleIds };
          deleteRole(deleteRoleInfo).then(() => {
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
      getRoleList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    //获取用户树
    initUserTree() {
      getRoleUserList(this.treeQuery).then(response => {
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
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    //获取菜单树
    initMenuTree() {
      getRoleMenuList(this.treeQuery).then(response => {
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
          var deleteRoleInfo = { roleIds: [row.roleId] };
          deleteRole(deleteRoleInfo).then(() => {
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

      this.treeQuery.roleId = row.roleId;
      this.initUserTree();
      this.initMenuTree();
    },

    //分页相关
    //控制每页显示条数
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
      this.initUserTree();
      this.initMenuTree();
    },
    //跳转页码
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
      this.initUserTree();
      this.initMenuTree();
    },

    //表单对话框相关
    //重置表单项
    resetTemp() {
      this.temp = {
        remark: ""
      };

      //树相关重置
      //新增时重置树节点
      this.treeQuery.roleId = 0;
      this.initUserTree();
      this.initMenuTree();
    },
    //插入数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          addRole(tempData).then(response => {
            tempData.roleId = response.data;

            //角色菜单树数据
            var roleMenuTreeNodesData = {};
            //获取当前所有选中的树节点的key，存到一个数组里
            var cMenuIds = this.$refs.menuTree.getCheckedKeys();

            //获取选中节点的父节点
            var pMenuIds = this.$refs.menuTree.getHalfCheckedKeys();
            roleMenuTreeNodesData.menuIds = cMenuIds.concat(pMenuIds);

            roleMenuTreeNodesData.roleId = tempData.roleId;
            saveRoleMenu(roleMenuTreeNodesData).then(({data}) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data.msg,
                type: "success",
                duration: 2000
              });

              this.getList();
            });

            //角色菜单树数据
            var roleUserTreeNodesData = {};
            //获取当前所有选中的树节点的key，存到一个数组里
            roleUserTreeNodesData.userCodes = this.$refs.userTree.getCheckedKeys();
            roleUserTreeNodesData.roleId = tempData.roleId;

            saveRoleUser(roleUserTreeNodesData).then(({data}) => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: data.msg,
                type: "success",
                duration: 2000
              });

              this.getList();
            });
          });
        }
      });
    },
    //更新数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateRole(tempData).then(({data}) => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: data.msg,
              type: "success",
              duration: 2000
            });

            this.getList();
          });

          //角色菜单树数据
          var roleMenuTreeNodesData = {};
          //获取当前所有选中的树节点的key，存到一个数组里
          var cMenuIds = this.$refs.menuTree.getCheckedKeys();

          //获取选中节点的父节点
          var pMenuIds = this.$refs.menuTree.getHalfCheckedKeys();
          roleMenuTreeNodesData.menuIds = cMenuIds.concat(pMenuIds);

          roleMenuTreeNodesData.roleId = tempData.roleId;
          saveRoleMenu(roleMenuTreeNodesData).then(({data}) => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: data.msg,
              type: "success",
              duration: 2000
            });

            this.getList();
          });

          //角色菜单树数据
          var roleUserTreeNodesData = {};
          //获取当前所有选中的树节点的key，存到一个数组里
          roleUserTreeNodesData.userCodes = this.$refs.userTree.getCheckedKeys();

          roleUserTreeNodesData.roleId = tempData.roleId;
          saveRoleUser(roleUserTreeNodesData).then(({data}) => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: data.msg,
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