
<template>
  <div class="app-container ">

    <!--筛选条件-->
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="事件标题">
          <el-input v-model="listQuery.title" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="listQuery.name" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker v-model="listQuery.start" clearable type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker v-model="listQuery.end" clearable type="date" placeholder="选择日期">
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
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>

        <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
        </el-table-column>

        <el-table-column label="事件标题" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="handleView(scope.row)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="发生日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startDate }}</span>
          </template>
        </el-table-column>

        <el-table-column label="结束日期" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endDate }}</span>
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
            <el-button v-show="scope.row.status!=1" type="success" size="mini" @click="handleSummary(scope.row)">总结</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <!--分页控件-->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.num" :page-sizes="[10,20,30,50]" :page-size="listQuery.size" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!--添加/编辑弹窗-->
    <div class="form-container">
      <el-dialog :title="processTextMap[dialogStatus]" :visible.sync="processDialogFormVisible">
        <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="100px" :disabled="this.dialogStatus === 'view'">
          <el-form-item label="事件标题" prop="title">
            <el-input v-model="temp.title" clearable :disabled="dialogStatus==='update'" />
          </el-form-item>
          <el-form-item label="事件概要" prop="resume">
            <el-input v-model="temp.resume" clearable />
          </el-form-item>
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker v-model="temp.startDate" clearable type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker v-model="temp.endDate" clearable type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="过程信息">
            <el-input type="textarea" v-model="temp.process" clearable></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <upload :actionUrl='action' :filesList='processFileList' :params='params' :dialogFormVisible='processDialogFormVisible' :dialogStatus='dialogStatus' v-on:uploadCallBack="uploadCall" v-on:removeCallBack="removeCall"></upload>
          </el-form-item>
        </el-form>

        <!--工具栏-->
        <div class="process-operate-container">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreateProcess">添加</el-button>
        </div>

        <!--表格数据-->
        <div class="process-data-container">
          <el-table v-loading="listLoading" :key="tableKey" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">

            <el-table-column type="index" :label="$t('table.id')" width="60" align="center">
            </el-table-column>

            <el-table-column label="信息" align="center">
              <template slot-scope="scope">
                <span class="link-type" @click="handleView(scope.row)">{{ scope.row.title }}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建人" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
              <template slot-scope="scope" align="center">
                <el-button v-show="isCurrentUser(scope.row.name)" type="primary" size="mini" @click="handleUpdateProcess(scope.row)">{{ $t('table.edit') }}</el-button>
                <el-button v-show="isCurrentUser(scope.row.name)" type="danger" size="mini" @click="handleDeleteProcess(scope.row)">{{ $t('table.delete') }}</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button v-show="dialogStatus!=='view'" @click="processDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button v-show="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
          <el-button v-show="dialogStatus=='update'" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
          <el-button v-show="dialogStatus==='view'" @click="processDialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!--总结弹窗-->

    <div class="process-form-container">
      <el-dialog :title="summaryTextMap[dialogStatus]" :visible.sync="summaryDialogFormVisible">
        <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="100px">
          <el-form-item label="总结日期" prop="summaryTime">
            <el-date-picker v-model="temp.summaryTime" clearable type="date" placeholder="选择日期" :disabled="!isCurrentUser(temp.name)">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="总结人" prop="summary">
            <el-input v-model="temp.name" clearable :disabled="!isCurrentUser(temp.name)" />
          </el-form-item>
          <el-form-item label="总结内容">
            <el-input type="textarea" v-model="temp.summary" :disabled="!isCurrentUser(temp.name)"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <upload :actionUrl='action' :filesList='summaryFileList' :params='params' v-on:uploadCallBack="uploadCall" v-on:removeCallBack="removeCall" :disabled="!isCurrentUser(temp.name)"></upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="summaryDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
          <el-button v-else type="primary" @click="summaryData">{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="summary-form-container">
      <el-dialog :title="summaryTextMap[dialogStatus]" :visible.sync="summaryDialogFormVisible">
        <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="100px">
          <el-form-item label="总结日期" prop="summaryTime">
            <el-date-picker v-model="temp.summaryTime" clearable type="date" placeholder="选择日期" :disabled="!isCurrentUser(temp.name)">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="总结人" prop="summary">
            <el-input v-model="temp.name" clearable :disabled="!isCurrentUser(temp.name)" />
          </el-form-item>
          <el-form-item label="总结内容">
            <el-input type="textarea" v-model="temp.summary" :disabled="!isCurrentUser(temp.name)"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <upload :actionUrl='action' :filesList='summaryFileList' :params='params' v-on:uploadCallBack="uploadCall" v-on:removeCallBack="removeCall" :disabled="!isCurrentUser(temp.name)"></upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="summaryDialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
          <el-button v-else type="primary" @click="summaryData">{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>


<script>
import emergency from "@/commons/api/emergency";
import api from "@/commons/api/";

import { removeFilePrefix, docToFile, parseTime } from "@/commons/utils";
import { notify } from "@/commons/utils/notify";
import { eventRules } from "@/commons/utils/validate";
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
      // 账号状态
      EventStatusOptions: {
        1: "有效",
        0: "失效"
      },
      // 筛选条件
      listQuery: {
        num: 1,
        size: 10
      },
      // 重置筛选条件
      resetListQuery: {
        num: 1,
        title: "",
        name: "",
        startDate: "",
        endDate: ""
      },

      // =====表格数据相关=====
      tableKey: 0,
      // 表数据
      list: null,
      // 记录总条数
      total: null,
      // 数据加载标识
      listLoading: true,
      // 列表选中列
      sels: [],

      // =====添加/编辑弹窗相关=====
      // 表单对话框可见状态
      processDialogFormVisible: false,
      summaryDialogFormVisible: false,
      // 对话框状态（编辑还是添加）
      dialogStatus: "",
      // 操作类型（过程或者总结）
      handleType: "",
      // 编辑框标题名称
      processTextMap: {
        update: "编辑应急事件",
        create: "添加应急事件",
        view: "预览应急事件"
      },
      summaryTextMap: {
        update: "编辑事件总结",
        create: "添加事件总结",
        view: "预览事件总结"
      },
      // 表单对话框临时数据
      temp: {},
      // 编辑窗口表单验证规则
      rules: eventRules
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created: function() {
    this.getList(); //获取表数据
  },

  methods: {
    // =====筛选条件相关=====
    // 重置按钮操作
    handleReset: function() {
      api.handleReset(this);
    },
    // 搜索按钮操作
    handleFilter: function() {
      this.listQuery.page = 1; //前往到第一页
      // 开始日期格式转换
      if (this.listQuery.start) {
        this.listQuery.startDate = parseTime(
          this.listQuery.start,
          "{y}-{m}-{d}"
        );
      }
      // 结束日期格式转换
      if (this.listQuery.end) {
        this.listQuery.endDate = parseTime(this.listQuery.end, "{y}-{m}-{d}");
      }
      this.getList(); //刷新表格数据
    },

    //=====工具栏相关=====
    //添加按钮操作
    handleCreate: function() {
      this.handleType = "process";
      this.resetTemp(); //重置表单项
      this.dialogStatus = "create"; //对话框状态为添加
      this.processDialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); //清除校验
      });
    },

    //=====表格数据相关=====

    //获取表数据
    getList: function() {
      api.getList(this, emergency, "getEmergencyEventPage");
    },

    // 选中行
    selsChange: function(sels) {
      this.sels = sels;
    },

    //预览操作
    handleView: function(row) {
      this.handleType = "process";
      this.getFileList(row.id);
      this.temp = Object.assign({}, row); //初始化表单
      this.dialogStatus = "view"; //对话框状态为添加
      this.processDialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); //清除校验
      });
    },

    //刪除按钮操作
    handleDelete: function(row) {
      api.handleDelete(this, emergency, "deleteEmergencyEvent", row);
    },

    //编辑按钮操作
    handleUpdate: function(row) {
      this.handleType = "process";
      this.getFileList(row.id);
      this.temp = Object.assign({}, row); //初始化表单
      this.dialogStatus = "update"; //对话框状态为编辑
      this.processDialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); //清除校验
      });
    },

    //总结按钮操作
    handleSummary: function(row) {
      this.handleType = "summary";
      this.getFileList(row.id);
      this.temp = Object.assign({}, row); //初始化表单
      this.dialogStatus = "update"; //对话框状态为编辑
      this.summaryDialogFormVisible = true; //显示对话框
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate(); //清除校验
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

    //重置表单项
    resetTemp: function() {
      this.temp = {};
      this.temp.files = [];
      this.fileList = [];
    },

    //插入数据
    createData: function() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // 插入文件列表
          emergency.addEmergencyEvent(this.temp).then(response => {
            var res = notify(this, response);
            if (res) {
              this.processDialogFormVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    //更新数据
    updateData: function() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var tempData = Object.assign({}, this.temp);
          if (!tempData.files) {
            tempData.files = [];
          }
          emergency.updateEmergencyEvent(tempData).then(response => {
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
              this.processDialogFormVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    //总结数据
    summaryData: function() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var tempData = Object.assign({}, this.temp);
          tempData.content = tempData.summary;
          tempData.time = tempData.summaryTime;
          if (!tempData.files) {
            tempData.files = [];
          }
          emergency.updateSummary(tempData).then(response => {
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
              this.summaryDialogFormVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    
    //=====文件上传相关=====
    // 上传文件回调函数
    uploadCall: function(fileData) {
      //添加文件信息到files数组中
      if (!this.temp.files) {
        this.temp.files = [];
      }
      if (this.handleType == "summary") {
        fileData.fileType = 2;
        this.summaryFileList.push(removeFilePrefix(docToFile(fileData)));
      } else if (this.handleType == "process") {
        fileData.fileType = 1;
        this.processFileList.push(removeFilePrefix(docToFile(fileData)));
      }
      this.temp.files.push(docToFile(fileData));
    },
    // 删除文件回调函数
    removeCall: function(index) {
      this.temp.files.splice(index, 1);
    }, // 获取文件列表
    getFileList: function(id) {
      var that = this;
      this.queryById.id = id;
      emergency.getEmergencyEventFiles(this.queryById).then(response => {
        var res = notify(that, response, true);
        if (res) {
          if (that.handleType == "summary") {
            that.summaryFileList = removeFilePrefix(response.data); //将接口返回的文件信息格式转换成upload控件识别的格式，去掉‘file’前缀，用于列表展示
            that.temp.files = response.data; //用于数据交互
          } else if (that.handleType == "process") {
            that.processFileList = removeFilePrefix(response.data); //将接口返回的文件信息格式转换成upload控件识别的格式，去掉‘file’前缀，用于列表展示
            that.temp.files = response.data; //用于数据交互
          }
        }
      });
    },
    handleUpdateProcess: function() {},
    handleDeleteProcess: function() {},
    handleCreateProcess: function() {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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

/* 设置文件列表样式 */
.list-group {
  padding: 0;
  .file-name {
    width: auto;
  }
}
</style>