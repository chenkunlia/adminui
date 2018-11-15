<template>
  <div class="app-container">
    <div class="intake">
      <el-tabs v-model="activeName" style="margin-top:20px">
        <el-tab-pane label="取水信息" name="intake">
          <intake-record></intake-record>
        </el-tab-pane>
        <el-tab-pane label="取水单位信息" name="organ">
          <intake-organ></intake-organ>
        </el-tab-pane>
        <el-tab-pane label="取水征费信息" name="cost">
          <intake-cost></intake-cost>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import intakeRecord from "../intakeRecord";
import intakeOrgan from "../intakeOrgan";
import intakeCost from "../intakeCost";

export default {
  name: "intakeData",
  components: { intakeRecord, intakeOrgan, intakeCost },
  data() {
    return {
      //标签页相关
      activeName: "intake"
    };
  },

  // 周期函数，创建时获取表格数据和参数备选值
  created() {},

  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss">
.intake {
  .filter-container {
    margin-top: 0 !important;
  }
}
</style>