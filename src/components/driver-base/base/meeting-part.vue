<template>
  <div class="meeting-content">
    <div class="meeting-pag-left">
      <div class="meeting-title-wrap txt-center clearfix">
        <span class="meeting-bgs"></span>
        <span class="meeting-tab-title">透视常务会</span>
        <div class="meeting-btns flex align-center">
          <span @click="openMetting" class="meet-more-other big-btn-bg"
            >{{isCity ? '市州常务会' : '外省常务会'}}</span
          >
          <span class="meet-more" @click="onMore">更多>></span>
        </div>
      </div>
      <div class="meeting-chart">
        <el-row class="height100">
          <el-col class="height100" :xs="14" :sm="5" :md="5" :lg="5" :xl="4">
            <div class="meeting-date">
              <span class="meet-high-word">高频词</span>
              <el-select
                class="map-select meet-select"
                @change="changeMeetDate"
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
              <div class="meet-word">共召开</div>
              <div class="meet-counts">
                {{ meetingNumber }}
                <span class="meet-unit">次</span>
              </div>
              <div class="meet-name">常务会</div>
            </div>
          </el-col>
          <el-col
            class="height100"
            :xs="24"
            :sm="19"
            :md="19"
            :lg="19"
            :xl="20"
          >
            <div class="height100 meet-chart-xs">
              <meet-chart :setData="meetData"></meet-chart>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 常务会 -->
    <meeting
      v-if="isOpenMeetingDialog"
      :meetYear="year"
      :isCity="isCity"
      :yearArr="yearArr"
      :cityList="cityList"
      @closeDialog="isOpenMeetingDialog = false"
      :isOpen="isOpenMeetingDialog"
    ></meeting>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// 系统业务
import { queryData } from "@/api/newDriverCabin/index";
import { getRequestYears } from "@/utils";
import meeting from "@/views/newDriverCabin/dialog/meeting";
import meetChart from "@/components/Echarts/vue-echart/meet-chart";
export default {
  name: "meeting-part",
  components: {
    meeting,
    meetChart
  },
  data() {
    return {
      isOpenMeetingDialog: false,
      year: new Date().getFullYear(),
      yearArr: [],
      meetingNumber: 0,
      meetData: []
    };
  },
  props: {
    cityList: {
      type: Array,
      default: () => []
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
  created() {
    this.getYear();
  },
  methods: {
    async getYear() {
      let res = await getRequestYears(18);
      this.yearArr = res.filter(ele => ele > 2018);
      this.year = this.yearArr[0];
      // 气泡图
      this.getScatterData(this.year);
      this.getMeetNum(this.year);
    },
    changeMeetDate(val) {
      this.meetYear = val;
      // 气泡图
      this.getScatterData(this.year);
      this.getMeetNum(this.year);
    },
    openMetting() {
      this.isOpenMeetingDialog = true;
    },
    getMeetNum(year) {
      let code = this.user.organCode;
      if (!code) return;
      queryData({
        tn: 18,
        functionName: "开常务会次数18",
        queryParam: `year=${year}`,
        orderParam: ""
      }).then(res => {
        console.log("会议记录：" + 18);
        this.meetingNumber = res[0] && res[0].amount || 0;
      });
    },
    // 初始化气泡图
    getScatterData(year) {
      let code = this.user.organCode;
      if (!code) return;
      queryData({
        tn: 19,
        functionName: "省-常务会高频词19",
        queryParam: `organ_code=${code},year=${year}`,
        orderParam: "amount=desc",
      }).then(res => {
        console.log("会议高频词：" + 19);
        let meetData = [];
        res.slice(0, 15).forEach(ele => {
          meetData.push({
            name: ele.word,
            value: ele.amount
          });
        });
        this.meetData = meetData;
      });
    },
    // 更多
    onMore() {
      // 目前只让海南使用此功能
      if(this.user.organCode !== '460000') {
        return
      }
      let imgUrl = `${location.origin}/deriverCabin/${this.user.organCode}/政府常务会议/${this.year}.jpg`
      window.open(`${location.origin}/priviewPic?url=${imgUrl}`, '_blank')
      // this.hasImg(imgUrl)
      // .then(() => {
      //   window.open(`${location.origin}/priviewPic?url=${imgUrl}`, '_blank')
      // })
      // .catch(err => {
      //   this.$notify.info({
      //     title: '提示',
      //     message: '未找到该年份数据'
      //   })
      // })

    },
    hasImg(url) {
      return new Promise((resolve, reject) => {
        let img = document.createElement('img')
        img.src = url
        img.onload = function() {
          resolve()
        }
        img.onerror = function(err) {
          reject()
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@media (max-width: 768px) {
  .meeting-btns {
    top: 35px;
  }
  .meet-high-word {
    top: 50%;
    right: -50%;
    margin-top: -5px;
  }
  .meeting-chart {
    height: 340px;
    padding-top: 35px;

    ::v-deep {
      .el-row {
        height: auto;
      }
    }
    .meet-chart-xs {
      height: 170px;
    }
  }
}
</style>
