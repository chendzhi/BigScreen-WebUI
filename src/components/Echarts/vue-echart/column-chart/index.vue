<template>
  <chart class="chart" :options="options" :autoresize="true" />
</template>
<script>
import echarts from "echarts";
export default {
  name: "column-chart",
  props: {
    setData: {
      type: Object,
      default: () => {
        return {
          wx: [],
          wb: [],
          mh: []
        };
      }
    }
  },
  data() {
    return {
      options: {}
    };
  },
  watch: {
    setData() {
      this.setOptions();
    }
  },
  mounted() {
    this.setOptions();
  },
  methods: {
    getSum() {
      let sum = [];
      let { wx = [], mh = [], wb = [] } = this.setData || {};
      for (var i = 0; i < mh.length; i++) {
        sum.push(Number(mh[i]) + Number(wx[i]) + Number(wb[i]));
      }
      return sum;
    },
    setOptions() {
      let { wx = [], mh = [], wb = [], xData = [], curName = "" } =
        this.setData || {};
      let getSumData = this.getSum();
      this.options = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["门户网站", "新浪微博", "微信"],
          left: 0,
          textStyle: {
            color: "#fff",
            fontSize: 12
          },
          itemWidth: 12,
          itemHeight: 8
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          top: '28%',
          containLabel: true
        },
        xAxis: {
          type: "category",
          show: true,
          data: xData,
          axisLabel: {
            color: function(value, index) {
              return value === curName ? "#fbff00" : "#fff";
            },
            interval: 0,
            // rotate: 19
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: [
          {
            nameTextStyle: {
              color: "#8998AC",
              padding: [0, 25, 0, 0]
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#68759e",
                type: "dashed"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#899dc8",
                fontSize: "11"
              }
            }
          }
        ],
        series: [
          {
            name: "微信",
            type: "bar",
            stack: "总量",
            itemStyle: {
              normal: {
                color: "#00cea0"
              }
            },
            data: wx
          },
          {
            name: "新浪微博",
            type: "bar",
            stack: "总量",
            itemStyle: {
              normal: {
                color: "#face1e"
              }
            },
            data: wb
          },
          {
            name: "门户网站",
            type: "bar",
            stack: "总量",
            barWidth: "40%",
            itemStyle: {
              normal: {
                color: "#26a8ff"
              }
            },
            label: {
              show: true,
              position: "inside",
              fontSize: "10",
              fontWeight: "100",
              position: "top",
              fontSize: "10",
              fontWeight: "100",
              color: "#ffffff",
              formatter: function(p) {
                return getSumData[p.dataIndex];
              }
            },
            data: mh
          }
        ]
      };
    }
  }
};
</script>
<style lang="scss">
.chart {
  width: 100%;
  height: 100%;
}
</style>
