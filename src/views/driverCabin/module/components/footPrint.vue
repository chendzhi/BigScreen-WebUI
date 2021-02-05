<template>
  <div class="main">
    <!-- 地图 -->
    <div class="dateMap">
      <div class="map">
        <el-select v-model="value" @change="currentSel">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-tabs
          :key="activeName"
          v-model="activeName"
          @tab-click="handleClick"
          class="tabmap"
        >
          <el-tab-pane label="省内" name="adviceExe" v-if="province">
            <sichuanMap ref="provinceMap" />
          </el-tab-pane>

          <el-tab-pane label="国内" name="recordExe">
            <chinaMap ref="countryMap" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 活动足迹 -->
    <div class="activityf">
      <span>活动足迹</span>
      <p>
        {{ value }}年{{ leaderDatas[defaultIndex].position
        }}{{ footPrintActive.area }}活动足迹有{{
          footPrintActive.totalNum
        }}条。{{ footPrintActive.areaInfo }}
      </p>
    </div>

    <el-tabs v-model="activity" class="activityList">
      <el-tab-pane
        :label="item.cityName"
        :name="item.name"
        class="activity"
        v-for="(item, index) in footPrint"
        :key="index"
      >
        <ul>
          <li v-for="(itm, idx) in item.dataList" :key="idx">
            <a :href="itm.url" target="_blank">{{ itm.title }}</a>
            <span>{{ itm.release_date }}</span>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
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

import { mapMutations } from "vuex";
import "@/assets/styles/mobiletabmap.scss";
import sichuanMap from "./sichuanMap.vue";
import chinaMap from "./chinaMap.vue";
import axios from "axios";
export default {
  components: {
    sichuanMap,
    chinaMap,
  },
  props: {
    changeData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeName: "recordExe",
      activity: "1",
      top,
      defaultIndex: 0,
      province: false,
      access_scope: 1,
      leaderDatas: [
        {
          name: "习近平",
          img:
            "http://103.203.219.146/scssspt/img/110000/20210202100540486690.jpg",
          position: "总书记",
          attribute: "bm0100",
        },
        {
          name: "李克强",
          img:
            "http://103.203.219.146/scssspt/img/110000/20210202100607658703.jpg",
          position: "国务院总理",
          attribute: "bm0100",
        },
        {
          name: "彭清华",
          img:
            "http://103.203.219.146/scssspt/img/510000/20210202084030837876.jpg",
          position: "省委书记",
          attribute: "510000",
        },
        {
          name: "黄强",
          img:
            "http://103.203.219.146/scssspt/img/510000/20210201050603462185.jpg",
          position: "省长",
          attribute: "510000",
        },
      ],
      mapData: [], //地图数据传递
      footPrint: [],
      footPrintActive: {
        area: "",
        totalNum: 0,
        areaInfo: "",
      },
      options: [
        {
          value: 2021,
          label: "2021年",
        },
        {
          value: 2020,
          label: "2020年",
        },
      ],
      value: 2021,
    };
  },
  mounted() {
    this.defaultIndex = this.changeData.defaultIndex;
    this.province = this.changeData.province;
    this.activeName = this.changeData.activeName;
    if (this.$route.query.leadIndex !== undefined) {
      this.defaultIndex = this.$route.query.leadIndex;
    }

    if (this.defaultIndex > 1) {
      this.access_scope = 2;
      this.province = true;
      this.activeName = "adviceExe";
    }
    this.getData();
  },
  watch: {
    changeData(newValue, oldValue) {
      this.defaultIndex = newValue.defaultIndex;
      this.province = newValue.province;
      this.activeName = newValue.activeName;
      this.access_scope = newValue.access_scope;
      this.getData();
    },
  },
  methods: {
    ...mapMutations("allMap", ["updateProviceMapData", "updateCountryMapData"]),
    getData() {
      const params = {
        ds: 2,
        tn: 14,
        functionName: "足迹-供月份状态初始化使用",
        queryParam: `leader_name=${
          this.leaderDatas[this.defaultIndex].name
        },access_scope=${this.access_scope},year=${this.value}`,
        orderParam: "access_code=asc",
        attribute: this.leaderDatas[this.defaultIndex].attribute,
        zm_type: 1,
      };
      this.activity = "1";
      let that = this;
      axios
        .get("http://103.203.219.146/scssspt/api/screen/screen/queryData", {
          params,
        })
        .then((res) => {
          that.mapData = [];
          that.footPrint = [];
          that.footPrintActive = {
            area: "",
            totalNum: 0,
            areaInfo: "",
          };
          if (res.data.length) {
            let areaArr = [];
            res.data.forEach(function (val, idx) {
              let data = { name: val.access_place, value: val.markNum };
              if(val.access_place == '成都市' || val.access_place == '北京市'){
                data.value = val.access_frequency;
              }
              let footPrintObj = {};
              footPrintObj.name = "" + (idx + 1);
              footPrintObj.cityName = val.access_place;
              footPrintObj.dataList = [];

              let listDetails = val.details;
              //遍历足迹活动
              listDetails.forEach(function (value, index) {
                let obj = {};
                obj.title = value.title;
                obj.url = value.url;
                obj.release_date = that.format(value.release_date);
                footPrintObj.dataList.push(obj);
              });

              let areaObj = {};
              areaObj.place = val.access_place;
              areaObj.num = listDetails.length;
              if (areaArr.length) {
                let flag = false;
                areaArr.forEach(function (value, index) {
                  if (value.place == areaObj.place) {
                    flag = true;
                    value.num += areaObj.num;
                    return;
                  }
                });
                if (!flag) {
                  areaArr.push(areaObj);
                }
              } else {
                areaArr.push(areaObj);
              }

              //国内足迹

              that.mapData.push(data);
              //足迹详情及活动
              that.footPrint.push(footPrintObj);
              that.footPrintActive.area = val.access_scopeText;
            });
            areaArr.forEach(function (val, idx) {
              that.footPrintActive.areaInfo += val.place + val.num + "条，";
            });

            that.footPrintActive.areaInfo = that.footPrintActive.areaInfo.substring(
              0,
              that.footPrintActive.areaInfo.length - 1
            );
          }
          that.footPrintActive.totalNum = res.data.length;

          //对应地图重新生成
          if (that.activeName === "recordExe") {
            that.updateCountryMapData(that.mapData);
            that.$refs.countryMap.resize();
          } else if (that.activeName === "adviceExe") {
            that.updateProviceMapData(that.mapData);
            that.$refs.provinceMap.resize();
          }
        });
    },
    currentSel(selVal) {
      this.timer = new Date().getTime();
      this.value = selVal;
      this.getData();
    },
    //设置滑动切换轮播图
    swiperleft(index) {
      //上一页
      this.$refs.carousel.prev();
      //设置幻灯片的索引
      this.$refs.carousel.setActiveItem(index - 1);
    },
    swiperright(index) {
      //下一页
      this.$refs.carousel.next();
      this.$refs.carousel.setActiveItem(index + 1);
    },
    handleClick(val) {
      this.activeName = val.name;
      if (val.name == "adviceExe") {
        this.access_scope = 2;
      } else {
        this.access_scope = 1;
      }
      this.getData();
    },
    change(index) {
      this.defaultIndex = index;
      if (index == 0 || index == 1) {
        this.access_scope = 1;
        this.activeName = "recordExe";
        this.province = false;
      } else {
        this.activeName = "adviceExe";
        this.access_scope = 2;
        this.province = true;
      }
      this.getData();
    },
    format(timestr) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(timestr);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return y + "-" + this.addZero(m) + "-" + this.addZero(d);
    },
    addZero(m) {
      return m < 10 ? "0" + m : m;
    },
  },
};
</script>
<style lang="scss" scoped>
$icond: "~@/assets/images/mobilePhone/icond.jpg";
@function px2rem($px) {
  @return $px/16 + rem;
}

$designWidth: 414; //414 是设计稿的宽度，要根据设计稿的宽度填写。

// 时间选择器
.map {
  position: relative;
}
.map .el-select {
  position: absolute;
  width: auto;
  height: px2rem(30);
  right: px2rem(15);
  z-index: 99;
  margin-top: px2rem(-25);
}

/* 活动足迹 */
.activityf {
  background: #fff;
  padding: px2rem(10);
}
.activityf span {
  color: #557d9e;
  font-size: px2rem(18);
  line-height: px2rem(30);
}
.activityf p {
  font-size: px2rem(14);
  color: #000;
  line-height: px2rem(30);
}
.activity {
  font-size: px2rem(16);
}

.activityList {
  width: 96%;
  margin: 0 auto;
  .activity ul {
    margin: 0 auto;
    margin-block-start: 0em;
    margin-block-end: 0em;
    padding-inline-start: 0px;
    padding: 0px px2rem(5);
  }
  .activity ul li {
    height: auto;
    margin-bottom: px2rem(10);
    list-style-type: none;
    background: url($icond) no-repeat px2rem(5) px2rem(10);
    text-indent: px2rem(15);
  }
    .activity ul li+li{
      border-top: 1px dashed #ccc;
      padding-top:px2rem(10);
      background-position-y: px2rem(20);
    }
  .activity ul li a {
    height: auto;
    line-height: px2rem(25);
    display: block;
    color: #000;
    margin-bottom:px2rem(5);
  }
  .activity ul li span {
    clear: both;
    display: block;
    color: #bcbcbc;
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: px2rem(14);
  opacity: 0.75;
  line-height: px2rem(150);
  margin: 0;
}

// .el-carousel__item:nth-child(2n) {
//   background-color: #99a9bf;
// }

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #d3dce6;
// }
.dateMap {
  background: #d7f1fe;
  position: relative;
  padding-top:  px2rem(35);
  margin-top:  px2rem(5);
}
</style>