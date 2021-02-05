<template>
  <div>
    <!-- 领域 -->
    <div class="ldfield">
      
      <div class="datefield">
        <span>领域</span>
        <el-select v-model="datevalue">
          <el-option
            v-for="item in dateoptions"
            :key="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>

    <div id="focusareas"></div>
  </div>
</template>

<script>
import { mapInfo } from "@/api/mobileIndex";
import { Years } from "@/api/mobileIndex";
import echarts from "echarts";
export default {
  components: {
  },
  data() {
    return {
      top,
      leader:{
        name:'黄强',img:'http://103.203.219.146/scssspt/img/510000/20210201050603462185.jpg',position:'省长'
      },
      datetime: "2021",
      yearNum: "2020",
      seriesData: [],
      yAxisData: [],
      dateoptions: [],
       datevalue: '2021年'
    };
  },
  mounted() {
    // this.focusareas();
    this.getyaer();
  },
  methods: {
    focusareas() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("focusareas"));

      // 指定图表的配置项和数据
      var colorList = ["#f36c6c", "#e6cf4e", "#20d180"]; // 颜色
      // var seriesData = [];
      // var yAxisData = [];
      let option = {
        grid: { containLabel: true },
        xAxis: {
          type: "value",
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "category",
          data: this.yAxisData,
          inverse: true,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            type: "bar",
            data: this.seriesData,
            barWidth: 20,
            position: "insideBottom",
            itemStyle: {
              normal: {
                color: function (params) {
                  if (params.value > 3) {
                    return colorList[0];
                  } else if (params.value >= 1.5 && params.value <= 3) {
                    return colorList[1];
                  }
                  return colorList[2];
                },
              },
            },
            label: {
              show: true,
              color: "#fff",
              position: "insideLeft",
              valueAnimation: true,
            },
          },
        ],
        grid: {
          x: 130,
          y: 5,
          x2: 30,
          y2: 35,
        },
      };

      // // 使用刚指定的配置项和数据显示图表。
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
    },
    //获取年份
    getyaer() {
      let that = this;
      const params = {
        ds: 2,
        tn: 20,
        functionName: "",
        queryParam: "leader_name=黄强",
        orderParam: "",
        attribute: 510000,
      };
      Years(params)
        .then((res) => {
          for (var i = 0; i < res.length; i++) {
            that.yearNum = res[i];
          }
          that.dateoptions = res[i];
        })
        .then(() => {
          that.getData();
        });
    },
    //获取数据项
    getData() {
      // 参数
      let that = this;
      const params = {
        ds: 2,
        tn: 20,
        functionName: "领域20",
        queryParam: "leader_name=黄强,year=2020", //"+that.yearNum+"
        orderParam: "amount=desc",
        attribute: 510000,
      };
      let fieldData = [];
      let fieldDataNum = [];
      mapInfo(params).then((res) => {
        for (var i = 0; i < res.length; i++) {
          fieldData.push(res[i].name);
          fieldDataNum.push(res[i].amount);
        }
        that.yAxisData = fieldData;
        that.seriesData = fieldDataNum;
        this.focusareas();
      });
    },
  },
};

fnResize();
window.onresize = function () {
  fnResize();
}
function fnResize() {
  var deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  if (deviceWidth >= 750) {
    deviceWidth = 750;
  }
  if (deviceWidth <= 320) {
    deviceWidth = 320;
  }
  document.documentElement.style.fontSize = (deviceWidth / 414) * 16 + 'px';
}
</script>

<style lang='scss'>
@function px2rem( $px ){
    @return $px/16 + rem;
}

$designWidth : 414; //414 是设计稿的宽度，要根据设计稿的宽度填写。

#focusareas {
  width: 100%;
  height: px2rem(600);
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
.el-select{
  float: right;
}
.datefield {
  position: relative !important;
  z-index: 99;
  right: 0;
  top: 0;
}
.el-input input{
  width:px2rem(100) ;
}
// .el-input__icon {
//   display: none;
// }
/* .el-icon-arrow-down{
    position: absolute;
    right: px2rem(12);
    top: px2rem(22);
} */
</style>