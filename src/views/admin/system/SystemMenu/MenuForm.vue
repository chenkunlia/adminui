<template>
    <div class="component">
        <el-dialog :title="title" :visible.sync="visible">
            <el-form ref="dataForm" :rules="rules" :model="v" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="v.menuName" />
                </el-form-item>
                <el-form-item label="上级菜单" prop="menuPid">
                    <el-cascader :options="options" change-on-select></el-cascader>
                </el-form-item>
                <el-form-item label="菜单路径" prop="url">
                    <el-input v-model="v.url" />
                </el-form-item>
                <el-form-item label="菜单Icon" prop="menuIcon">
                    <el-input v-model="v.menuIcon" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="create" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
                <el-button v-else type="primary" @click="updateData">{{ $t('table.reset') }}</el-button>
                <el-button @click="visible = false">{{ $t('table.cancel') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
export default {
  components: {},
  props: {
    create: {
      type: Boolean,
      default:true,
      required: true
    },
    defaultValue: {
      type: Object,
      default:{}
    },
    visible: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Object
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      v: {
        menuId: "",
        menuName: "",
        menuPName: "",
        menuPid: "",
        status: 1,
        url: ""
      },
      options:[],
    };
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    createData:()=>{

    },
    updateData:()=>{

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
