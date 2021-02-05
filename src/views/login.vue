<template>
  <div class="login" :style="'background-image:url('+ Background +');'">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
      <el-form-item prop="organCode">
        <el-input v-model="loginForm.organCode" type="text" auto-complete="off" placeholder="机构编码">
        </el-input>
      </el-form-item>
      <el-form-item prop="productCode">
        <el-select v-model="loginForm.productCode" placeholder="请选择产品" style="width: 100%;">
          <el-option v-for="item in product" :key="item.code" :label="item.title" :value="item.code"></el-option>
        </el-select>
        </el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { encrypt } from '@/utils/rsaEncrypt'
import enumConf from '@/config/enum'
import settings from '@/settings'
import Background from '@/assets/images/background.jpg'
export default {
  name: 'Login',
  data() {
    return {
      Background: Background,
      loginForm: {
        organCode: '',
        productCode: settings.product.integration.code
      },
      loginRules: {
        organCode: [{ required: true, trigger: 'blur', message: '机构编码必填' }],
        productCode: [{ required: true, trigger: 'blur', message: '产品编码必填' }]
      },
      loading: false,
      product: settings.product
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', {
            organCode: this.loginForm.organCode,
            productCode: this.loginForm.productCode
          }).then(res => {
            this.loading = false
            // 跳转
            // 驾驶舱大屏有3个路径跳转单独处理
            let user = res.user
            let productNo = this.loginForm.productCode
            if (productNo === settings.product.driverCabin.code) {
              // organType  1部委 2省|直辖市 3市
              if (user.organType === enumConf.common.organType.department) {
                this.$router.push(`/product/${productNo}/department`)
              } else if (user.organType === enumConf.common.organType.province) {
                this.$router.push(`/product/${productNo}/province`)
              } else if (user.organType === enumConf.common.organType.city) {
                this.$router.push(`/product/${productNo}/city`)
              }
            } else {
              this.$router.push(`/product/${productNo}`)
            }
          }).catch(res => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-size: cover;
  }
  .title {
    margin: 0 auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 385px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon{
      height: 39px;width: 14px;margin-left: 2px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    display: inline-block;
    height: 38px;
    float: right;
    img{
      cursor: pointer;
      vertical-align:middle
    }
  }

@media (max-width: 768.98px) {
    .login-form {
        border-radius: 6px;
        background: #ffffff;
        width: 90%;
        padding: 25px 25px 5px 25px;
    }
  }
</style>
