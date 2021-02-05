<template>
    <div class="mail-block block-bg">
      <div class="block-tab block-tab-top flex align-center justify-between">
        <div class="block-tab-slide flex align-center">
          <span class="block-tab-word">来信热词</span>
          <span @click="openOtherLetters" class="others-btn big-btn-bg"
            >{{isCity ? '市州热词' : '外省热词'}}</span
          >
        </div>
        <el-select
          class="map-select meet-select"
          @change="changeDate"
          v-model="year"
          placeholder="请选择"
        >
          <el-option
            v-for="item in yearArr"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <!-- <div
                  class="block-tab-slide block-tab-slide-right flex align-center"
                >
                  <span class="block-tab-btn active-btn">2020</span>
                  <span class="block-tab-btn">2019</span>
                </div> -->
      </div>
      <div @click="openHotWordInside" class="letters-chart">
        <words-bar-chart :setData="lettersData"></words-bar-chart>
      </div>
    <!-- 其他外省 -->
    <other-letters
      v-if="isOpenOtherLettersDialog"
      :currentYear="year"
      :yearArr="yearArr"
      :cityList="cityList"
      :isCity="isCity"
      @closeDialog="isOpenOtherLettersDialog = false"
      :isOpen="isOpenOtherLettersDialog"
    ></other-letters>
    <!-- 省内来信 -->
    <hot-word-inside
      v-if="isShowhHotWordInsideDialog"
      :currentYear="year"
      :yearArr="yearArr"
      :isCity="isCity"
      :subCityList="subCityList"
      @closeDialog="isShowhHotWordInsideDialog = false"
      :isOpen="isShowhHotWordInsideDialog"
    ></hot-word-inside>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// 系统业务
import {
  queryData,
} from "@/api/newDriverCabin/index";
import { getRequestYears } from "@/utils";
import otherLetters from "@/views/newDriverCabin/dialog/otherLetters";
import hotWordInside from "@/views/newDriverCabin/dialog/hotWordInside";
//图表组件
import wordsBarChart from "@/components/Echarts/vue-echart/words-bar-chart";
export default {
  name: 'right-mail-block',
  components: {
    otherLetters,
    hotWordInside,
    wordsBarChart
  },
  data() {
    return {
      isOpenOtherLettersDialog: false,
      isShowhHotWordInsideDialog: false,
      year: new Date().getFullYear(),
      yearArr: [],
      lettersData: {}
    }
  },
  props: {
    cityList: {
      type: Array,
      default: []
    },
    subCityList: {
      type: Array,
      default: []
    }
  },
  computed: {
    ...mapGetters(["user"]),
    isCity() {
      let city = ['北京市', '天津市', '上海市', '重庆市'];
      // 0 ? '市州' : '省';
      return (this.user.organName.indexOf('市') > -1) && !city.includes(this.user.organName) ? true : false;
    }
  },
  created(){
    this.getYear();
  },
  methods: {
    async getYear() {
      this.yearArr = await getRequestYears(9);
      this.year = this.yearArr[0];
      this.getDataCityList(this.year)
    },
    changeDate(val) {
      this.year = val;
      this.getDataCityList(this.year)
    },
    openOtherLetters() {
      this.isOpenOtherLettersDialog = true;
    },
    openHotWordInside() {
      this.isShowhHotWordInsideDialog = true;
    },
    getDataCityList(year) {
      let code = this.user.organCode;
      if (!code) return;
      queryData({
        tn: 9,
        functionName: "来信热词9",
        // queryParam: `attribution=${code},year=${year},data_type=${this.user.organType}`,
        queryParam: `organ_code=${code},year=${year}`,
        orderParam: "amount=desc",
        resultsFormat: "organ_code"
      }).then(res => {
        console.log("来信热词tn:----" + 9);
        this.filterData(res[code] || []);
      });
    },
    filterData(list) {
      let resData = list.slice(0, 5).reverse();
      let yData = [];
      let xData = [];
      resData.forEach(ele => {
        yData.push(ele.word || "--");
        xData.push(ele.amount || 0);
      });
      this.lettersData = {
        xData,
        yData
      };
    },
    //来信热词
    getLetters(year, code = "110000") {
      queryData({
        tn: 9,
        functionName: "来信热词9",
        queryParam: `organ_code=${code},year=${year},data_type=ss`,
        orderParam: "amount=desc"
      }).then(res => {
        console.log("来信热词：----9");
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
  }
}
</script>
