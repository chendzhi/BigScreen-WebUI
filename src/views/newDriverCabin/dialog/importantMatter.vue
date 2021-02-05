<template>
  <div>
    <el-dialog
      :title="title && title.specialTitle"
      class="driver-dialog once-dialog"
      :visible.sync="isOpen"
      :before-close="closeDialog"
      :append-to-body="true"
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
                  <el-col class="height100 card-arrow-left" :span="2" @click.native="leftBtn"></el-col>
                  <el-col class="height100 baixing-card-content" :span="20">
                    <div class="baixing-word-title">
                      {{ this.cityList && this.cityList[checkIndex] && this.cityList[checkIndex].shortName }}举措
                    </div>
                    <div class="matter-word">
                      <word-cloud :wordData="wordList"></word-cloud>
                    </div>
                  </el-col>
                  <el-col class="height100 card-arrow-right" :span="2" @click.native="rightBtn"></el-col>
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
// 系统业务
import { parseTime } from "@/utils";
// 系统业务
import { queryData } from "@/api/newDriverCabin/index";
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
    title: {
      type: Object,
      default: () => {}
    },
    cityList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isShowDialog: false,
      checkIndex: 0,
      first: 0,
      isWait: false,
      wordList: [],
      onceLineData: {}
    };
  },
  watch: {
    cityList() {
      this.getDataCityList();
    }
  },
  mounted() {
    this.getChartData();
    this.getDataCityList();
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    leftBtn() {
      if (this.isWait) return;
      if (this.noData()) return;
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
    changeCity(index) {
      if (!this.cityList.length) {
        return;
      }
      if (!this.checkData(index)) {
        return;
      }
      this.checkIndex = index;
      this.filterData(index);
    },
    getDataCityList() {
      this.isWait = true;
      this.wordList = [];
      this.checkIndex = 0;
      queryData({
        tn: 17,
        functionName: "重点关注各州举措17",
        queryParam: `article_id=${this.title.id}`,
        orderParam: "amount=desc",
        resultsFormat: "organ_code"
      }).then(res => {
        this.isWait = false;
        console.log("重点关注各州举措tn:----" + 17);
        let maps = {};
        this.cityList.forEach(ele => {
          if (res[ele.organCode]) {
            maps[ele.organCode] = res[ele.organCode];
          }
        })
        this.hasDataList = maps;
        // console.log(res)
        // console.log(maps)
        this.firstData();
        this.changeCity(this.checkIndex);
      });
    },
    filterData(index) {
      if (this.noData()) return;
      let hasData = this.checkData(index);
      if (!hasData) {
        return;
      }
      let sortArr = hasData.slice(0, 20).map(ele => {
        return {
          name: ele.word + " " + ele.amount,
          value: ele.amount
        };
      });
      this.wordList = sortArr;
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
    checkData(index) {
      if (!this.cityList.length) return;
      return (
        index >= 0 &&
        this.cityList[index] &&
        this.hasDataList[this.cityList[index]["organCode"]]
      );
    },
    getChartData() {
      this.onceLineData = {};
      queryData({
        tn: 16,
        functionName: "重点关注-各州趋势16",
        queryParam: `article_id=${this.title.id}`,
        orderParam: "yearMonth=asc"
      }).then(res => {
        console.log("重点关注-各州趋势tn:----" + 16);
        let xData = [];
        let yData1 = [];
        let yData2 = [];
        res.forEach(ele => {
          xData.push(parseTime(ele.data_time, "{y}-{m}-{d}"));
          yData1.push(ele.news || 0);
          yData2.push(ele.website || 0);
        });
        this.onceLineData = {
          xData,
          yData: [
            yData1,
            yData2
          ]
        }
      });
    },
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
  .matter-line-chart,
  .matter-word {
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
