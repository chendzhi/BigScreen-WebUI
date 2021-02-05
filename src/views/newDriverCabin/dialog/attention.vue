<template lang="">
  <div>
    <el-dialog
      title="政关注"
      class="driver-dialog attention-dialog"
      :visible.sync="isOpen"
      :before-close="closeDialog"
      :append-to-body="true"
    >
      <div class="attention-dialog-wrap">
        <div class="flex align-center">
          <span
            class="block-tab-btn"
            @click="toWitchDay(i)"
            :class="{ 'active-btn': day === i }"
            v-for="(el, i) in days"
            :key="el"
            >{{ el }}天</span
          >
        </div>
        <div class="attention-ul-wrap">
          <ul class="attention-ul">
            <li>
              <el-row>
                <el-col :span="4">
                  <div class="attention-th no-border">排名</div>
                </el-col>
                <el-col :span="4">
                  <div class="attention-th no-border">省份</div>
                </el-col>
                <el-col :span="4">
                  <div class="attention-th no-border ">
                    <i class="attention-icon mh"></i>
                    政府网站
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="attention-th no-border">
                    <i class="attention-icon wx"></i>微信
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="attention-th no-border">
                    <i class="attention-icon wb"></i>新浪微博
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="attention-th no-border">总数</div>
                </el-col>
              </el-row>
            </li>
            <vue-seamless-scroll
              :data="tableData"
              :class-option="optionSetting"
              class="attention-seamless-warp"
            >
              <li v-for="(item, index) in tableData" :key="index" :class="{'has-start': item.name === user.nickName}">
                <el-row>
                  <el-col :span="4">
                    <div class="attention-td">
                      {{ item.index }}

                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="attention-td">
                      <span class="attention-td-num">
                        <i
                          v-if="item.name === user.nickName"
                          class="el-rate__icon el-icon-star-on start-icon"
                        ></i
                        >{{ item.name }}
                      </span>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="attention-td">{{ item.portal }}</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="attention-td">{{ item.wechat }}</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="attention-td">{{ item.weibo }}</div>
                  </el-col>
                  <el-col :span="4">
                    <div class="attention-td">{{ item.amount }}</div>
                  </el-col>
                </el-row>
              </li>
            </vue-seamless-scroll>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 系统业务
import { queryData } from "@/api/newDriverCabin/index";
import vueSeamlessScroll from "vue-seamless-scroll";
export default {
  name: "attention",
  components: {
    vueSeamlessScroll
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    days: {
      type: Array,
      default: [7, 30]
    },
    isDay: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isShowDialog: false,
      customizationBtn: 0,
      day: this.isDay,
      tableData: []
    };
  },
  computed: {
    ...mapGetters(["user"]),
    optionSetting() {
      return {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 12, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: false, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      };
    }
  },
  created() {
    this.getAttentionData(this.day);
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    toWitchDay(i) {
      this.day = i;
      this.getAttentionData(i);
    },
    // 政关注
    getAttentionData(days) {
      // 1 7天; 2 30天
      let type = days === 0 ? 1 : 2;
      let tableData = [];
      queryData({
        tn: 12,
        functionName: "弹框政关注12",
        queryParam: `type=${type}`,
        orderParam: "amount=desc"
      }).then(res => {
        console.log("弹框政关注tn:----" + 12);
        res.forEach((ele, i) => {
          ele.wechat = ele.wechat || 0;
          ele.weibo = ele.weibo || 0;
          ele.portal = ele.portal || 0;
          ele.amount = ele.amount || 0;
          ele.index = i + 1;
          // if (ele.name === this.user.nickName) {
          //   tableData.unshift(ele);
          // } else {
          //   tableData.push(ele);
          // }
          tableData.push(ele);
        });
        this.tableData = tableData;
      });
    }
  }
};
</script>
<style lang="scss">
$icon1: "~@/assets/images/newDriverCabin/internet.png";
$icon2: "~@/assets/images/newDriverCabin/sina.png";
$icon3: "~@/assets/images/newDriverCabin/wechat.png";
.attention-dialog {
  .el-dialog {
    width: 50%;
    @media (max-width: 1366.98px) {
      width: 60%;
    }
    @media (max-width: 992.98px) {
      width: 80%;
    }
    @media (max-width: 768.98px) {
      width: 94%;
      .el-dialog__body {
        padding: 20px 5px;
      }
      .attention-th {
        font-size: 12px;
      }
    }
  }
}
.attention-ul-wrap {
  overflow: hidden;
}
.no-border {
  border-bottom: 0;
}
.attention-seamless-warp {
  height: 100%;
  overflow: hidden;
  li.has-start {
    background: #1768bd;
    .attention-td {
      font-size: 14px;
      font-weight: bold;
      .attention-td-num {
        position: relative;
        padding: 0 16px;
      }
    }

    .start-icon {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 14px;
      color: rgb(247, 186, 42);
    }
  }
}
.attention-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  margin: -1px 3px 0 0;
  vertical-align: middle;
  &.mh {
    background: url($icon1) no-repeat;
    background-size: 100% 100%;
  }
  &.wx {
    background: url($icon3) no-repeat;
    background-size: 100% 100%;
  }
  &.wb {
    background: url($icon2) no-repeat;
    background-size: 100% 100%;
  }
}
</style>
