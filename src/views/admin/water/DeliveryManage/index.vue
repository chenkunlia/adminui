<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :inline="true">
                <el-row>
                    <el-col>
                        <el-form-item label="批次编号:">
                            <el-input v-model="listQuery.batchCode" placeholder="批次编号" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
                        </el-form-item>
                        <el-form-item label="处理人:">
                            <el-input placeholder="处理人" v-model="listQuery.importName" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="处理时间:">
                          <el-date-picker type="date" placeholder="选择时间" v-model="listQuery.importTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>

                        <el-button class="filter-item" type="primary" :icon="openIcon" @click.native="handleOpen">展开</el-button>
                        <el-button class="filter-item" type="primary" @click.native="handleReset">重置</el-button>
                        <el-button class="filter-item" type="primary" @click.native="handleFilter">{{ $t('table.search') }}</el-button>
                    </el-col>
                </el-row>
                <el-row v-if="open">
                    <el-col>
                        <el-form-item label="问题状态:">
                            <el-select v-model="listQuery.status" placeholder="问题状态" clearable>
                              <el-option label="正常" value="1" ></el-option>
                              <el-option label="异常" value="0" ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="报送状态:">
                            <el-select v-model="listQuery.isSend" placeholder="报送状态" clearable>
                              <el-option label="己报送" value="1" ></el-option>
                              <el-option label="未报送" value="0" ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="报送人:">
                            <el-input placeholder="报送人" v-model="listQuery.sendName" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="报送时间:">
                           <el-date-picker type="date" placeholder="选择时间" v-model="listQuery.sendTime" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

        </div>
        <div class="operate-container">
            <el-button type="info" icon="el-icon-download" @click="handleDownload">下载模板</el-button>
            <el-button type="primary" icon="el-icon-upload" @click="handleImport">数据导入</el-button>
            <el-button type="danger" icon="el-icon-remove-outline" @click="batchRemove" :disabled="this.selectRows.length===0">删除</el-button>
        </div>
        <div class="data-container">
            <el-table v-loading="listLoading" :key="tableKey" height="550" :data="list" border fit highlight-current-row @selection-change="selsChange" style="width: 100%;">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column :label="$t('table.id')" align="center" width="65" type="index">
                </el-table-column>
                <el-table-column label="批次编号" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editWater(scope.row)" >{{scope.row.batchCode}}</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="处理时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.importTime |format('yyyy-MM-dd')}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="处理人" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.importName }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="问题" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status=='1'">正常</span>
                        <span v-else style="color:red;">异常</span>
                    </template>
                </el-table-column>

                <el-table-column label="报送" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.isSend=="1"?'已报送':'未报送' }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="报送时间" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sendTime |format('yyyy-MM-dd')}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="报送人" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sendName }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-success" @click="editWater(scope.row)">修改</el-button>
                        <el-button type="text" icon="el-icon-close" @click="deleteItem(scope.row.batchId)" color="red">删除</el-button>
                        <!-- <a :href="scope.row.docUrl" :download="scope.row.batchCode">
                        </a> -->
                        <el-button type="text" icon="el-icon-download" @click="downWater(scope.row)">下载</el-button>
                        <el-button type="text" icon="el-icon-remove-outline" @click="msgSend(scope.row)">短信报送</el-button>
                        <el-button type="text" v-if="scope.row.isSend=='0'"  @click="sendHistory(scope.row)">报送记录</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>

        <div class="pagination-container">
            <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <message-send v-model="dVisible" :code="rowMessageCode" @success="getList" :id="rowMessageId"></message-send>
        <water-detail v-model="waterV"   :id="rowWaterId" :default-value="row" @success="getList"></water-detail>
        <import-water v-model="importV" @success="getList"></import-water>
        <send-history v-model="historyV" :id="rowHistoryId" ></send-history>
    </div>
</template>

<script>
import {
  getWaterList,
  importWaterList,
  updateReservoirDetail,
  getStattionList,
  getReservoirList,
  getReservoirStationDetail,
  generateSmgContent,
  getCurrentRecipients
} from "@/commons/api/water";
import water  from "@/commons/api/water";
import MessageSend from '../commons/MessageSend'
import WaterDetail from '../commons/WaterDetail'
import ImportWater from '../commons/ImportWater'
import SendHistory from '../commons/SendHistory'
import { parseTime } from "@/commons/utils";
import { download } from "@/commons/utils/request";
export default {
  name: "DutyList",
  components: {
    MessageSend,WaterDetail,ImportWater,SendHistory
  },
  //数据部分
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      selectRows: [],
      // 参数默认值
      listQuery: {
        batchCode: undefined,
        importName: undefined,
        importTime: undefined,
        isSend: undefined,
        sendName: undefined,
        sendTime: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 10
      },

      //操作类型备选值
      positionTypeOptions: {},

      //模块类型备选值
      moduleTypeOptions: {},

      dVisible: false,
      dUrl: "",
      openIcon:'el-icon-arrow-down',
      open:false,
      rowMessageCode:"",rowMessageId:"",rowWaterId:"",rowHistoryId:"",
      row:{},
      waterV:false,
      importV:false,
      historyV:false
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

      getWaterList(this.listQuery).then(response => {
        try {
          this.list = response.data.list;
          this.total = response.data.total;
          this.listLoading=false
        } catch (e) {
          console.log(e);
        }
      });
      setTimeout(() => {
        this.listLoading = false;
      }, 1.5 * 10);
    },
    handleOpen(){
        this.openIcon=this.open?'el-icon-arrow-down':'el-icon-arrow-up'
        this.open=!this.open
    },
    //导入数据
    handleImport(){
      this.importV=true
    },
    //获取操作类型列表
    msgSend(row) {
      this.rowMessageCode=row.batchCode
      this.rowMessageId=row.batchId
      this.dVisible=true
    },

    //下载
    downWater(row){
      let url='/app/file/download'
      // let fileTypes=url.split('.')
      // let fileType=fileTypes[fileTypes.length-1]
      // download(this,row.docUrl,row.batchCode+"."+fileType)
      window.location.href=url+'?docId='+row.docId+"&docName="+row.batchCode+'&type=file'
    },

    //编辑
    editWater(row){
      this.row=row
      this.rowWaterId=row.batchId
      this.waterV=true
    },

    //报送记录
    sendHistory(row){
      this.row=row
      this.rowHistoryId=row.batchId
      this.historyV=true
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
      this.listQuery= {
                      batchCode: undefined,
                      importName: undefined,
                      importTime: undefined,
                      isSend: undefined,
                      sendName: undefined,
                      sendTime: undefined,
                      status: undefined,
                      pageNum: 1,
                      pageSize: 10
                   }
      this.getList();
    },

    //显示每页条数
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleDownload(){
        window.location.href='/app/file/download?docId=water&docName=水雨情导入模板&type=template'
    },
    //跳转页码
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },

    //短信
    //显示人员信息
    editDutyPerson(row) {
      this.row = row;
      this.dVisible = true;
    },

    //新增人员
    handleCreate() {
      console.log("create");
      this.row = {};
      this.dVisible = true;
    },

    //删除一条记录
    deleteItem(id) {
      this.$confirm("确认删除此条记录吗？", "提示", {
        type: "warning"
      }).then(() => {
          water.deleteWater({ids:[id]}).then(() => {
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
      let ids = this.selectRows.map(item => item.id);
      console.log("打印所有选中的用户：" + ids.join(","));
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          let deleteUserInfo = { ids };
          water.deletePersonDetail(deleteUserInfo).then(() => {
            this.getList();
          });
        })
        .catch(() => {});
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