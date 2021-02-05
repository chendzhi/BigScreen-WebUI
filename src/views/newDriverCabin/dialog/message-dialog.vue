<template lang="">
  <div>
    <el-dialog
      class="driver-dialog message-dialog"
      :visible.sync="isOpen"
      :before-close="closeDialog"
      :append-to-body="true"
    >
      <div slot="title">
        <div class="custom-title flex align-center">
          <span
            class="custom-title-tab"
            :class="{ actived: tab === 0 }"
            @click="tabChange(0)"
            >留言板</span
          >
          <span class="split-line">|</span>
          <span
            class="custom-title-tab"
            :class="{ actived: tab === 1 }"
            @click="tabChange(1)"
            >落实情况</span
          >
        </div>
      </div>
      <div class="attention-dialog-wrap setting-wrap" v-show="tab === 0">
        <el-form ref="form" :model="form" :rules="rules" label-width="0">
          <el-form-item label="" prop="name">
            <el-input
              class="set-input"
              type="textarea"
              v-model="form.name"
              maxlength="200"
              show-word-limit
              placeholder="点击留言"
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button
              type="primary"
              class="set-btn hover-color"
              @click="submitChange('form')"
              >提交</el-button
            >
            <el-button type="primary" class="set-btn" @click="cancleChange"
              >取消</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="table-wrap" v-show="tab === 1">
        <el-table :data="tableData" border style="width: 100%" height="260">
          <el-table-column type="index" label="序号" width="50" :resizable="false">
          </el-table-column>
          <el-table-column prop="date" label="提出日期" width="100" :resizable="false">
          </el-table-column>
          <el-table-column prop="opinionInfo" label="内容" :resizable="false">
          </el-table-column>
          <el-table-column prop="progress" label="进度" width="80" :resizable="false"></el-table-column>
          <el-table-column prop="dateEnd" label="预计完成时间" width="120" :resizable="false"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 系统业务
import {
  addMessage,
  queryList
} from "@/api/newDriverCabin/index";
import {mapGetters} from 'vuex';
export default {
  name: "message-dialog",
  props: ["isOpen"],
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入留言！"));
      } else if (value.length > 200) {
        callback(new Error("请输入200个字以内！"));
      } else {
        callback();
      }
    };
    return {
      tab: 0,
      form: {
        name: ""
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }]
      },
      tableData: [
        // {
        //   createTime: '2016-05-02',
        //   opinionInfo: '王小虎上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路',
        //   opinionStatus: '上海市普陀区金沙江路 1518 弄',
        //   updateTime: '2016-05-02'
        // }
      ]
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  created(){
    this.getList();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    cancleChange() {
      this.closeDialog();
      this.form.name = "";
    },
    submitChange(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addMessage({
            functionName: "意见",
            customerNo: this.user.customerNo,
            opinionInfo: this.form.name
          }).then(res => {
            this.$message({
              type: 'success',
              message: '留言成功!'
            })
            this.closeDialog();
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    tabChange(index) {
      this.tab = index;
    },
    getList() {
      if (!this.user || !this.user.customerNo) return;
      queryList({
        functionName: "意见列表",
        customerNo: this.user.customerNo,
      }).then(res => {
        this.tableData = res.map(ele => {
          switch (ele.opinionStatus) {
            case 1:
              ele.progress = '0%';
              break;
            case 2:
              ele.progress = '50%';
              break;
            case 3:
              ele.progress = '100%';
              break;
            default:
              ele.progress = '0%';
              break;
          }
          ele.date = ele.createTime.split(' ')[0];
          ele.dateEnd = ele.updateTime.split(' ')[0];
          return ele;
        });
      })
    }
  }
};
</script>
<style lang="scss">
.message-dialog {
  .el-dialog {
    width: 640px;
    @media (max-width: 992.98px) {
      width: 90%;
    }
    @media (max-width: 768.98px) {
      width: 94%;
    }
  }
}
.custom-title {
  font-size: 16px;
}
.split-line {
  margin: 0 5px;
}
.custom-title-tab {
  cursor: pointer;
  color: rgba(11, 228, 238, 0.5);
  &.actived {
    color: rgba(11, 228, 238, 1);
  }
}
.setting-wrap {
  height: auto;
  .el-form {
    padding: 0 30px;
    color: #fff;
    .el-form-item__label {
      font-weight: normal;
      color: rgba(0, 210, 255, 1);
    }
    .set-input {
      .el-textarea__inner {
        border-color: rgba(0, 210, 255, 0.5);
        background: #0d3686;
        color: #fff;
        height: 192px;
        resize: none;
      }
      .el-input__count {
        background: transparent;
        color: #fff;
      }
    }
    .set-btn {
      width: 80px;
      height: 30px;
      background: rgba(0, 210, 255, 0.5);
      &.hover-color {
        color: #0d3686;
        background: rgba(0, 210, 255, 0.9);
      }
    }
  }
}
.table-wrap {
  .el-table, .el-table tr {
    background: transparent;
  }
  .el-table th {
    background: #0d3686;
    text-align: center;
    font-size: 14px;
    color: rgba(0, 210, 255, 0.9);
    font-weight: normal;
  }
  .el-table td {
    font-size: 12px;
    color:#fff;
    text-align: center;
  }
  .el-table td:nth-of-type(3) {
    min-width: 150px;
    text-align: left;
  }
  .el-table--group, .el-table--border, .el-table--border th, .el-table--border td {
    border-color:  rgba(0, 210, 255, 0.5);
  }
  .el-table--group::after, .el-table--border::after, .el-table::before {
    background-color: rgba(0, 210, 255, 0.5);
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: rgba(0, 210, 255, 0.1);
  }
}
</style>
