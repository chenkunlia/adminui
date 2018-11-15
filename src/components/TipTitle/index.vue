<template>
    <div class="log-row">
            <el-row class="row-tip" style="">
              <el-col :span="6">
                <label class="log-title">{{title}}</label>
              </el-col>
            </el-row>
           <slot></slot>
          </div>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:''
        }
    }
}
</script>

<style>
.log-row {
  margin-top: 0.5rem;
}
.row-tip{
  margin-bottom: 1rem;
  text-align: left;
  border-bottom: 1px solid #dcdfe6;
}
.log-title {
  background-color: #e2e6eb;
  margin-left: 3px;
  font-size: 1.3rem;

}
</style>


