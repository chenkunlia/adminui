
<template>
  <div class="app-container plan">

    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="预案标题">
          <el-input v-model="listQuery.title" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="有效状态">
          <el-select v-model="listQuery.valid" clearable style="width: 200px">
            <el-option v-for="(val, key) in planStatusOptions" :key="key" :label="val" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="listQuery.name" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </el-form>
    </div>

    <!--工具栏-->
    <div class="operate-container">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">添加</el-button>
    </div>

    <!--表格数据-->
    <div class="data-container">
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->

        <el-table-column type="index" label="序号" width="60" align="center">
        </el-table-column>

        <el-table-column label="预案标题" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handlePreview(scope.row)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="有效开始日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate | formatDate}}</span>
          </template>
        </el-table-column>

        <el-table-column label="有效结束日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endDate | formatDate}}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="预案概要" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.resume }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button v-show="isCurrentUser(scope.row.name)" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-show="isCurrentUser(scope.row.name)" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
        <el-form ref="dataForm" :rules="rules" v-loading="loading" :model="temp" label-width="150px" :disabled="this.dialogStatus === 'view'">
          <el-form-item label="预案标题" prop="title">
            <el-input v-model="temp.title" clearable :disabled="dialogStatus==='update'" />
          </el-form-item>
          <el-form-item label="预案概要" prop="resume">
            <el-input v-model="temp.resume" clearable />
          </el-form-item>
          <el-form-item label="有效开始日期" prop="startDate">
            <el-date-picker v-model="temp.startDate" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsStart">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="有效结束日期" prop="endDate">
            <el-date-picker v-model="temp.endDate" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsEnd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="附件">
            <upload :actionUrl='action' :filesList='fileList' :params='params' :dialogFormVisible='dialogFormVisible' :dialogStatus='dialogStatus' v-on:uploadCallBack="uploadCall" v-on:removeCallBack="removeCall"></upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button v-show="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
          <el-button v-show="dialogStatus=='update'" type="primary" @click="updateData">确定</el-button>
          <el-button v-show="dialogStatus!=='view'" @click="dialogFormVisible = false">取消</el-button>
          <el-button v-show="dialogStatus==='view'" @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>


<script>
import emergency from "@/commons/api/emergency";
import api from "@/commons/api/";
import { planRules } from "@/commons/utils/validate";
import upload from "../upload";
import { getName } from "@/commons/utils/auth"; // 获取登录的用户名称
import { datetime2Date } from "@/commons/utils";

export default {
  name: "plan",
  components: { upload },
  data() {
    return {
      // =====筛选条件相关=====
      // 有效状态
      planStatusOptions: {
        1: "有效",
        0: "失效"
      },
      // 筛选条件
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      // 重置筛选条件
      resetListQuery: {
        pageNum: 1,
        title: "",
        name: "",
        status: ""
      },

      // =====表格数据相关=====
      // 表数据
      list: null,
      // 记录总条数
      total: null,
      // 数据加载标识
      listLoading: true,
      loading:false,
      // 列表选中列
      sels: [],

      // =====添加/编辑弹窗相关=====
      // 表单对话框可见状态
      dialogFormVisible: false,
      // 对话框状态（编辑还是添加）
      dialogStatus: "",
      // 编辑框标题名称
      textMap: {
        update: "编辑应急预案",
        create: "添加应急预案",
        view: "预览应急预案"
      },
      // 表单对话框临时数据
      temp: {},
      // 编辑窗口表单验证规则
      rules: planRules,

      // =====文件上传相关=====
      // 文件上传的请求地址
      action: "/app/file/upload",
      // 文件列表
      fileList: [],
      // 文件类型
      params: {
        docCatalog: "plan"
      },
      // 请求文件列表参数
      queryById: {
        id: ""
      },

      pickerOptionsStart: {},
      pickerOptionsEnd: {}
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created: function() {
    this.getList(); //获取表数据
  },

  filters: {
    //格式化日期
    formatDate: function(value) {
      return datetime2Date(value);
    }
  },

  methods: {
    // =====筛选条件相关=====
    // 重置按钮操作
    handleReset: function() {
      api.handleReset(this);
    },
    // 搜索按钮操作
    handleFilter: function() {
      this.listQuery.pageNum = 1; //前往到第一页
      this.getList(); //刷新表格数据
    },

    //=====工具栏相关=====
    //添加按钮操作
    handleCreate: function() {
      api.handleCreate(this);
      this.pickerOptions();
    },

    //=====表格数据相关=====
    //获取表数据
    getList: function() {
      api.getList(this, emergency, "getEmergencyPlanPage");
    },
    // 选中行
    selsChange: function(sels) {
      this.sels = sels;
    },
    //预览操作
    handlePreview: function(row) {
      api.handlePreview(this, row, "", false);
    },
    //刪除按钮操作
    handleDelete: function(row) {
      api.handleDelete(this, emergency, "deleteEmergencyPlan", row);
    },
    //编辑按钮操作
    handleUpdate: function(row) {
      this.loading=true
      let that=this
      api.handleUpdate(this, row, "", false);
      this.pickerOptions();
      setTimeout(() => {
            that.loading=false
          }, 200);
    },
    //判断是否为当前用户
    isCurrentUser: function(name) {
      // api.isCurrentUser(name);
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

    //=====表单相关=====
    //重置表单项
    resetTemp: function() {
      api.resetTemp(this);
    },
    //插入数据
    createData: function() {
      api.createData(this, emergency, "addEmergencyPlan");
    },
    //更新数据
    updateData: function() {
      api.updateData(this, emergency, "updateEmergencyPlan");
    },

    // =====文件上传相关=====
    // 获取文件列表
    getFileList: function(id) {
      api.getFileList(this, emergency, "getEmergencyPlanFiles", id);
    },
    // 上传文件回调函数
    uploadCall: function(fileData) {
      api.uploadCall(this, fileData);
    },
    // 移除文件回调函数
    removeCall: function(index) {
      api.removeCall(this, index);
    },

    pickerOptions: function() {
      var that = this;
      that.pickerOptionsStart = {
        disabledDate(time) {
          return that.temp.endDate !== ""
            ? new Date(format(time,'yyyy-MM-dd')).getTime() >
                new Date(datetime2Date(that.temp.endDate)).getTime()
            : false;
        }
      };

      that.pickerOptionsEnd = {
        disabledDate(time) {
          return that.temp.startDate !== ""
            ? new Date(format(time,'yyyy-MM-dd')).getTime() <
                new Date(datetime2Date(that.temp.startDate)).getTime()
            : false;
        }
      };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" >
//筛选面板
.plan {
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

  /* 设置文件列表样式 */
  .list-group {
    padding: 0;
    .file-name {
      width: auto;
    }
  }
}
</style>