<template>
  <div class="login-container" :style="{backgroundImage:  bgimg }">

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" :style="{backgroundImage:  lgFromImg }" auto-complete="on" label-position="left">

      <div class="title-container">
        <div :style="{backgroundImage:  szdjImg,width:'138px',height:'35px' }" ></div>
        <div :style="{backgroundImage:  ptImg,width:'421px',height:'38px',marginTop:'1rem' }"></div>
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="account">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model="loginForm.account" :placeholder="$t('login.username')" name="account" type="text" auto-complete="on" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="passwordType" v-model="loginForm.password" :placeholder="$t('login.password')" name="password" auto-complete="on" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-row>
        <el-col :span="12">
         <el-checkbox v-model="savePwd" >记住密码</el-checkbox>
        </el-col>
        <el-col :span="12">
          <a  type="text"  @click.native.prevent="handleLogin">忘记密码？</a>
        </el-col>
      </el-row>
      <el-row style="margin-top:1rem;">
        <el-col :span="12">
          <el-button type="primary" style="width:8rem;" @click.native.prevent="handleReset">{{ $t('login.reset') }}</el-button>
        </el-col>
        <el-col :span="12">
          <el-button :loading="loading" type="primary" style="width:8rem;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
import { isvalidUsername } from "@/commons/utils/validate";
import LangSelect from "@/components/LangSelect";
import SocialSign from "./socialsignin";

export default {
  name: "Login",
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: "admin",
        password: "123456"
      },
      loginRules: {
        account: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      bgimg: 'url(' + require('@/assets/images/login/lg_bg.png') + ')',
      lgFromImg: 'url(' + require('@/assets/images/login/form.png') + ')',
      szdjImg: 'url(' + require('@/assets/images/login/szdj.png') + ')',
      ptImg: 'url(' + require('@/assets/images/login/pt.png') + ')',
      savePwd:false
    };
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },

    //登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/" });
              if(this.savePwd){
                    window.sessionStorage.username =  this.loginForm.username;
                    window.sessionStorage.password = this.loginForm.password;
                    localStorage.rmbPassword = true;
              }
            })
            .catch(data => {
              this.$notify.error({
                title: "登录失败！",
                message: data.msg || data,
                duration: 2000
              });
              this.$router.push({ path: "/" });
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //重置方法
    handleReset() {
      this.loginForm = {
        account: "",
        password: ""
      };
    },

    //二维码扫描
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #e5e5e5;
$light_gray: rgb(15, 12, 12);
$cursor: rgb(15, 14, 14);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: $light_gray;
    }
  }
}

/* reset element-ui css */
.login-container {
  
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-top: 1.5rem;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #57697e;
$light_gray: #eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    background-color:#58605f;
    border-radius: 0.7rem;
    margin-top: 11rem;
    height: 408px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    // position: absolute;
    right: 35px;
    bottom: 28px;
    margin-top: 30px;
  }
}
</style>
