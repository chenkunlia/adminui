<template>
  <div class="component">
    <el-search-table-pagination url="/pms/menu/get_menu_list" :columns="columns" 
     :page-sizes="[10, 20]" border fit row-key="menuId" method="post"
     list-field="data.list" total-field="data.total" page-index-key="pageNum"       
     :formOptions="formOptions">
      <template slot-scope="scope" slot="rowIndex">
        <a>{{ scope.$index +1}}</a>
      </template>
      <template slot-scope="scope" slot="operator">
        <a href="javascript:void()"  @click="edit(scope.row)">修改</a>
      </template>
      <template slot-scope="scope" >
        <div class="operate-container">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="create">新增</el-button>
          <el-button type="primary" icon="el-icon-remove-outline" @click="del(scope)">删除</el-button>
        </div>
      </template>
    </el-search-table-pagination>
    <el-dialog :title="title" :visible.sync="dialogView">
            <el-form ref="dataForm" :rules="rules" :model="v" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="v.menuName" />
                </el-form-item>
                <el-form-item label="上级菜单" prop="menuPid">
                    <el-cascader :options="options" change-on-select :props="defaultProp"></el-cascader>
                </el-form-item>
                <el-form-item label="菜单路径" prop="url">
                    <el-input v-model="v.url" />
                </el-form-item>
                <el-form-item label="菜单Icon" prop="menuIcon">
                    <el-input v-model="v.menuIcon" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button  type="primary" @click="handleCreate">{{ $t('table.confirm') }}</el-button>
                <el-button  type="primary" @click="handleUpdate">{{ $t('table.reset') }}</el-button>
                <el-button @click="dialogView = false">{{ $t('table.cancel') }}</el-button>
            </div>
    </el-dialog>
  </div>
</template>

<script>
import MenuForm from './MenuForm'
import {treeDataTranslate} from '@/commons/utils'
export default {
  components: {MenuForm},
  data() {
    return {
      formOptions: {
        inline: true,
        submitBtnText: "搜索",
        resetBtnText: "重置",
        showResetBtn: true,
        forms: [
          { prop: "menuName", label: "菜单名称" },
          {
            prop: "status",
            label: "状态",
            itemType: "select",
            options: [
              { value: "", label: "全部" },
              { value: 0, label: "禁用" },
              { value: 1, label: "启用" }
            ]
          }
        ]
      },
      columns: [
        { type: "selection", minWidth: 50, align: "center" },
        { label: "序号", minWidth: 180, slotName: "rowIndex" , align: "center" },
        { prop: "menuName", label: "菜单名称", width: 250, align: "center" },
        { prop: "menuPName", label: "上级菜单", width: 250, align: "center" },
        { prop: "url", label: "菜单路径", width: 500, align: "center" },
        { prop: "status", label: "启用/停用", width: 200, align: "center" },
        { prop: "operator", label: "操作", width: 80,  align: "center",slotName:"operator" }
      ],
      dialogView: false,
      dialogTitle:'创建',
      defaultValue:{},
      add:true,
      v:{
        menuId: "",
        menuName: "",
        menuPName: "",
        menuPid: "",
        status: 1,
        url: ""
      },
      options:[],
      rules:{},
      defaultProp:{
        value:'menuId',
        label:'menuName'
      }
    };
  },
  created() {
    this.$axios.post('/pms/menu/get_menu_list').then(({data})=>{
      treeOptions=treeDataTranslate(data.list,'menuId','menuPid')
      this.options=treeOptions
      console.log("tree",treeOptions)
    })
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)

  },
  methods: {
    edit(row) {
      console.log("row:", row);
      this.v=row
      this.dialogView=true
      this.title='编辑菜单'
      this.$notify({
        title: "成功",
        message: "更新成功",
        type: "success",
        duration: 2000
      });
    },
    create(){
      this.dialogView=true
      this.add=true
      this.title='创建菜单'
       console.log("create",row)
    },
    handleCreate(row){
      
      console.log("handleCreate",row)
    },
    handleUpdate(row){
      console.log("handleUpdate",row)
    },
    del(rows){
      console.log("del",rows)
    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
.component {
  margin: 2rem 5rem;
}
.operate-container {
  text-align: left;
}
</style>
