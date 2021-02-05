<template>
  <div class="xietong-block">
    <div class="block-title">
      <div class="block-title-word">政关注</div>
    </div>
    <div class="block-bg">
      <div class="block-tab flex justify-end">
        <span
          class="block-tab-btn"
          @click="toWitchDay(i)"
          :class="{ 'active-btn': isDay === i }"
          v-for="(el, i) in days"
          :key="el"
          >{{ el }}天</span
        >
        <!-- <span class="block-tab-btn active-btn">30天</span> -->
      </div>
      <div class="xietongfasheng-chart">
        <div @click="openAttention" class="quanguo-btn small-btn-bg">
          {{isCity ? '全省' : '全国'}}
        </div>
        <column-chart :setData="attentionData"></column-chart>
      </div>
      <div
        class="attent-rank"
        v-if="
          attentionData &&
            attentionData.all &&
            attentionData.all[0] &&
            attentionData.all[0].name
        "
      >
        {{user.nickName}}领导信息发布量排名第<span class="attent-rank-num">{{num}}</span>位
      </div>
    </div>
    <!-- 政关注弹窗 -->
    <attention
      v-if="isOpenAttentionDialog"
      @closeDialog="isOpenAttentionDialog = false"
      :days="days"
      :isDay="isDay"
      :isOpen="isOpenAttentionDialog"
    ></attention>
  </div>
</template>
<script>
// 系统业务
import { mapGetters } from "vuex";
import { queryData } from "@/api/newDriverCabin/index";
import columnChart from "@/components/Echarts/vue-echart/column-chart";
import attention from "@/views/newDriverCabin/dialog/attention";
export default {
  name: "left-attention-block",
  components: {
    columnChart,
    attention
  },
  data() {
    return {
      days: [7, 30],
      isDay: 0,
      num: 0,
      attentionData: {},
      isOpenAttentionDialog: false
    };
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
    // 政关注
    this.getAttentionData(this.days[this.isDay]);
  },
  methods: {
    toWitchDay(index) {
      this.isDay = index;
      this.getAttentionData(this.days[index]);
    },
    openAttention() {
      this.isOpenAttentionDialog = true;
    },
    // 政关注
    getAttentionData(days) {
      // 1 7天; 2 30天
      let type = days === 7 ? 1 : 2;
      queryData({
        tn: 12,
        functionName: "政关注12",
        queryParam: `type=${type}`,
        orderParam: "amount=desc"
      }).then(res => {
        console.log("政关注tn:----" + 12);
        let xData = [];
        let wx = [];
        let wb = [];
        let mh = [];
        let five = [];
        let index = 0;
        // 如果本用户不在前5，添加
        let includeOrgan = res.find((ele, i) => {
          if (ele.name === this.user.nickName) {
            index = i;
            return ele;
          }
        });
        this.num = index + 1;
        if (index > 4) {
          five = res.slice(0, 4).concat(includeOrgan);
        } else {
          five = res.slice(0, 5);
        }
        five.forEach(ele => {
          ele.wechat = ele.wechat || 0;
          ele.weibo = ele.weibo || 0;
          ele.portal = ele.portal || 0;
          ele.amount = ele.amount || 0;
          xData.push(ele.name);
          wx.push(ele.wechat);
          wb.push(ele.weibo);
          mh.push(ele.portal);
        });
        this.attentionData = {
          wx,
          wb,
          mh,
          xData,
          curName: this.user.nickName,
          all: res
        };
      });
    }
  }
};
</script>
