<template lang="">
  <div>
    <el-dialog
      :title="isCity ? '市内区县来信热词' : '省内市州来信热词'"
      class="driver-dialog hot-word-dialog"
      :visible.sync="isOpen"
      :before-close="closeDialog"
      :append-to-body="true"
    >
      <div class="hotWordInside-wrap">
        <div class="flex align-center">
          <span
            class="block-tab-btn"
            v-for="item in yearArr"
            :key="item"
            :class="{ 'active-btn': year === item }"
            @click="changeYear(item)"
            >{{ item }}</span
          >
          <!-- <span class="block-tab-btn active-btn">2020</span>
          <span class="block-tab-btn">2019</span> -->
        </div>
        <div class="action-wrap hot-word-wrap">
          <div>
            <div class="dep-btn-wrap">
              <span v-for="(item, index) in subCityList" :key="index">
                <!-- <span
                  v-if="item.isClick == true"
                  class="dep-btn"
                  :class="{ 'active-btn': actIndex == index }"
                  >{{ item.organName }}</span
                > -->
                <span
                  class="dep-btn"
                  :class="{ 'active-btn': checkIndex === index, 'active-disabled': !hasDataList[item.organCode] }"
                  @click="changeCity(index)"
                  >{{ item.shortName || item.organName }}</span
                >
                <!-- <span v-else class="dep-btn-noClick">{{ item.organName }}</span> -->
              </span>
            </div>

            <div class="action-content">
              <el-row class="height100">
                <el-col
                  class="height100 card-arrow-left"
                  :span="2"
                  @click.native="leftBtn"
                >
                </el-col>
                <el-col
                  class="height100"
                  style="width: calc(100% - 30px);"
                  :span="20"
                >
                  <el-row class="height100">
                    <el-col
                      class="height100 action-first-wrap"
                      :xs="24"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="12"
                    >
                      <div class="action-first height100">
                        <div class="action-title">
                          {{ "来信热词" }}
                        </div>
                        <div class="action-content-chart">
                          <span class="count">热词共{{ wordCount }}个</span>
                          <words-bar-chart
                            :setData="lettersData"
                          ></words-bar-chart>
                        </div>
                      </div>
                    </el-col>

                    <el-col
                      class="height100 action-second-wrap"
                      :xs="24"
                      :sm="12"
                      :md="12"
                      :lg="12"
                      :xl="12"
                    >
                      <div class="action-second height100">
                        <div>
                          <div class="action-title">
                            {{ "来信趋势" }}
                          </div>
                        </div>
                        <div class="action-content-chart">
                          <span class="count"
                            >相关信件共{{ letterCount }}个</span
                          >
                          <letter-line-chart
                            :setData="lineData"
                          ></letter-line-chart>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col
                  class="height100 card-arrow-right"
                  :span="2"
                  @click.native="rightBtn"
                >
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 系统业务
import { parseTime } from "@/utils";
import { queryData } from "@/api/newDriverCabin/index";
//图表组件
import wordsBarChart from "@/components/Echarts/vue-echart/words-bar-chart";
import letterLineChart from "@/components/Echarts/vue-echart/letter-line-chart";
export default {
  components: {
    wordsBarChart,
    letterLineChart
  },
  props: {
    subCityList: {
      type: Array,
      default: []
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    isCity: {
      type: Boolean,
      default: false
    },
    currentYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    yearArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isShowDialog: false,
      customizationBtn: 0,
      year: this.currentYear,
      checkIndex: 0,
      first: 0,
      isWait: false,
      lettersData: {},
      lineData: {},
      wordCount: 0,
      letterCount: 0,
      hasDataList: {}
    };
  },
  watch: {
    subCityList() {
      this.getDataCityList(this.year);
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    this.getDataCityList(this.year);
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    leftBtn() {
      if (this.isWait) return;
      if (this.noData()) return;
      if (this.checkIndex <= 0) {
        this.checkIndex = this.subCityList.length - 1;
      } else {
        this.checkIndex--;
      }
      if (!this.checkData(this.checkIndex)) {
        this.leftBtn();
        return;
      }
      this.changeCity(this.checkIndex);
    },
    rightBtn() {
      if (this.isWait) return;
      if (this.noData()) return;
      if (this.checkIndex >= this.subCityList.length - 1) {
        this.checkIndex = this.first;
      } else {
        this.checkIndex++;
      }
      if (!this.checkData(this.checkIndex)) {
        this.rightBtn();
        return;
      }
      this.changeCity(this.checkIndex);
    },
    changeYear(year) {
      if (this.year === year) return;
      this.year = year;
      this.getDataCityList(year);
    },
    async changeCity(index) {
      if (!this.subCityList.length) {
        return;
      }
      if (!this.checkData(index)) {
        return;
      }
      if (this.checkData(index)) {
        this.lettersData = {};
        this.lineData = {};
        this.wordCount = 0;
        this.letterCount = 0;
      }
      this.checkIndex = index;
      let item = this.subCityList[index];
      this.isWait = true;
      // await this.getWordList(this.year, item["organCode"]);
      this.filterData(index);
      await this.getLineData(this.year, item["organCode"]);
      this.isWait = false;
    },
    getDataCityList(year) {
      let code = this.user.organCode;
      if (!code) return;
      this.lettersData = {};
      this.lineData = {};
      this.wordCount = 0;
      this.letterCount = 0;
      this.checkIndex = 0;
      this.isWait = true;
      queryData({
        tn: 9,
        functionName: "省内来信弹框9",
        queryParam: `organ_code=${code},year=${year},queryType=2`,
        orderParam: "amount=desc",
        attribute: '',
        resultsFormat: "organ_code"
      }).then(res => {
        this.isWait = false;
        console.log("省内来信tn:----" + 9);
        let maps = {};
        this.subCityList.forEach(ele => {
          if (res[ele.organCode]) {
            maps[ele.organCode] = res[ele.organCode];
          }
        })
        this.hasDataList = maps;
        this.firstData();
        this.changeCity(this.checkIndex);
      });
    },
    filterData(index) {
      if (this.noData()) return;
      let hasData = this.checkData(index);
      if (!hasData) {
        this.wordCount = 0;
        return;
      }
      this.wordCount = hasData
        .map(ele => (ele.amount && ele.amount) || 0)
        .reduce((pre, cur) => {
          return pre + cur;
        });

      let resData = hasData.slice(0, 5).reverse();
      let yData = [];
      let xData = [];
      resData.forEach(ele => {
        yData.push(ele.word || "--");
        xData.push(ele.amount);
      });
      this.lettersData = {
        xData,
        yData
      };
    },
    firstData() {
      if (this.noData()) return;
      this.first = this.checkIndex = this.subCityList.findIndex(
        ele => ele.organCode === Object.keys(this.hasDataList)[0]
      );
    },
    noData() {
      return Object.keys(this.hasDataList).length === 0;
    },
    checkData(index) {
      if (!this.subCityList.length) return;
      return (
        index >= 0 &&
        this.subCityList[index] &&
        this.hasDataList[this.subCityList[index]["organCode"]]
      );
    },
    getWordList(year, code = "110000") {
      queryData({
        tn: 9,
        functionName: "市州来信热词弹框9",
        // queryParam: `year=${year},attribution=${code},data_type=${this.user.organType}`,
        // orderParam: "amount=desc"
        queryParam: `parent_code=${code},year=${year}`,
        orderParam: "amount=desc",
        attribute: '',
        // resultsFormat: "attribution"
      }).then(res => {
        console.log("市州来信热词弹框tn:----" + 9);
        if (!res.length) {
          this.wordCount = 0;
        } else {
          this.wordCount = res
            .map(ele => (ele.amount && ele.amount) || 0)
            .reduce((pre, cur) => {
              return pre + cur;
            });
        }
        let resData = res.slice(0, 5).reverse();
        let yData = [];
        let xData = [];
        resData.forEach(ele => {
          yData.push(ele.word || "--");
          xData.push(ele.amount);
        });
        this.lettersData = {
          xData,
          yData
        };
      });
    },
    getLineData(year, code = "110000") {
      let type = this.user.organType;
      // if (!code) return;
      this.letterCount = 0;
      this.lineData = {};
      queryData({
        tn: 10,
        functionName: "市州来信趋势弹框10",
        // queryParam: `year=${year},attribution=${code},data_type=ss`,
        // orderParam: "month=asc"
        queryParam: `year=${year},organ_code=${code},queryType=2`,
        orderParam: "month=asc",
        attribute: '',
      }).then(res => {
        console.log("市州来信趋势弹框tn:----" + 10);
        if (res.length) {
          this.letterCount = res
            .map(ele => (ele.amount && ele.amount) || 0)
            .reduce((pre, cur) => {
              return pre + cur;
            });
        } else {
          this.letterCount = 0;
        }

        let resData = res.slice(0, res.length);
        let xData = [];
        let yData = [];
        resData.forEach(ele => {
          // xData.push(parseTime(ele.data_time, "{y}-{m}"));
          xData.push(ele.year + "-" + ele.month);
          yData.push(ele.amount);
        });
        this.lineData = {
          xData,
          yData
        };
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.hot-word-dialog {
  ::v-deep.el-dialog {
    width: 50%;
  }
}
.action-first {
  box-shadow: none;
}
.hot-word-wrap {
  height: auto;
}
.dep-btn-wrap {
  max-height: 120px;
  overflow-y: auto;
}
.action-content-chart {
  position: relative;
  padding-top: 20px;
  .count {
    position: absolute;
    left: 20px;
    top: 10px;
    color: #00d2ff;
    font-size: 12px;
  }
}
@media (max-width: 1366.98px) {
  .hot-word-dialog {
    ::v-deep.el-dialog {
      width: 60%;
    }
  }
}
@media (max-width: 992.98px) {
  .hot-word-dialog {
    ::v-deep.el-dialog {
      width: 90%;
    }
  }
  .dep-btn-wrap {
    max-height: 80px;
    overflow-y: auto;
  }
}
@media (max-width: 768.98px) {
  .hot-word-dialog {
    ::v-deep.el-dialog {
      width: 94%;
    }
  }
  .dep-btn-wrap {
    padding: 5px;
    span {
      font-size: 12px;
    }
  }

  .action-content {
    height: 54vh;
    .action-content-chart {
      height: calc(100% - 30px);
      padding-top: 10px;
    }
    .action-first-wrap,
    .action-second-wrap {
      height: calc(50% - 5px);
      padding: 0;
    }
    .action-second-wrap {
      margin-top: 10px;
    }
  }
}
</style>
