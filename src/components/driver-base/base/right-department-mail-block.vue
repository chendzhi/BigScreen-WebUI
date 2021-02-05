<template>
  <div class="mail-block block-bg">
    <div class="block-tab block-tab-top flex align-center justify-between">
      <div class="block-tab-slide">
        <span class="block-tab-word">部委来信精选</span>
      </div>
    </div>
    <div ref="provinceAction" class="letters-chart letters-chart2">
      <vue-seamless-scroll
        :data="mailList"
        :class-option="optionSetting"
        class="seamless-warp seamless-warp2"
      >
        <ul class="article-ul">
          <li
            @click="openMailDialog(item)"
            v-for="item in mailList"
            :key="item._id"
            class="article-ul-li article-ul-li2"
          >
            <p class="word-ellipsis-2">{{ item.name }}</p>
            <div class="article-ul-li-date">{{ item.date }}</div>
          </li>
        </ul>
      </vue-seamless-scroll>
    </div>
    <!-- 来信弹窗 -->
    <mail
      v-if="isOpenMailDialog"
      @closeDialog="isOpenMailDialog = false"
      :mailDialogData="mailDialogData"
      :isOpen="isOpenMailDialog"
    ></mail>
  </div>
</template>
<script>
// 系统业务
import { queryData } from "@/api/newDriverCabin/index";
import { parseTime } from "@/utils";
import vueSeamlessScroll from "vue-seamless-scroll";
import action from "@/views/newDriverCabin/dialog/action";
import mail from "@/views/newDriverCabin/dialog/mail";
//图表组件
import bounceWordCloud from "@/views/newDriverCabin/common/bounceWordCloud";
import pictorialBarChart from "@/components/Echarts/vue-echart/pictorial-bar-chart";
export default {
  name: "right",
  components: {
    action,
    mail,
    vueSeamlessScroll,
    bounceWordCloud,
    pictorialBarChart
  },
  data() {
    return {
      isOpenMailDialog: false,
      mailDialogData: {},
      mailList: [], // 部委来信精选
    };
  },
  props: {},
  created() {
    // 部委来信精选
    this.getMailListData();
  },
  computed: {
    optionSetting() {
      return {
        step: 0.1, // 数值越大速度滚动越快
        limitMoveNum: 5, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: false, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      };
    }
  },
  methods: {
    openMailDialog(data) {
      this.mailDialogData = data || {};
      this.isOpenMailDialog = true;
    },
    getMailListData() {
      queryData({
        tn: 11,
        functionName: "部委来信精选11",
        queryParam: "",
        orderParam: "letter_date=desc"
      }).then(res => {
        console.log("部委来信精选tn:" + 11);
        this.mailList = res.map(ele => {
          ele.name = ele.letter_title;
          ele.date = parseTime(ele.letter_date, "{y}-{m}-{d}");
          ele.reply_date_time = parseTime(ele.reply_date, "{y}-{m}-{d}");
          return ele;
        });
      });
    },
  }
};
</script>
<style lang="scss">
.letters-chart2 {
  padding: 8px 0;
}
.seamless-warp2 {
  height: 100%;
}
</style>
