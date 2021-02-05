<template lang="">
  <div>
    <el-dialog
      :title="isCity ? '其他市州来信热词' : '其他省来信热词'"
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
              <span v-for="(item, index) in cityList" :key="index">
                <span
                  class="dep-btn"
                  :class="{
                    'active-btn': checkIndex === index,
                    'active-disabled': !hasDataList[item.organCode]
                  }"
                  @click="changeCity(index)"
                  >{{ item.shortName || item.organName }}</span
                >
                <!-- <span
                  v-if="item.isClick == true"
                  class="dep-btn"
                  :class="{ 'active-btn': actIndex == index }"
                  >{{ item.name }}</span
                >
                <span v-else class="dep-btn-noClick">{{ item.name }}</span> -->
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
                          {{
                            resDataLen > 0 ? cityList[checkIndex].shortName ||
                              cityList[checkIndex].organName : ''
                          }}
                        </div>
                        <div class="action-content-chart">
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
                            {{
                              resDataLen > 1 ? (cityList[next].shortName ||
                                cityList[next].organName) : ''
                            }}
                          </div>
                        </div>
                        <div class="action-content-chart">
                          <words-bar-chart
                            v-if="resDataLen > 1"
                            :setData="lettersData2"
                          ></words-bar-chart>
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
    cityList: {
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
      preCheckIndex: "",
      isWait: false,
      next: 1,
      resDataLen: 0,
      lettersData: {},
      lettersData2: {},
      showBox: false,
      hasDataList: {}
    };
  },
  watch: {
    cityList() {
      this.getDataCityList(this.year);
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    this.getDataCityList(this.year);
    // this.renderLetters();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    leftBtn() {
      if (this.isWait) return;
      if (this.noData()) return;
      if (Object.keys(this.hasDataList).length <= 2) return;
      if (this.checkIndex <= 0) {
        this.checkIndex = this.cityList.length - 1;
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
      if (Object.keys(this.hasDataList).length <= 2) return;
      if (this.checkIndex >= this.cityList.length - 1) {
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
    changeCity(index, isYear) {
      let len = this.cityList.length;
      if (!len) {
        return;
      }
      if (!this.checkData(index)) {
        return;
      }
      let next = index === len - 1 ? 0 : index + 1;
      this.checkIndex = index;
      next = this.choiseNext(next);
      this.next = next;
      let item = this.cityList[index];
      this.filterData(this.checkIndex, "lettersData");
      this.filterData(this.next, "lettersData2");
    },
    choiseNext(next) {
      let len = this.cityList.length;
      if (next > len) {
        next = 0
      }
      if (this.checkData(next)) {
        return next;
      }
      return this.choiseNext(next + 1);
    },
    getDataCityList(year) {
      let code = this.user.organCode;
      if (!code) return;
      this.lettersData = {};
      this.lettersData2 = {};
      this.checkIndex = 0;
      this.isWait = true;
      queryData({
        tn: 9,
        functionName: "市州外省来信热词弹框9",
        // queryParam: `attribution=${code},year=${year},data_type=${this.user.organType}`,
        queryParam: `organ_code=${code},year=${year},queryType=1`,
        orderParam: "amount=desc",
        attribute: '',
        resultsFormat: "organ_code"
      }).then(res => {
        this.isWait = false;
        console.log("市州外省来信热词弹框tn:----" + 9);
        this.resDataLen = Object.keys(res).length;
        let maps = {};
        this.cityList.forEach(ele => {
          if (res[ele.organCode]) {
            // console.log(ele.organCode, res);
            maps[ele.organCode] = res[ele.organCode];
          }
        })
        this.hasDataList = maps;
        this.firstData();
        this.changeCity(this.checkIndex);
      });
    },
    filterData(index, dataName) {
      if (this.noData()) return;
      let hasData = this.checkData(index);
      if (!hasData) {
        return;
      }
      let resData = hasData.slice(0, 5).reverse();
      let yData = [];
      let xData = [];
      resData.forEach(ele => {
        yData.push(ele.word || "--");
        xData.push(ele.amount);
      });
      this[dataName] = {
        xData,
        yData
      };
    },
    firstData() {
      if (this.noData()) return;
      this.first = this.checkIndex = this.cityList.findIndex(
        ele => ele.organCode === Object.keys(this.hasDataList)[0]
      );
    },
    noData() {
      return Object.keys(this.hasDataList).length === 0;
    },
    checkData(index, isNext) {
      if (!this.cityList.length) return;
      return (
        index >= 0 &&
        this.cityList[index] &&
        this.hasDataList[this.cityList[index]["organCode"]]
      );
    },
    getWordList(year, code = "110000", dataName) {
      this.isWait = true;
      queryData({
        tn: 9,
        functionName: "市州来信热词弹框9",
        queryParam: `organ_code=${code},year=${year},data_type=${this.user.organType}`,
        orderParam: "amount=desc",
        resultsFormat: "organ_code"
      }).then(res => {
        this.isWait = false;
        console.log("市州来信热词弹框tn:----" + 9);
        let resData = res.slice(0, 5).reverse();
        let yData = [];
        let xData = [];
        resData.forEach(ele => {
          yData.push(ele.word || "--");
          xData.push(ele.amount);
        });
        this[dataName] = {
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
.action-active {
  box-shadow: 0px 1px 16px #00d2ff;
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
