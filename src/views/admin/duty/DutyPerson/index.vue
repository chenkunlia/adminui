<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">

        <el-form-item label="人员名称">
          <el-input v-model="listQuery.name" placeholder="人员名称" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>

        <el-form-item label="单位">
          <el-input placeholder="单位" v-model="listQuery.companyCode" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="职务">
          <el-input placeholder="职务" v-model="listQuery.positionId" clearable></el-input>
        </el-form-item> -->

        <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </el-form>

    </div>
    <div class="operate-container">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">新增人员</el-button>
      <el-button type="danger" icon="el-icon-remove-outline" @click="batchRemove" :disabled="this.selectRows.length===0">批量删除</el-button>
    </div>
    <div class="data-container">
      <el-table v-loading="listLoading" :key="tableKey" height="550" :data="list" border fit highlight-current-row  @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="单位" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.companyCode }}</span>
          </template>
        </el-table-column>

        <el-table-column label="电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mobilePhone }}</span>
          </template>
        </el-table-column>

        <el-table-column label="值班" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isDutyMsg }}</span>
          </template>
        </el-table-column>

        <el-table-column label="短信" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isMsgRecMsg }}</span>
          </template>
        </el-table-column>

        <el-table-column label="职务" align="center">
          <template slot-scope="scope">
            <span>{{ positionMap[scope.row.positionId] }}</span>
          </template>
        </el-table-column>

        <el-table-column label="职责" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.jobFunction }}</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.note }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editDutyPerson(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteDutyPerson(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <user-detail v-model='dVisible' :url="dUrl" :defaultValue="row" @success="getList"></user-detail>
  </div>
</template>

<script>
import { getPersonList, getPersonDetail,deletePersonDetail } from "@/commons/api/dutyPerson";

import { parseTime } from "@/commons/utils";
import UserDetail from "../commons/UserDetail";
export default {
  name: "DutyList",
  components: {
    UserDetail
  },
  //数据部分
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      selectRows:[],
      row:{},

      // 参数默认值
      listQuery: {
        companyCode: undefined,
        name: undefined,
        positionId: undefined,
        page: 1,
        size: 10
      },

      //操作类型备选值
      positionTypeOptions: {},

      //模块类型备选值
      moduleTypeOptions: {},

      dVisible: false,
      dUrl: "",
      positionMap:{'1':'业务员','2':'总经理'}
    };
  },

  //周期函数，创建时获取数据列表
  created() {
    this.getList();
  },
  methods: {
    //获取数据列表
    getList() {
      //记载标识
      this.listLoading = true;

      getPersonList(this.listQuery).then(response => {
        try {
          this.list = response.data.list;
          this.total = response.data.total;
          
        } catch (e) {
          console.log(e);
        }
      });
      setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 10);
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
      this.listQuery.companyCode = undefined;
      this.listQuery.name = undefined;
      this.listQuery.positionId = undefined;
      this.listQuery.operationTime = "";
      this.getList();
    },

    //显示每页条数
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },

    //跳转页码
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    //显示人员信息
    editDutyPerson(row) {
      this.row=row
      this.dVisible=true
    },

    //新增人员
    handleCreate(){
      console.log("create")
      this.row={}
      this.dVisible=true
    },

    //删除一条记录
    deleteDutyPerson(id){
      this.$confirm("确认删除此条记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteUserInfo = {ids:[id]};
          deletePersonDetail(deleteUserInfo).then(res => {
             this.handleResponse(res,'delete')
             this.listQuery.page=1
            this.getList();
          });
        })
        .catch(() => {});
    },

    // 选中行
    selsChange: function(selectRows) {
      this.selectRows = selectRows;
    },

     //批量删除按钮操作
    batchRemove: function() {
      var ids = this.selectRows.map(item => item.id);
      console.log("打印所有选中的用户：" + ids.join(","));
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          var deleteUserInfo = { ids };
          deletePersonDetail(deleteUserInfo).then(res => {
            this.handleResponse(res,'delete')
            this.listQuery.page=1
            this.getList();
          });
        })
        .catch(() => {});
    },
    handleResponse(res,msgType){
      if(res.code==0){
        if(msgType=='update'){
          this.notify('更新成功','success')
        }else if(msgType=='add'){
          this.notify('添加成功','success')
        }else if(msgType=='delete'){
          this.notify('删除成功','success')
        }
      }else if(res.code==-2){
        if(msgType=='update'){
          this.notify(res.msg,'error')
        }else if(msgType=='add'){
          this.notify(res.msg,'error')
        }else if(msgType=='delete'){
          this.notify(res.msg,'error')
        }
      }
    },
    notify(msg,showType){
      if(showType=='success'){
        this.$notify.success({
                title: "成功",
                message: msg,
                duration: 2 * 1000
              });
      }else if(showType=='error'){
        this.$notify.error({
                title: "失败",
                message: msg,
                duration: 2 * 1000
              });
      }
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