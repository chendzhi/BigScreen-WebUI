<template>
  <div class="mobile-bg">
    <!-- 头部 -->
    <top />

    <!-- banner -->
    <div class="block">
      <el-carousel class="lun_imgs" ref="carousel" arrow="always">
        <el-carousel-item
          class="lun_img"
          v-for="item in imgs"
          v-bind:key="item.url"
        >
          <a :href="item.link">
            <img :src="item.url" />
          </a>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 热点新闻 -->
    <div class="hotnews">
      <img src="@/assets/images/mobilePhone/hotnews.png" alt="" />
      <strong></strong>

      <div class="bs-sysMsg" v-if="systemMsg.length > 0">
        <div class="msg__content">
          <el-carousel
            class="msghight"
            direction="vertical"
            indicator-position="none"
            :autoplay="true"
          >
            <el-carousel-item v-for="item in systemMsg" :key="item.index">
              <a :href="item.link" target="_blank" class="item">{{
                item.title
              }}</a>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <!-- <dl>
        <a
          href="http://www.gov.cn/xinwen/2021-02/03/content_5584718.htm"
          target="_blank"
          ><img src="@/assets/images/mobilePhone/jticon.png" alt="" />
        </a>
      </dl> -->
    </div>

    <!-- 领导足迹 -->
    <div class="leaderFootprint">
      <span>领导足迹</span>
      <el-radio-group v-model="radio1" @change="agreeChange">
        <el-radio-button name="习近平" label="总书记"></el-radio-button>
        <el-radio-button name="李克强" label="总理"></el-radio-button>
        <el-radio-button name="彭清华" label="书记"></el-radio-button>
        <el-radio-button name="黄强" label="省长"></el-radio-button>
      </el-radio-group>
    </div>

    <!-- map地图 -->
    <div class="dateMap">
      <div class="datet">
        <el-date-picker
          v-model="datetime"
          type="month"
          format="2021"
          value-format="2021"
          placeholder="2020年"
          @change="upadateDate"
          disabled
        >
        </el-date-picker>
        <!-- <i class="el-icon-arrow-down"></i> -->
      </div>

      <el-tabs
        :key="activeName"
        v-model="activeName"
        @tab-click="handleClick"
        class="tabmap"
      >
        <el-tab-pane label="省内" name="adviceExe" class="snmap" v-if="isShow">
          <router-link
            :to="{ path: '/leader-footprint', query: { leadIndex } }"
          >
            <sichuanMap :sichuanData="sichuanData" ref="provinceMap" />
          </router-link>
        </el-tab-pane>

        <el-tab-pane label="国内" name="recordExe" class="gnmap">
          <router-link
            :to="{ path: '/leader-footprint', query: { leadIndex } }"
          >
            <chinaMap :chinaData="chinaData" ref="countryMap" />
          </router-link>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 重点领域 -->
    <div class="field">
      <span>重点领域</span>
      <a href="#"><img src="@/assets/images/mobilePhone/gdjh.png" alt="" /></a>
    </div>
    <div class="fieldList">
      <div class="fieldList">
        <div class="fieldimg">
          <el-row :gutter="24">
            <el-col :span="12">
              <router-link to="/mobile-doubleCity">
                <div class="grid-content bg-purple1">成渝地区双城经济圈</div>
              </router-link>
            </el-col>
            <el-col :span="12">
              <router-link to="/mobile-digitalEco">
                <div class="grid-content bg-purple2">数字经济</div>
              </router-link>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- <div class="fieldimg">
        <el-row :gutter="20">
          <el-col :span="10">
            <router-link to="/mobile-directors">
              <div class="grid-content bg-purple1">透视常务会</div></router-link
            >
          </el-col>
          <el-col :span="14">
            <router-link to="/mobile-politicsSpread">
              <div class="grid-content bg-purple2">政声传递</div>
            </router-link>
            <router-link to="/mobile-doubleCity">
              <div class="grid-content bg-purple3">成渝双城</div>
            </router-link>
          </el-col>
        </el-row>
        <div class="zdlyjj"></div>
        <el-row :gutter="20">
          <el-col :span="10">
            <router-link to="/politics-follow">
              <div class="grid-content bg-purple4">政关注</div>
            </router-link>
          </el-col>
          <el-col :span="7">
            <router-link to="/mobile-digitalEco">
              <div class="grid-content bg-purple5">数字经济</div>
            </router-link>
          </el-col>
          <el-col :span="7">
            <router-link to="/field">
              <div class="grid-content bg-purple6">领域</div>
            </router-link>
          </el-col>
        </el-row>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapInfo } from "@/api/mobileIndex";
import "@/assets/styles/mobiletabmap.scss";
import top from "../components/top.vue";
import sichuanMap from "../components/sichuanMap.vue";
import chinaMap from "../components/chinaMap.vue";

fnResize();
window.onresize = function () {
  fnResize();
};
function fnResize() {
  var deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  if (deviceWidth >= 750) {
    deviceWidth = 750;
  }
  if (deviceWidth <= 320) {
    deviceWidth = 320;
  }
  document.documentElement.style.fontSize = (deviceWidth / 414) * 16 + "px";
}

export default {
  components: {
    top,
    sichuanMap,
    chinaMap,
  },
  data() {
    return {
      scData: [],
      radio1: "总书记",
      leadName: "习近平", //领导姓名
      leadnum: 1, //领导类别 1国内 2省内
      areaCode: "bm0100",
      leadIndex: 0,
      mapName: "first",
      year: "2020",
      datetime: "",
      activeName: "recordExe",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      sichuanData: [],
      chinaData: [],
      imgs: [
        {
          url: require("@/assets/images/mobilePhone/banner1.jpg"),
          link: "http://www.sc.gov.cn/10462/c102241/fkxxhzbd.shtml",
        },
        {
          url: require("@/assets/images/mobilePhone/banner2.jpg"),
          link: "http://cb.twozii.com/h5-river-basin-environmental-management/",
        },
        {
          url: require("@/assets/images/mobilePhone/banner3.jpg"),
          link:
            "https://modao.cc/app/2704166451e812bcfaf44f86fe31d364e128fbc8?simulator_type=long_page#screen=skkjlclpxaieqq8",
        },
      ],
      isShow: false,
      animate: false,
      dataItems: [
        {
          name: "全国→习近平同苗族村民包黄粑迎新春：祝你们日子过得更加甜美",
          link: "http://www.sc.gov.cn/10462/c102241/fkxxhzbd.shtml",
        },
        {
          name:
            "全省→紧盯目标 狠抓落实确保《政府工作报告》重点目标任务落地见效",
          link: "http://www.sc.gov.cn/10462/c102241/fkxxhzbd.shtml",
        },
      ],
      // 滚屏消息
      systemMsg: [
        {
          title: "全国→习近平同苗族村民包黄粑迎新春：祝你们日子过得更加甜美",
          link:
            "http://politics.people.com.cn/n1/2021/0204/c1024-32022595.html",
        },
        {
          title:
            "全省→紧盯目标 狠抓落实确保《政府工作报告》重点目标任务落地见效",
          link:
            "http://www.sc.gov.cn/10462/lqyghd/2021/2/3/a50dcc1998534d80a0ca2f8c5d4eb065.shtml",
        },
      ],
    };
  },
  created() {
    this.getData();
    setInterval(this.scroll, 5000);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    scroll() {
      this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
      setTimeout(() => {
        //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
        this.dataItems.push(this.dataItems[0]); // 将数组的第一个元素添加到数组的
        this.dataItems.shift(); //删除数组的第一个元素
        this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 500);
    },
    ...mapMutations("allMap", ["updateProviceMapData", "updateCountryMapData"]),
    //获取数据项
    getData() {
      // 参数
      let that = this;
      const params = {
        ds: 2,
        tn: 14,
        functionName: "足迹-供月份状态初始化使用",
        queryParam:
          "leader_name=" +
          this.leadName +
          ",access_scope=" +
          this.leadnum +
          ",year=" +
          this.year,
        orderParam: "",
        attribute: this.areaCode,
      };
      let newData = [];
      mapInfo(params).then((res) => {
        for (var i = 0; i < res.length; i++) {
          let data = res;
          newData.push({
            name: data[i].access_place,
            value: data[i].access_frequency,
          });
        }
        if (this.leadnum === 1) {
          that.chinaData = newData;
          that.updateCountryMapData(newData);
          that.$refs.countryMap.resize();
        } else if (this.leadnum === 2) {
          that.sichuanData = newData;
          that.updateProviceMapData(newData);
          that.$refs.provinceMap.resize();
        }
      });
    },
    //领导切换地图
    agreeChange: function (val) {
      if (this.radio1 === "总书记") {
        this.leadName = "习近平";
        this.leadnum = 1;
        this.activeName = "recordExe";
        this.areaCode = "bm0100";
        this.isShow = false;
        this.leadIndex = 0;
      } else if (this.radio1 === "总理") {
        this.leadName = "李克强";
        this.leadnum = 1;
        this.activeName = "recordExe";
        this.areaCode = "bm0100";
        this.isShow = false;
        this.leadIndex = 1;
      } else if (this.radio1 === "书记") {
        this.activeName = "adviceExe";
        this.leadName = "彭清华";
        this.leadnum = 2;
        this.areaCode = "510000";
        this.isShow = true;
        this.leadIndex = 2;
      } else if (this.radio1 === "省长") {
        this.activeName = "adviceExe";
        this.leadName = "黄强";
        this.leadnum = 2;
        this.areaCode = "510000";
        this.isShow = true;
        this.leadIndex = 3;
      }
      this.getData();
    },
    //切换省份
    async handleClick(val) {
      //省内
      if (val.name === "adviceExe") {
        this.leadnum = 2;
      } else {
        this.leadnum = 1;
      }
      await this.getData();
      this.activeName = val.name;
    },
    //时间切换
    upadateDate() {
      this.year = this.datetime;
      this.getData();
    },
  },
};
</script>

<style scoped lang="scss">
@function px2rem($px) {
  @return $px/16 + rem;
}

$designWidth: 414; //750 是设计稿的宽度，要根据设计稿的宽度填写。


.dateMap{
  background: #D7F1FE;
  position: relative;
  padding-top: 35px;
}

/deep/ .tabmap .el-tabs__header{
  margin-top: px2rem(-40) !important;
}

//日期
.datet{
  position: absolute;
  z-index: 99;
  right: 0;
  margin-top: px2rem(-40) !important;
}
/deep/ .datet .el-input__icon{
  display: none;
}
.el-date-editor.el-input{
  width: px2rem(90);
  margin-top: px2rem(15);
  margin-right: px2rem(20);
}
/deep/ .el-input--prefix .el-input__inner{
  padding: px2rem(10) px2rem(10) px2rem(10) px2rem(18);
}
.el-icon-arrow-down{
  position: absolute;
  z-index: 999;
  right: px2rem(12);
  top: px2rem(25);
}
/deep/ .el-input input{
   width: px2rem(90);
}


.el-carousel__item.is-animating img {
  width: 100%;
  height: auto;
  background: 100% 100%;
}
.el-icon-arrow-down {
  display: none;
}
/deep/ .lun_imgs .el-carousel__container {
  height: px2rem(180);
}

//  热点新闻
.hotnews {
  padding: px2rem(15) px2rem(5);
  background-color: #fff;
  height: px2rem(80);
}
.hotnews img {
  vertical-align: middle;
  display: inline-block;
  width: 14%;
  float: left;
}
.hotnews strong {
  width: 1%;
  height: px2rem(50);
  margin-left: px2rem(10);
  padding: 0 px2rem(5);
  border-left: 1px solid #f1f1f1;
  vertical-align: middle;
  display: inline-block;
  float: left;
}

.hotnews dl {
  width: 8%;
  text-align: right;
  vertical-align: middle;
  display: inline-block;
}
.hotnews dl a {
  float: right;
}
.hotnews dl a img {
  width: auto;
  float: right;
}
.msghight {
  height: px2rem(60);
}

/*轮翻消息*/
.bs-sysMsg {
  position: relative;
  display: flex;
  width: 80%;
  color: #000;
  overflow: hidden;
  opacity: 1;
  align-items: center;
  transition: opacity 0.2s;
  float: left;
}
.bs-sysMsg .msg__content {
  display: table-cell;
  padding: 0 px2rem(8);
  width: 100%;
  height: px2rem(50);
}
.bs-sysMsg .msg__content a.item {
  color: #000;
  font-size: px2rem(17);
  opacity: 0.75;
  line-height: px2rem(28);
}
.bs-sysMsg .msg__content a.item:hover {
  text-decoration: underline;
}
</style>
