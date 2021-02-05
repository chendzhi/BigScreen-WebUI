<template>
  <div>
    <el-dialog
      :title="title"
      class="driver-dialog action-dialog"
      :visible.sync="isOpen"
      :append-to-body="true"
      :before-close="closeDialog"
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
          <!-- <span class="block-tab-btn customization-tab-btnl active-btn">7天</span>
          <span class="block-tab-btn customization-tab-btnr">30天</span> -->
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
                    'active-btn': checkIndex == index,
                    'active-disabled': !hasDataList[item.organCode]
                  }"
                  @click="changeCity(index)"
                  >{{ item.shortName || item.organName }}</span
                >
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="13" :lg="13" :xl="13">
              <div class="height100 baixing-card-right">
                <el-row class="height100">
                  <el-col
                    class="height100 card-arrow-left"
                    :span="2"
                    @click.native="leftBtn"
                  ></el-col>
                  <el-col class="height100 baixing-card-content" :span="20">
                    <div class="baixing-word-title">
                      {{
                        cityList[checkIndex] &&
                          (cityList[checkIndex].shortName ||
                            cityList[checkIndex].organName)
                      }}
                    </div>
                    <div class="baixing-word">
                      <word-cloud :wordData="wordList"></word-cloud>
                    </div>
                  </el-col>
                  <el-col
                    class="height100 card-arrow-right"
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
  components: {
    wordCloud
  },
  props: {
    isOpen: {
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
    },
    title: {
      type: String,
      default: '市州行动'
    }
  },
  data() {
    return {
      checkIndex: 0,
      first: 0,
      isWait: false,
      year: this.meetYear,
      wordList: [],
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
      this.filterData(index);
    },
    getDataCityList(year) {
      let code = this.user.organCode;
      if (!code) return;
      this.isWait = true;
      this.wordList = [];
      this.checkIndex = 0;
      queryData({
        tn: 35,
        functionName: "市州行动弹框35",
        queryParam: `attribute=${code},year=${year},queryType=2`,
        orderParam: "amount=desc",
        resultsFormat: "organ_code"
      }).then(res => {
        this.isWait = false;
        console.log("市州行动tn:----" + 35);
        let maps = {};
        this.cityList.forEach(ele => {
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
        return;
      }
      let sortArr = hasData.map(ele => {
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
      this.isWait = true;
      queryData({
        tn: 35,
        functionName: "市州行动弹框35",
        queryParam: `year=${year},organCode=${code}`,
        orderParam: "count=desc"
      }).then(res => {
        this.isWait = false;
        console.log("市州行动tn:----" + 35);
        let sortArr = res.slice(0, 50).map(ele => {
          return {
            name: ele.word + " " + ele.count,
            value: ele.count
          };
        });
        this.wordList = sortArr;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.action-dialog ::v-deep.el-dialog {
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
  .action-dialog ::v-deep.el-dialog {
    width: 60%;
  }
}
@media (max-width: 992.98px) {
  ::v-deep.el-dialog__body {
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
  .action-dialog ::v-deep.el-dialog {
    width: 94%;
  }
  .baixing-card-left {
    height: 100px;
  }
}
</style>
