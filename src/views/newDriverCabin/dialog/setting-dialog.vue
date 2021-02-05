<template lang="">
  <div>
    <el-dialog
      title="修改系统名称"
      class="driver-dialog setting-dialog"
      :visible.sync="isOpen"
      :append-to-body="true"
      :before-close="closeDialog">
      <div class="attention-dialog-wrap setting-wrap">
        <el-form ref="form" :model="form" :rules="rules" label-width="90px">
          <el-form-item label="现有名称：">
            {{user && user.productTitle}}
          </el-form-item>
          <el-form-item label="新名称：" prop="name">
            <el-input class="set-input" v-model="form.name" maxlength="10" show-word-limit placeholder="请输入10个字以内的新名称"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" class="set-btn hover-color" @click="submitChange('form')">提交</el-button>
            <el-button type="primary" class="set-btn" @click="cancleChange">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 系统业务
import {
  updateTitle
} from "@/api/newDriverCabin/index";
import {mapGetters} from 'vuex';
export default {
  name: 'setting-dialog',
  props:['isOpen'],
  data(){
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新名称！'));
      } else if (value.length > 10) {
        callback(new Error('请输入10个字以内的新名称！'));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: ''
      },
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods:{
    closeDialog(){
      this.$emit('closeDialog')
    },
    cancleChange() {
      this.closeDialog();
      this.form.name = '';
    },
    submitChange(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.name.trim() === this.user.productTitle) {
            this.$message({
              type: 'warning',
              message: '与原名称一致，请重新填写!'
            })
            return;
          }
          updateTitle({
            functionName: "设置标题",
            customerNo: this.user.customerNo,
            customTitle: this.form.name
          }).then(res => {
            if (!res || !res.customTitle || !res.customerNo) return;
            let user = Object.assign(this.user, {productTitle: res.customTitle});
            this.$store.commit('userSet', user);
            this.closeDialog();
          })
        } else {
          console.log('修改名称失败!');
          return false;
        }
      });
    }
  }
}
</script>
<style lang="scss">
.setting-dialog .el-dialog {
  width: 440px;
  @media (max-width: 992.98px) {
    width: 90%;
  }
  @media (max-width: 768.98px) {
    width: 94%;
    .el-form {
      padding: 0;
    }
    .el-form .set-btn {
      width: 60px;
    }
  }
}
.setting-wrap{
  height: auto;
  .el-form {
    padding: 0 30px;
    color: #fff;
    .el-form-item__label {
      font-weight: normal;
      color: rgba(0,210,255,1);
    }
    .set-input {
      .el-input__inner {
        border-color: rgba(0,210,255,.5);
        background: #0D3686;
        color: #fff;
      }
    }
    .set-btn {
      width: 80px;
      height: 30px;
      background:  rgba(0,210,255,.5);
      &.hover-color {
        color: #0D3686;
        background: rgba(0,210,255,.9);
      }
    }
  }
  .el-input .el-input__count .el-input__count-inner {
    background: transparent;
  }
}
</style>
