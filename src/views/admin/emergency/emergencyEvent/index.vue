
<template>
  <div class="app-container event">

    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="事件标题">
          <el-input v-model="listQuery.title" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="listQuery.name" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="发生日期" prop="startDate">
          <el-date-picker v-model="listQuery.start" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsFilterStart">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="~" prop="endDate">
          <el-date-picker v-model="listQuery.end" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsFilterEnd">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" icon="el-icon-refresh" @click="handleReset">重置</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      </el-form>
    </div>

    <!--工具栏-->
    <div class="operate-container">
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">添加</el-button>
    </div>

    <!--表格数据-->
    <div class="data-container">
      <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
        <!-- <el-table-column type="selection" width="55" align="center">
        </el-table-column> -->

        <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
        </el-table-column>

        <el-table-column label="事件标题" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handlePreview(scope.row)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="发生日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate | formatDate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="是否结束" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status==1?'否':'是' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建人" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="事件概要" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.resume }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope" align="center">
            <el-button v-show="isCurrentUser(scope.row.name)" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
            <el-button v-show="isCurrentUser(scope.row.name)" type="danger" size="mini" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
            <el-button v-show="scope.row.status!=1&&isCurrentUser(scope.row.name)" type="success" size="mini" @click="handleUpdateSummary(scope.row)">总结</el-button>
            <el-button v-show="scope.row.status!=1&&!isCurrentUser(scope.row.name)" type="normal" size="mini" @click="handleViewSummary(scope.row)">总结</el-button>
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
        <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="120px" :disabled="this.dialogStatus === 'view'">
          <el-form-item label="事件标题" prop="title">
            <el-input v-model="temp.title" clearable />
          </el-form-item>
          <el-form-item label="事件概要" prop="resume">
            <el-input v-model="temp.resume" clearable />
          </el-form-item>

          <el-form-item label="指导预案" prop="remark">
            <el-select v-model="temp.planId" clearable disabled>
              <el-option v-for="item in emergencyPlanOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker v-model="temp.startDate" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsStart">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="终止日期" prop="endDate">
            <el-date-picker v-model="temp.endDate" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsEnd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="终止条件" prop="remark">
            <el-select v-model="temp.condition" clearable :disabled="!temp.endDate">
              <el-option v-for="item in endConditionOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>

        <!--工具栏-->
        <div class="process-operate-container">
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleCreateProcess" :disabled="!temp.title||!temp.resume||!temp.startDate">添加</el-button>
        </div>

        <!--过程表格数据-->
        <div class="process-data-container">
          <el-table v-loading="listLoading" :data="processList" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
            </el-table-column>
            <el-table-column label="信息" align="center">
              <template slot-scope="scope">
                <span class="link-type" @click="handlePreviewProcess(scope.row)">{{ scope.row.content }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建人" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.actions')" align="center" width="200" class-name="small-padding fixed-width">
              <template slot-scope="scope" align="center">
                <el-button v-show="isCurrentUser(scope.row.name)" type="primary" size="mini" @click="handleUpdateProcess(scope.row)">{{ $t('table.edit') }}</el-button>
                <el-button v-show="isCurrentUser(scope.row.name)" type="danger" size="mini" @click="handleDeleteProcess(scope.row)">{{ $t('table.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button v-show="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
          <el-button v-show="dialogStatus=='update'" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
          <el-button v-show="dialogStatus!=='view'" @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button v-show="dialogStatus==='view'" @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!--过程弹窗-->
    <div class="process-form-container">
      <el-dialog :title="processTextMap[dialogStatusProcess]" :visible.sync="processDialogFormVisible">
        <el-form width="30%" ref="processForm" :rules="processRules" :model="processTemp" label-width="100px" :disabled="this.dialogStatusProcess === 'view'||dialogStatusProcess===!isCurrentUser(processTemp.name)">

          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker v-model="processTemp.startDate" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsProcessStart">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker v-model="processTemp.endDate" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptionsProcessEnd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="过程信息" prop="content">
            <el-input v-model="processTemp.content" clearable type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="应急人员" prop="person">
            <el-input v-model="processTemp.person" clearable />
          </el-form-item>
          <el-form-item label="参与科室" prop="organ">
            <el-input v-model="processTemp.organ" clearable />
          </el-form-item>
          <el-form-item label="附件">
            <upload :actionUrl='action' :filesList='processFileList' :dialogFormVisible='processDialogFormVisible' :dialogStatusProcess='dialogStatusProcess' :params='params' v-on:uploadCallBack="uploadCallProcess" v-on:removeCallBack="removeCallProcess"></upload>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button v-show="dialogStatusProcess=='create'" type="primary" @click="createProcess">{{ $t('table.confirm') }}</el-button>
          <el-button v-show="dialogStatusProcess=='update'" type="primary" @click="updateProcess">{{ $t('table.confirm') }}</el-button>
          <el-button v-show="dialogStatusProcess!=='view'" @click="processDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button v-show="dialogStatusProcess==='view'" @click="processDialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="summary-form-container">
      <el-dialog :title="summaryTextMap[dialogStatus]" :visible.sync="summaryDialogFormVisible">
        <el-form width="30%" ref="summaryForm" :rules="summaryRules" :model="temp" label-width="120px" :disabled="!isCurrentUser(temp.name)">
          <el-form-item label="总结日期" prop="summaryDate">
            <el-date-picker v-model="temp.summaryDate" clearable type="date" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="总结人" prop="name">
            <el-input v-model="temp.name" clearable />
          </el-form-item>
          <el-form-item label="总结内容" prop="content">
            <el-input type="textarea" v-model="temp.content" clearable />
          </el-form-item>
          <el-form-item label="附件">
            <upload :actionUrl='action' :filesList='fileList' :dialogFormVisible='summaryDialogFormVisible' :dialogStatus='dialogStatus' :params='params' v-on:uploadCallBack="uploadCallSummary" v-on:removeCallBack="removeCallSummary"></upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="summaryData">{{ $t('table.confirm') }}</el-button>
          <el-button @click="summaryDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>


<script>
import emergency from "@/commons/api/emergency";
import api from "@/commons/api/";
import { format, datetime2Date } from "@/commons/utils";
import { notify } from "@/commons/utils/notify";
import {
  eventRules,
  processRules,
  summaryRules
} from "@/commons/utils/validate";
import upload from "../upload";

import { getName } from "@/commons/utils/auth"; //获取登录的用户名称

export default {
  name: "Event",
  components: { upload },
  data() {
    return {
      // =====文件上传相关=====
      // 文件上传的请求地址
      action: "/app/file/upload",
      // 文件列表
      fileList: [],
      summaryFileList: [],
      processFileList: [],
      params: {
        docCatalog: "Event"
      },
      // 请求文件列表参数
      queryById: {
        id: ""
      },

      // =====筛选条件相关=====
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
        startDate: "",
        endDate: ""
      },

      // =====表格数据相关=====
      tableKey: 0,
      // 表数据
      list: null,

      processList: null,

      // 记录总条数
      total: null,
      // 数据加载标识
      listLoading: true,
      // 列表选中列
      sels: [],

      // =====添加/编辑弹窗相关=====
      // 表单对话框可见状态

      emergencyPlanOptions: {},
      endConditionOptions: {},

      dialogFormVisible: false,

      processDialogFormVisible: false,
      summaryDialogFormVisible: false,

      //事件的row行标识，用于更新过程信息后，更新该事件的过程列表使用
      eventRow: "",
      // 对话框状态（编辑还是添加）
      dialogStatus: "",

      dialogStatusProcess: "",
      // 操作类型（过程或者总结）
      handleType: "",
      // 编辑框标题名称

      textMap: {
        update: "编辑应急事件",
        create: "添加应急事件",
        view: "预览应急事件"
      },
      processTextMap: {
        update: "编辑事件过程",
        create: "添加事件过程",
        view: "预览事件过程"
      },
      summaryTextMap: {
        update: "编辑事件总结",
        create: "添加事件总结",
        view: "预览事件总结"
      },
      // 表单对话框临时数据
      temp: {},
      // 表单对话框临时数据
      processTemp: {},

      // 表单对话框临时数据
      summaryTemp: {},
      // 编辑窗口表单验证规则
      rules: eventRules,
      processRules: processRules,
      summaryRules: summaryRules,

      pickerOptionsFilterStart: {},
      pickerOptionsFilterEnd: {},

      pickerOptionsStart: {},
      pickerOptionsEnd: {},

      pickerOptionsProcessStart: {},
      pickerOptionsProcessEnd: {}
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created: function() {
    this.getList(); //获取表数据
    this.pickerOptions("filter");
  },

  filters: {
    //格式化日期
    formatDate: function(value) {
      return datetime2Date(value);
    }
  },

  methods: {
    pickerOptions: function(type) {
      var that = this;

      if (type === "event") {
        that.pickerOptionsStart = {
          disabledDate: time => {
            return !that.temp.endDate
              ? false
              : new Date(format(time, "yyyy-MM-dd")).getTime() >
                  new Date(datetime2Date(that.temp.endDate)).getTime();
          }
        };

        that.pickerOptionsEnd = {
          disabledDate: time => {
            return !that.temp.startDate
              ? false
              : new Date(format(time, "yyyy-MM-dd")).getTime() <
                  new Date(datetime2Date(that.temp.startDate)).getTime();
          }
        };
      } else if (type === "process") {
        that.pickerOptionsProcessStart = {
          disabledDate: time => {
            return !that.processTemp.endDate
              ? false
              : new Date(format(time, "yyyy-MM-dd")).getTime() >
                  new Date(datetime2Date(that.processTemp.endDate)).getTime();
          }
        };

        that.pickerOptionsProcessEnd = {
          disabledDate: time => {
            return !that.processTemp.startDate
              ? false
              : new Date(format(time, "yyyy-MM-dd")).getTime() <
                  new Date(datetime2Date(that.processTemp.startDate)).getTime();
          }
        };
      } else if (type === "filter") {
        that.pickerOptionsFilterStart = {
          disabledDate: time => {
            return !that.listQuery.end
              ? false
              : new Date(format(time, "yyyy-MM-dd")).getTime() >
                  new Date(datetime2Date(that.listQuery.end)).getTime();
          }
        };

        that.pickerOptionsFilterEnd = {
          disabledDate: time => {
            return !that.listQuery.start
              ? false
              : new Date(format(time, "yyyy-MM-dd")).getTime() <
                  new Date(datetime2Date(that.listQuery.start)).getTime();
          }
        };
      }
    },

    // =====筛选条件相关=====
    // 重置按钮操作
    handleReset: function() {
      api.handleReset(this);
    },
    // 搜索按钮操作
    handleFilter: function() {
      this.listQuery.pageNum = 1; //前往到第一页
      // 开始日期格式转换
      if (this.listQuery.start) {
        this.listQuery.startDate = this.listQuery.start;
      } else {
        this.listQuery.startDate = null;
      }
      // 结束日期格式转换
      if (this.listQuery.end) {
        this.listQuery.endDate = this.listQuery.end;
      } else {
        this.listQuery.endDate = null;
      }
      this.getList(); //刷新表格数据
    },

    //=====工具栏相关=====
    //添加按钮操作
    handleCreate: function() {
      this.getEndConditionOptions();
      this.getEmergencyPlanOptions();
      api.handleCreate(this);
      this.pickerOptions("event");
    },

    //=====表格数据相关=====
    //获取表数据
    getList: function() {
      api.getList(this, emergency, "getEmergencyEventPage");
      this.getBubble();
    },

    // 获取气泡信息
    getBubble: function() {
      this.$store.dispatch("GetBubble").then(() => {});
    },
    // 选中行
    selsChange: function(sels) {
      this.sels = sels;
    },
    //预览操作
    handlePreview: function(row) {
      api.handlePreview(this, row, "", true);
    },
    //刪除按钮操作
    handleDelete: function(row) {
      api.handleDelete(this, emergency, "deleteEmergencyEvent", row);
    },
    //编辑按钮操作
    handleUpdate: function(row) {
      this.getEndConditionOptions();
      this.getEmergencyPlanOptions();
      api.handleUpdate(this, row, "", true);
      this.pickerOptions("event");
    },
    //总结按钮操作
    handleUpdateSummary: function(row) {
      this.handleType = "summary";
      this.getFileList(row.id);
      this.temp = Object.assign({}, row); //初始化表单
      this.dialogStatus = "update"; //对话框状态为编辑
      this.summaryDialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        if (this.$refs.summaryForm) {
          this.$refs.summaryForm.clearValidate(); //清除校验
        }
      });
    },

    handleViewSummary: function(row) {
      this.handleType = "summary";
      this.getFileList(row.id);
      this.temp = Object.assign({}, row); //初始化表单
      this.dialogStatus = "view"; //对话框状态为编辑
      this.summaryDialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        if (this.$refs.summaryForm) {
          this.$refs.summaryForm.clearValidate(); //清除校验
        }
      });
    },

    //判断是否为当前用户
    isCurrentUser: function(name) {
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

    //重置表单项
    resetProcessTemp: function() {
      api.resetProcessTemp(this);
    },

    getEmergencyPlanOptions: function() {
      var that = this;
      that.emergencyPlanOptions = [
        {
          id: "1",
          name: "指导预案1"
        },
        {
          id: "2",
          name: "指导预案2"
        }
      ];
    },

    getEndConditionOptions: function() {
      var that = this;
      emergency.getEndConditionOptions().then(response => {
        var res = notify(that, response, true);
        if (res) {
          that.endConditionOptions = response.data;
        }
      });
    },

    //插入数据
    createData: function() {
      api.createData(this, emergency, "addEmergencyEvent");
    },

    //插入数据
    createDataAjax: function() {
      api.createDataAjax(this, emergency, "addEmergencyEvent");
    },

    //更新数据
    updateData: function() {
      api.updateData(this, emergency, "updateEmergencyEvent");
    },
    //获取过程列表数据
    getProcessList: function(id) {
      api.getProcessList(this, emergency, "getProcessPage", id);
    },

    //=====过程表单相关=====
    handlePreviewProcess: function(row) {
      api.handlePreview(this, row, "process");
    },
    handleUpdateProcess: function(row) {
      api.handleUpdate(this, row, "process");
      this.pickerOptions("process");
    },
    handleDeleteProcess: function(row) {
      api.handleDelete(this, emergency, "deleteProcess", row);
    },
    handleCreateProcess: function() {
      api.handleCreate(this, "process");
      this.pickerOptions("process");
    },
    //插入过程
    createProcess: function() {
      api.createProcess(this, emergency, "addProcess");
    },
    //更新过程
    updateProcess: function() {
      api.updateProcess(this, emergency, "updateProcess");
    },

    //=====总结表单相关=====
    updateSummary: function() {
      api.updateSummary(this, emergency, "updateSummary");
    },
    //总结数据
    summaryData: function() {
      this.$refs.summaryForm.validate(valid => {
        if (valid) {
          var tempData = Object.assign({}, this.temp);
          if (!tempData.files) {
            tempData.files = [];
          }
          emergency.updateSummary(tempData).then(response => {
            var res = notify(this, response);
            if (res) {
              this.summaryDialogFormVisible = false;
              this.getList();
            }
          });
        }
      });
    },

    //=====文件上传相关=====
    // 获取文件列表
    getFileList: function(id, handleType) {
      api.getFileList(
        this,
        emergency,
        "getEmergencyEventFiles",
        id,
        handleType
      );
    },
    // 上传文件回调函数
    uploadCallProcess: function(fileData) {
      api.uploadCall(this, fileData, "process", true);
    },
    // 删除文件回调函数
    removeCallProcess: function(index) {
      this.processTemp.files.splice(index, 1);
    },

    // 上传文件回调函数
    uploadCallSummary: function(fileData) {
      api.uploadCall(this, fileData, "summary");
    },
    // 删除文件回调函数
    removeCallSummary: function(index) {
      this.temp.files.splice(index, 1);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.event {
  //筛选面板
  .filter-container {
    margin-top: 20px;
    text-align: left;
  }

  //操作面板
  .operate-container {
    text-align: left;
  }

  //操作面板
  .process-operate-container {
    text-align: left;
  }

  //数据面板
  .data-container {
    margin-top: 20px;
  }

  //数据面板
  .process-data-container {
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

  .process-form-container {
    .el-form-item__content {
      width: 300px;
      .el-input {
        width: 300px;
      }
    }
  }

  .summary-form-container {
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