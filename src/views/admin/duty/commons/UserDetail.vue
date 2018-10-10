<template>
    <div>
        <el-dialog title="人员信息" :visible.sync="dVisible">
            <el-form width="30%" ref="dataForm" :rules="rules" :model="temp" label-width="100px" label-position="left">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="菜单名称" prop="menuName">
                            <el-input v-model="temp.menuName" />
                        </el-form-item>
                        <el-form-item label="上级菜单" proop="menuPId">
                            <el-select v-model="temp.menuPId" value-key="menuPId">
                                <el-option v-for="item in menuSelectOptions" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="菜单路径" prop="url">
                            <el-input v-model="temp.url" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-upload class="avatar-uploader" action="/pms/file/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="temp.imgUrl" :src="temp.imgUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-col>
                </el-row>

                <el-form-item label="菜单图标">
                    <el-input v-model="temp.icon" />
                </el-form-item>
                <el-form-item label="菜单状态" prop="status">
                    <el-select v-model="temp.status" value-key="status">
                        <el-option v-for="(val, key) in statusOptions" :key="key" :label="val" :value="key" />
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
                <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
export default {
  props: {
    dVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    url: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      temp: {
          imgUrl:""
      }
    };
  },
  methods: {
      handleAvatarSuccess(res, file) {
        this.temp.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }

};
</script>

<style>
</style>
