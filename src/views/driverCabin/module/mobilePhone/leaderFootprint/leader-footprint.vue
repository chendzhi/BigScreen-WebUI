<template>
  <div>
    <!-- 头部 -->
    <top :top="top" />

    <!-- 领导 -->
    <el-carousel
      :initial-index="defaultIndex"
      trigger="click"
      class="leaderhight"
      arrow="always"
      @change="change"
      :autoplay="false"
      :interval="4000"
      indicator-position="none"
    >
      <el-carousel-item v-for="(item, i) in leaderDatas" :key="i">
        <leader :leader="item" />
      </el-carousel-item>
    </el-carousel>

    <!-- 足迹领域切换块 -->
    <div class="printTab" v-if="tabShow">
      <el-radio-group v-model="tabPosition" @change="btnChange">
        <el-radio-button label="print">足迹</el-radio-button>
        <el-radio-button label="field">领域</el-radio-button>
      </el-radio-group>
    </div>

    <footPrint
      :changeData="{
        defaultIndex,
        activeName,
        province,
        access_scope,
      }"
      v-show="printShow"
    />
    <field v-if="fieldShow" />
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

import "@/assets/styles/mobiletabmap.scss";
import top from "../../components/top.vue";
import footPrint from "../../components/footPrint.vue";
import leader from "../../components/leader.vue";
import field from "../../components/field.vue";

export default {
  components: {
    top,
    leader,
    footPrint,
    field,
  },
  data() {
    return {
      activeName: "recordExe",
      activity: "1",
      top,
      defaultIndex: 0,
      province: false,
      access_scope: 1,
      tabPosition: "print",
      tabShow: false,
      fieldShow: false,
      hqTabShow: false,
      onName: "print",
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
      leadFootPrint: [],
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
      printShow: true,
    };
  },
  mounted() {
    if (this.$route.query.leadIndex !== undefined) {
      this.defaultIndex = this.$route.query.leadIndex;
      if (
        this.$route.query.leadIndex == 2 ||
        this.$route.query.leadIndex == 3
      ) {
        this.access_scope = 2;
        this.province = true;
        this.activeName = "adviceExe";
      } else {
        this.access_scope = 1;
        this.province = false;
        this.activeName = "recordExe";
      }
    }
  },
  methods: {
    change(index) {
      this.defaultIndex = index;
      if (index == 3) {
        this.tabShow = true;
      } else {
        this.tabShow = false;
      }
      if (index == 0 || index == 1) {
        this.access_scope = 1;
        this.activeName = "recordExe";
        this.province = false;
      } else {
        this.activeName = "adviceExe";
        this.access_scope = 2;
        this.province = true;
      }
    },
    btnChange(val) {
      if (val == "print") {
        this.printShow = true;
        this.fieldShow = false;
      } else {
        this.fieldShow = true;
        this.printShow = false;
      }
    },
    evet() {
      if (this.$listeners.click) {
        this.$listeners.click = this.throat("click");
      }
      return this.$listeners;
    },
  },
};
</script>

<style scoped lang="scss">
@function px2rem($px) {
  @return $px/16 + rem;
}

$designWidth: 414; //414 是设计稿的宽度，要根据设计稿的宽度填写。

/deep/.leaderhight .el-carousel__container {
  height: px2rem(140) !important;
}
.printTab {
  padding: px2rem(20) 0 px2rem(15);
  height: px2rem(60);
  text-align: center;
}
.printTab button {
  padding: 0;
  width: px2rem(100);
  height: px2rem(30);
  line-height: px2rem(30);
}
/deep/.el-radio-group {
  float: unset;
  border-radius: unset;
}
/deep/.el-radio-button__inner {
  border-radius: unset !important;
}

/deep/ .tabmap .el-tabs__header {
  margin-top: px2rem(-40) !important;
}

//日期
.datet {
  position: absolute;
  z-index: 99;
  right: 0;
  margin-top: px2rem(-40) !important;
}
/deep/ .datet .el-input__icon {
  display: none;
}
.el-date-editor.el-input {
  width: px2rem(70);
  margin-top: px2rem(15);
  margin-right: px2rem(10);
}
/deep/ .el-input--prefix .el-input__inner {
  padding: px2rem(10);
}
/deep/ .el-input--suffix .el-input__inner {
  padding-right: px2rem(10);
}
.el-icon-arrow-down {
  position: absolute;
  z-index: 999;
  right: px2rem(12);
  top: px2rem(25);
}

.el-avatar {
  height: auto;
  width: auto;
}
.leaderhight {
  height: px2rem(140);
}
.leaderhight div {
  height: px2rem(140) !important;
}

.lyteb {
  text-align: center;
  padding: px2rem(20) 0;
}

/deep/.activityList .el-tabs__header {
  margin-top: 1.25rem;
  width: 100%;
  display: -webkit-box;
  list-style-type: none;
  flex-wrap: nowrap;
  -webkit-box-pack: justify;
  justify-content: space-between;
  overflow: auto;
  background: #ffff;
  margin: 0;
  position: relative;
  padding: px2rem(10) px2rem(0);
}
</style>