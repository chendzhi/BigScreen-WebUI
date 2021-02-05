<template>
  
    
    <ul>
      <li v-for="(item, index) in dataList" :key="index">
        <router-link :to="{path:'/mobile-spreadDetail',query:{data:dataList[index]}}">
        <div class="title">
          <div class="info">
            <span class="type">{{ item.article_typeText }}</span
            >{{ item.title }}
          </div>
          <div class="time">{{ item.release_date }}</div>
        </div>
         
        <div class="spreadInfo">
         
          <div :id="item.idList[0]" class="mycharts"></div>
          <img src="@/assets/images/mobilePhone/arrow.png" alt="" />
          <div :id="item.idList[1]" class="mycharts"></div>
          <img src="@/assets/images/mobilePhone/arrow.png" alt="" />
          <div :id="item.idList[2]" class="mycharts"></div>
        </div>
        </router-link>
      </li>
    </ul>
</template>

<script>
import Vue from "vue";
import echarts from "echarts";
import axios from "axios";
Vue.prototype.$echarts = echarts;
export default {
  props: {
    politicsSpread: {
      type: Object,
      default: () => {},
    },
    groupName: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      dataList: [],
    };
  },
  mounted() {
    
  },
  created() {
    let that = this;

    let params = {};
    if(this.groupName == '政声传递'){
      params = {
        ds: 2,
        tn: 13,
        functionName: "政声传递",
        queryParam: "choice=1,leader_name=黄强",
        orderParam: "details_count=desc",
        attribute: 510000,
      }
    }else if(this.groupName == '成渝双城'){
      params = {
        ds:2,
        tn:94,
        functionName:'成渝双城',
        queryParam:'choice=1,classify=成渝双城',
        orderParam:'details_count=desc',
        attribute:510000
      }
    }else if(this.groupName == '数字经济'){
      params = {
        ds:2,
        tn:94,
        functionName:'数字经济',
        queryParam:'choice=1,classify=数字经济',
        orderParam:'details_count=desc',
        attribute:510000
      }
    }
    axios
      .get("http://103.203.219.146/scssspt/api/screen/screen/queryData", {
        params,
      })
      .then(function (msg) {
        let data = msg.data;
        if (data.length) {
          data.forEach(function (val, idx) {
            val.release_date = that.format(val.release_date);
            val.idList = [
              "zcfb" + 3 * idx,
              "zcfb" + (3 * idx + 1),
              "zcfb" + (3 * idx + 2),
            ];
            that.dataList.push(val);
          });
        }
      })
      .then(function () {
        that.dataList.forEach(function (val, idx) {
          val.idList.forEach(function (value, index) {
            let myChart = that.$echarts.init(document.getElementById(value));
            let allIndex = 3 * idx + index;
            if (allIndex % 3 == 0) {
              myChart.setOption(
                that.setopation(
                  parseFloat(val.portal / 1),
                  "省门户",
                  val.portal
                )
              );
            } else if (allIndex % 3 == 1) {
              myChart.setOption(
                that.setopation(
                  parseFloat(
                    val.portal2 /
                      (val.citiesn_number + val.directly_under_number)
                  ),
                  "省直+市州",
                  val.portal2
                )
              );
            } else {
              myChart.setOption(
                that.setopation(
                  parseFloat(val.portal3 / 200),
                  "市直+区县",
                  val.portal3
                )
              );
            }
          });
        });
      });
  },
  methods: {
    setopation(percent, title, num) {
      return {
        tooltip: {
          show: false,
        },
        series: [
          {
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            radius: "85%",
            startAngle: 210,
            endAngle: -30,
            splitNumber: 3, // 仪表盘刻度的分割段数,默认 10。
            center: ["50%", "65%"], // 仪表盘位置(圆心坐标)
            axisLine: {
              show: true,
              lineStyle: {
                width: 8,
                color: [
                  [percent, "#4D84AB"],
                  [1, "#E6EBF8"],
                ],
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            pointer: {
              show: false,
            },
            progress: {
              show: true,
              width: 8,
              itemStyle: {
                color: "#4D84AB",
              },
            },
            detail: {
              show: true,
              formatter: "{score|{value}个}",
              offsetCenter: [0, "20%"],
              height: 30,
              rich: {
                score: {
                  color: "#DF6454",
                  fontSize: 12,
                },
              },
            },
            data: [{ value: num, name: title }],
            title: {
              offsetCenter: [0, "70%"],
              fontSize: 12,
            },
          },
        ],
      };
    },
    format(timestr) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(timestr);
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return this.addZero(m) + "-" + this.addZero(d);
    },
    addZero(m) {
      return m < 10 ? "0" + m : m;
    },
  },
};
</script>

<style lang="scss" scoped>
.main ul {
  padding: 0 10px;
  margin: 5px 0 0;
  list-style: none;
}


.main li {
  padding-top: 10px;
}
.main li + li {
  margin-top: 15px;
  border-top: 1px dashed #4eb4d8;
}
.title .info {
  float: left;
  width: 90%;
  color: #4eb4d8;
  line-height: 32px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.title .info span {
  margin-right: 15px;
  padding: 3px 5px;
  color: #fff;
  font-size: 14px;
  background: #437fa8;
}
.title .time {
  float: right;
  font-size: 14px;
  color: #4eb4d8;
  line-height: 32px;
}
.spreadInfo {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.spreadInfo div {
  width: 80px;
  height: 80px;
}
.spreadInfo img {
  width: 55px;
  height: 15px;
  margin: 45px 5px 0;
}
</style>