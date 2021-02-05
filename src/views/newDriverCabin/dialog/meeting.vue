<template>
  <div>
    <el-dialog
      :title="isCity ? '其他市州常务会关键词' : '其他省常务会关键词'"
      class="driver-dialog meeting-dialog"
      :visible.sync="isOpen"
      :before-close="closeDialog"
      :append-to-body="true"
    >
      <div class="matter-dialog-wrap">
        <div class="flex align-center year-btns">
          <span
            class="block-tab-btn customization-tab-btnl"
            v-for="item in yearArr"
            :key="item"
            :class="{ 'active-btn': year === item }"
            @click="changeYear(item)"
            >{{ item }}</span
          >
          <!-- <span class="block-tab-btn customization-tab-btnr">2019</span> -->
        </div>
        <div class="baixing-card clearfix">
          <el-row type="flex" class="baixing-card-row">
            <el-col class="" :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
              <div class="height100 baixing-card-left">
                <span
                  v-for="(item, index) in cityList"
                  :key="index"
                  class="dep-btn"
                  :class="{
                    'active-btn': checkIndex === index,
                    'active-disabled': !hasDataList[item.organCode]
                  }"
                  @click="changeCity(index)"
                  >{{ item.shortName || item.organName }}</span
                >
              </div>
            </el-col>
            <el-col class="" :xs="24" :sm="24" :md="13" :lg="13" :xl="13">
              <div class="baixing-card-right height100">
                <el-row class="height100">
                  <el-col
                    class="card-arrow-left height100"
                    :span="2"
                    @click.native="leftBtn"
                  ></el-col>
                  <el-col class="baixing-card-content height100" :span="20">
                    <div class="baixing-word-title">
                      {{
                        cityList[checkIndex] && cityList[checkIndex].shortName
                      }}
                    </div>
                    <div class="baixing-word">
                      <word-cloud :wordData="wordList"></word-cloud>
                    </div>
                  </el-col>
                  <el-col
                    class="card-arrow-right height100"
                    :span="2"
                    @click.native="rightBtn"
                  ></el-col>
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
import { mapGetters } from "vuex";
// 系统业务
import { queryData } from "@/api/newDriverCabin/index";
import wordCloud from "@/components/Echarts/WordCloud";
export default {
  name: "meeting",
  components: {
    wordCloud
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    isCity: {
      type: Boolean,
      default: false
    },
    cityList: {
      type: Array,
      default: () => []
    },
    meetYear: {
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
      checkIndex: 0,
      preCheckIndex: "",
      isWait: false,
      year: this.meetYear,
      wordList: [],
      hasDataList: {},
      first: 0
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  watch: {
    cityList() {
      this.getDataCityList(this.year);
    }
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
    changeYear(year) {
      if (this.year === year) return;
      this.year = year;
      this.getDataCityList(year);
    },
    changeCity(index, isYear) {
      if (!this.cityList.length) {
        return;
      }
      if (!this.checkData(index)) {
        return;
      }
      this.checkIndex = index;
      let item = this.cityList[index];
      this.filterData(index);
    },
    getDataCityList(year) {
      let code = this.user.organCode;
      if (!code) return;
      this.isWait = true;
      this.wordList = [];
      this.checkIndex = 0;
      queryData({
        tn: 19,
        functionName: "外省-常务会高频词19",
        queryParam: `organ_code=${code},year=${year},queryType=1,top=20`,
        orderParam: "amount=desc",
        resultsFormat: "organ_code"
      }).then(res => {
        this.isWait = false;
        console.log("外省-常务会高频词tn:----" + 19);
        let maps = {};
        this.cityList.forEach(ele => {
          if (res[ele.organCode]) {
            maps[ele.organCode] = res[ele.organCode];
          }
        });
        this.hasDataList = maps;
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
          name: ele.word,
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
    getWordList(year, code = "110000") {
      queryData({
        tn: 19,
        functionName: "外省会议高频词19",
        queryParam: `organ_code=${code},year=${year}`,
        orderParam: "amount=desc"
      }).then(res => {
        this.isWait = false;
        console.log("会议高频词：" + 19);
        this.wordList = res.map(ele => {
          return {
            name: ele.word,
            value: ele.amount
          };
        });
      });
      // this.wordList = [
      //   { name: "疫情防控", value: 21 },
      //   { name: "经济社会发展", value: 14 },
      //   { name: "安全生产", value: 11 },
      //   { name: "一带一路", value: 10 },
      //   { name: "个体工商户", value: 9 },
      //   { name: "中小企业", value: 9 },
      //   { name: "复工复产", value: 7 },
      //   { name: "新冠肺炎", value: 7 },
      //   { name: "高质量发展", value: 6 },
      //   { name: "专项债券", value: 4 },
      // ];
    }
  }
};
</script>
<style lang="scss">
.meeting-dialog .el-dialog {
  width: 50%;
  .baixing-card {
    height: auto;
  }
  .baixing-card-row {
    height: 300px;
  }
  .baixing-word {
    height: calc(100% - 30px);
  }
  .year-btns {
    margin-bottom: 10px;
  }
}
@media (max-width: 1366.98px) {
  .meeting-dialog .el-dialog {
    width: 60%;
  }
}
@media (max-width: 992.98px) {
  .meeting-dialog .el-dialog {
    width: 90%;
  }
  .el-dialog__body {
    padding: 15px;
  }
  .baixing-card-row {
    display: block;
    & > div {
      margin-top: 10px;
    }
  }
  .baixing-card-right {
    height: 240px;
    padding: 0;
  }
}
@media (max-width: 768.98px) {
  .meeting-dialog .el-dialog {
    width: 94%;
  }
  .baixing-card-left {
    height: 100px;
  }
}
</style>
