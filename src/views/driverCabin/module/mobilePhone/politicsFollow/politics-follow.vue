<template>
  <div>
    <!-- 头部 -->
    <top :top="top" />

    <!-- 领导 -->
    <leader :leader="leader" />

    <!-- <div class="ldfield">
      <span>领域</span>
      <div class="datefield">
        <el-date-picker
          v-model="datetime"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择日期"
        >
        </el-date-picker>
        <i class="el-icon-arrow-down"></i>
      </div>
    </div> -->
    <!-- 柱状图 -->
    <div class="followday">
      <p>全国各省省长信息发布量排名</p>
      <span
        class="btn-bg"
        :class="{ bg: time == 2 }"
        @click="changeThirty(), changeBg(2)"
        >近30天</span
      >
      <span
        class="btn-bg"
        :class="{ bg: time == 1 }"
        @click="changeSeven(), changeBg(1)"
        >7天</span
      >
    </div>
    <div id="follow"></div>
    <div class="ranking">
      四川省省长信息发布量居全国第<span>{{ number }}</span
      >位
    </div>

    <el-table :data="tableData" style="width: 100%" :row-class-name="setColor">
      <el-table-column prop="id" label="序号" width="50"> </el-table-column>
      <el-table-column prop="name" label="全国省份"> </el-table-column>
      <el-table-column prop="portal" label="门户网站"> </el-table-column>
      <el-table-column prop="weibo" label="新浪微博"> </el-table-column>
      <el-table-column prop="wechat" label="微信" width="50"> </el-table-column>
      <el-table-column prop="amount" label="发布总量"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapInfo } from "@/api/mobileIndex";
import echarts from "echarts";
import top from "../../components/top.vue";
import leader from "../../components/leader.vue";
export default {
  components: {
    top,
    leader,
  },
  data() {
    return {
      top,
      leader:{
        name:'黄强',img:'http://103.203.219.146/scssspt/img/510000/20210201050603462185.jpg',position:'省长'
      },
      datetime: "",
      number: "",
      time: 1,
      tableData: [],
      dataArem: {},
    };
  },
  mounted() {
    this.getData("type=1");
    this.countrySeven("type=1");
    // this.follow();
  },
  methods: {
    follow() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("follow"));
  
      var data = this.dataArem;
      var colors = ["#5F97C9", "#4CC6C5", "#FFC78C"];
      var option = {
        title: {
          // text: "信息发布量",
          left: 19,
          top: 15,
          textStyle: {
            color: "#fff",
          },
        },
        color: colors,
        legend: {
          top: 10,
          left: 80,
          itemWidth: 10,
          itemHeight: 10,
          // padding: [5, 10],
          textStyle: {
            fontSize: 14,
            color: "#96A4F4",
            padding: [3, 0, 0, 0],
          },
          data: data.legend,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "13%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            color: "#96A4F4",
          },
          axisLine: {
            lineStyle: {
              color: "#96A4F4",
            },
            width: 5,
          },
          axisTick: {
            show: false,
          },
          data: data.area,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#96A4F4",
          },
          axisLine: {
            lineStyle: {
              color: "#96A4F4",
            },
            width: 5,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: "rgba(150, 164, 244, 0.3)",
            },
          },
        },
        series: [],
      };
      for (var i = 0; i < data.legend.length; i++) {
        option.series.push({
          name: data.legend[i],
          type: "bar",
          stack: "总量",
          barWidth: "45%",
          label: {
            show: false,
            position: "insideRight",
          },
          data: data.data[i],
        });
      }

      // 使用刚指定的配置项和数据显示图表。
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
    },
    getData(day) {
      // 参数
      let that = this;
      const params = {
        ds: 2,
        tn: 12,
        functionName: "政关注12",
        queryParam: day,
        orderParam: "amount=desc",
        attribute: 510000,
      };
      const followData = [];
      mapInfo(params)
        .then((res) => {
          let area = [];
          let portal = [];
          let wechat = [];
          let weibo = [];
          let dataArry = [];
          for (var i = 0; i < 5; i++) {
            area.push(res[i].name);
            portal.push(res[i].portal);
            wechat.push(res[i].wechat);
            weibo.push(res[i].weibo);
          }
          dataArry.push(portal, wechat, weibo);
          that.dataArem = {
            area: area,
            legend: ["门户网站", "微信", "新浪微博"],
            data: dataArry,
          };
        })
        .then(() => {
          this.follow();
        });
    },

    //7天全国政关注
    countrySeven(day) {
      // 参数
      let that = this;
      const params = {
        ds: 2,
        tn: 12,
        functionName: "弹框政关注12",
        queryParam: day,
        orderParam: "amount=desc",
        attribute: 510000,
      };
      const countrySevenData = [];
      mapInfo(params)
        .then((res) => {
          for (var i = 0; i < res.length; i++) {
            countrySevenData.push({
              id: i+1,
              name: res[i].name,
              portal: res[i].portal,
              weibo: res[i].weibo,
              wechat: res[i].wechat,
              amount: res[i].amount,
            });
            if (res[i].name == "四川省") {
              this.number = i + 1;
              // console.log(i)
            }
          }
          this.tableData = countrySevenData;
        })
        .then(() => {
          this.follow();
        });
    },
    //按钮颜色切换
    changeBg(index) {
      if (index === 1 || index === 2) {
        console.log(index)
        this.time = index;
      } else {
        console.log(index)
        this.sort = index;
      }
    },
    // 点击七天
    changeSeven() {
      this.getData("type=1");
      this.countrySeven("type=1");
    },
    // 点击三十天
    changeThirty() {
      this.getData("type=2");
      this.countrySeven("type=2");
    },
    //四川省行高亮
    setColor(row){
      if(row.row.name == '四川省'){
        return 'on'
      }
    }
  },
};


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
</script>

<style lang="scss">
@function px2rem( $px ){
    @return $px/16 + rem;
}

$designWidth : 414; //414 是设计稿的宽度，要根据设计稿的宽度填写。

#follow {
  width: 100%;
  height: px2rem(260);
}
.ldfield {
  padding: px2rem(20);
  position: relative;
}
.ldfield span {
  color: #000;
  line-height: px2rem(30);
  font-size: px2rem(18);
}
.datefield {
  position: absolute;
  z-index: 99;
  right: 0;
  top: 0;
}
.el-input__icon {
  display: none;
}
.followday {
  margin: px2rem(20) auto;
  clear: both;
  display: block;
  height: px2rem(40);
}
.followday p{
  clear: both;
  text-align: center;
  margin-bottom: px2rem(15);
}
.followday span {
  width: px2rem(60);
  display: block;
  padding: px2rem(5) px2rem(5);
  font-size: px2rem(14);
  border-radius: px2rem(5);
  text-align: center;
  float: right;
  margin-left: px2rem(5);
  margin-bottom: px2rem(10);
}
.ranking {
  background: #e6f4ff;
  text-align: center;
  padding: px2rem(10);
  width: 90%;
  margin: 0 auto px2rem(20);
  border-radius: px2rem(5);
}
.ranking span {
  padding: px2rem(2) px2rem(5);
  background: #e06353;
  border-radius: px2rem(5);
  color: #fff;
}
.bg {
  color: #fff;
  background: #40719c;
}
.el-table tr.on{
  color: #10568A;
  font-weight: bold;
  background: #D7F1FE;
}
</style>