<template>
  <div>
    <el-dialog
      title="一件事一次办"
      class="driver-dialog once-dialog"
      :visible.sync="isOpen"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <div class="matter-dialog-wrap">
        <div class="baixing-card clearfix">
          <el-row class="height100">
            <el-col
              class="height100"
              :xs="24"
              :sm="12"
              :md="12"
              :lg="12"
              :xl="12"
            >
              <div class="height100 baixing-card-left" style="padding:0px;">
                <div class="baixing-word-title">{{ "传播走势" }}</div>
                <div class="matter-line-chart">
                  <once-line-chart :setData="onceLineData"></once-line-chart>
                </div>
              </div>
            </el-col>
            <el-col
              class="height100"
              :xs="24"
              :sm="12"
              :md="12"
              :lg="12"
              :xl="12"
            >
              <div class="height100 baixing-card-right">
                <el-row class="height100">
                  <el-col class="height100 card-arrow-left" :span="2"></el-col>
                  <el-col class="height100 baixing-card-content" :span="20">
                    <div class="baixing-word-title">{{ "各省举措" }}</div>
                    <div class="matter-word">
                      <word-cloud :wordData="wordList"></word-cloud>
                    </div>
                  </el-col>
                  <el-col class="height100 card-arrow-right" :span="2"></el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import onceLineChart from "@/components/Echarts/vue-echart/once-line-chart";
import wordCloud from "@/components/Echarts/WordCloud";
export default {
  name: "oneMatterOneDeal",
  components: {
    wordCloud,
    onceLineChart
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    onceLineData: {
      type: Object,
      default: () => {
        return {
          xData: ["2020-09", "2020-09", "2020-09", "2020-09"],
          yData: [
            [300, 20, 400, 130],
            [30, 200, 40, 13]
          ]
        };
      }
    }
  },
  data() {
    return {
      isShowDialog: false,
      customizationBtn: 0,
      list: [
        { id: 0, name: "名称" },
        { id: 0, name: "名称" },
        { id: 0, name: "名称" },
        { id: 0, name: "名称" },
        { id: 0, name: "名称" },
        { id: 0, name: "名称" },
        { id: 0, name: "名称" },
        { id: 0, name: "名称" },
        { id: 0, name: "名称" },
        { id: 0, name: "名称" }
      ],
      wordList: []
    };
  },
  mounted() {
    this.getChartData();
    this.getWordList();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    getChartData() {},
    getWordList() {
      this.wordList = [
        { name: "疫情防控", value: 21 },
        { name: "经济社会发展", value: 14 },
        { name: "安全生产", value: 11 },
        { name: "一带一路", value: 10 },
        { name: "个体工商户", value: 9 },
        { name: "中小企业", value: 9 },
        { name: "复工复产", value: 7 },
        { name: "新冠肺炎", value: 7 },
        { name: "高质量发展", value: 6 },
        { name: "专项债券", value: 4 }
      ];
    }
  }
};
</script>
<style lang="scss" scoped>
.once-dialog {
  ::v-deep.el-dialog {
    width: 50%;
  }
  .baixing-card {
    height: 250px;
  }
  .baixing-card-right {
    overflow: hidden;
    height: 100%;
  }
  .matter-line-chart, .matter-word {
    height: calc(100% - 30px);
  }
}
@media (max-width: 1366.98px) {
  .once-dialog {
    ::v-deep.el-dialog {
      width: 60%;
    }
  }
}
@media (max-width: 992.98px) {
  .once-dialog {
    ::v-deep.el-dialog {
      width: 90%;
    }
    .baixing-card-right {
      padding-left: 10px;
    }
  }
}
@media (max-width: 768.98px) {
  .once-dialog {
    ::v-deep.el-dialog {
      width: 94%;
    }
    .baixing-card-left {
      height: 94%;
    }
    .baixing-card-right {
      padding-left: 0;
    }
    .baixing-card {
      height: 70vh;
      & > ::v-deep.el-row > div {
        height: 50%;
      }
    }
  }
}
</style>
