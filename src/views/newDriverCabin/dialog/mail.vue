<template>
  <div>
    <el-dialog
      title="部委来信精选"
      class="driver-dialog mail-dialog"
      :visible.sync="isOpen"
      :before-close="closeDialog"
      :append-to-body="true"
    >
      <div class="mail-dialog-wrap">
        <el-row class="mt15">
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"><div class="mail-tab">来信公示</div></el-col>
        </el-row>

        <el-row class="mt15">
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"><div class="mail-label">标题:</div></el-col>
          <el-col :xs="18" :sm="18" :md="20" :lg="20" :xl="20"
            ><div class="mail-value">
              {{ mailDialogData.letter_title }}
            </div></el-col
          >
        </el-row>

        <el-row class="mt15">
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"><div class="mail-label">来信时间:</div></el-col>
          <el-col  :xs="6" :sm="6" :md="4" :lg="4" :xl="4"
            ><div class="mail-value">{{ mailDialogData.date }}</div></el-col
          >
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"
            ><div class="mail-label txt-center">来信人:</div></el-col
          >
          <el-col  :xs="6" :sm="6" :md="4" :lg="4" :xl="4"
            ><div class="mail-value">
              {{ mailDialogData.sender || "暂无" }}
            </div></el-col
          >
        </el-row>

        <el-row class="mt15">
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"><div class="mail-label">来信内容:</div></el-col>
          <el-col  :xs="18" :sm="18" :md="20" :lg="20" :xl="20"
            ><div class="mail-content" v-html="mailDialogData.letter_info"></div
          ></el-col>
        </el-row>

        <el-row class="mt15">
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"><div class="mail-tab">上诉回复</div></el-col>
        </el-row>
        <el-row class="mt15">
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"><div class="mail-label">回复时间:</div></el-col>
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"
            ><div class="mail-value">
              {{ mailDialogData.reply_date_time }}
            </div></el-col
          >
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"
            ><div class="mail-label txt-center">回复部门:</div></el-col
          >
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"
            ><div class="mail-value">
              {{ mailDialogData.reply_organ || "暂无" }}
            </div></el-col
          >
        </el-row>
        <el-row class="mt15">
          <el-col :xs="6" :sm="6" :md="4" :lg="4" :xl="4"><div class="mail-label">回复内容:</div></el-col>
          <el-col  :xs="18" :sm="18" :md="20" :lg="20" :xl="20"
            ><div class="mail-content" v-html="mailDialogData.reply_info"></div
          ></el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    mailDialogData: {
      type: Object,
      default: () => {
        return {
          letter_title: "",
          date: "",
          sender: "",
          letter_info: "",
          reply_organ: "",
          reply_date_time: "",
          reply_info: ""
        };
      }
    }
  },
  data() {
    return {
      isShowDialog: false,
      customizationBtn: 0
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="scss" scoped>
.mail-dialog {
  ::v-deep.el-dialog {
    width: 50%;
  }
}
@media (max-width: 1366.98px) {
  .mail-dialog {
    ::v-deep.el-dialog {
      width: 60%;
    }
  }
}
@media (max-width: 992.98px) {
  .mail-dialog {
    ::v-deep.el-dialog {
      width: 90%;
    }
  }
}
@media (max-width: 768.98px) {
  .mail-dialog {
    ::v-deep.el-dialog {
      width: 94%;
      .el-dialog__body {
        padding: 10px;
      }
    }
    .mail-label {
      font-size: 12px;
    }
    .mail-value {
      margin-left: 5px;
      font-size: 12px;
    }
    .mail-content {
      font-size: 12px;
    }
  }
}
</style>
