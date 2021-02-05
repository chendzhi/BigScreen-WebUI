<template>
  <div class="action-block">
    <div class="block-title">
      <div class="block-title-word">政民聚焦</div>
    </div>
    <div class="fir-block block-bg">
      <div class="block-tab block-tab-top flex align-center justify-between">
        <div class="block-tab-slide">
          <span class="block-tab-word">{{ title }}</span>
        </div>
        <!-- <div
                    class="block-tab-slide block-tab-slide-right flex align-center"
                  >
                    <span class="block-tab-btn">2020</span>
                    <span class="block-tab-btn active-btn">2019</span>
                  </div> -->
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
      </div>

      <div class="word-cloud" @click="openAction">
        <!-- <bounce-word-cloud :wordCloudData="hotWordList"></bounce-word-cloud> -->
        <word-cloud :wordData="hotWordList"></word-cloud>
      </div>
    </div>
    <!-- 行动 -->
    <action
      v-if="isOpenActionDialog"
      :meetYear="year"
      :title="title"
      :yearArr="yearArr"
      :cityList="cityList"
      @closeDialog="isOpenActionDialog = false"
      :isOpen="isOpenActionDialog"
    ></action>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import action from "@/views/newDriverCabin/dialog/action";
import { getRequestYears } from "@/utils";
// 系统业务
import { queryData } from "@/api/newDriverCabin/index";
import wordCloud from "@/components/Echarts/WordCloud";
//图表组件
import bounceWordCloud from "@/views/newDriverCabin/common/bounceWordCloud";
export default {
  name: "action-block",
  components: {
    action,
    bounceWordCloud,
    wordCloud
  },
  data() {
    return {
      isOpenActionDialog: false,
      year: new Date().getFullYear(),
      hotWordList: [],
      yearArr: [],
      hasDataList: {}
    };
  },
  props: {
    queryDatas: {
      type: Object,
      default: () => {
        return {
          type: "ss",
          tn: 35
        };
      }
    },
    title: {
      type: String,
      default: "来信热词"
    },
    showDialog: {
      type: Boolean,
      default: true
    },
    cityList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  created() {
    this.getYear();
  },
  methods: {
    async getYear() {
      this.yearArr = await getRequestYears(this.queryDatas.tn);
      this.year = this.yearArr[0];
      this.getDataCityList(this.year);
    },
    async changeDate(val) {
      this.year = val;
      this.getDataCityList(val);
    },
    openAction() {
      if (!this.showDialog) return;
      this.isOpenActionDialog = true;
    },
    getDataCityList(year) {
      let code = this.user.organCode;
      if (!code) return;
      let { tn, type } = this.queryDatas;
      queryData({
        tn,
        functionName: this.title + tn,
        queryParam: `organ_code=${code},year=${year}`,
        orderParam: "count=desc"
      }).then(res => {
        console.log(`${this.title}tn:----${tn}`);
        // 市州行动
        this.filterData(res|| []);
      });
    },
    filterData(arr = []) {
      let sortArr = arr.map(ele => {
        return {
          name: ele.word,
          value: ele.count
        };
      });
      this.hotWordList = sortArr;
      // this.hotWordList = this.wordFontSize(sortArr);
    },
    // 市州行动
    getHotWord(year) {
      queryData({
        tn: 35,
        functionName: "市州行动35",
        queryParam: `year=${year},organCode=110000`,
        orderParam: "count=desc"
      }).then(res => {
        console.log("市州行动tn:----" + 35);
        let sortArr = res.slice(0, 50).map(ele => {
          return {
            name: ele.word + " " + ele.count,
            value: ele.count
          };
        });
        this.hotWordList = this.wordFontSize(sortArr);
      });
    },
    wordFontSize(list) {
      // 值越大 字体越大，颜色随机 6种字体  6种颜色
      // let deepArr = this.deepArr(list);
      if (!list.length) return [];
      let maxValue = Number(list[0].value);
      let minValue = Number(list[list.length - 1].value);
      let averageNum = Math.ceil((maxValue - minValue) / 6);
      let v1 = minValue + averageNum;
      let v2 = minValue + averageNum * 2;
      let v3 = minValue + averageNum * 3;
      let v4 = minValue + averageNum * 4;
      let v5 = minValue + averageNum * 5;
      let v6 = minValue + averageNum * 6 + 10;
      for (let item of list) {
        item.colorClass = "color" + Math.ceil(Math.random() * 6);
        item.value = Number(item.value);
        var size = "";
        if (item.value <= v1) {
          size = "1";
        } else if (item.value > v1 && item.value <= v2) {
          size = "2";
        } else if (item.value > v2 && item.value <= v3) {
          size = "3";
        } else if (item.value > v3 && item.value <= v4) {
          size = "4";
        } else if (item.value > v4 && item.value <= v5) {
          size = "5";
        } else if (item.value > v4 && item.value <= v6) {
          size = "6";
        }
        item.fsClass = "fs" + size;
      }
      return list;
    }
  }
};
</script>
<style lang="scss"></style>
