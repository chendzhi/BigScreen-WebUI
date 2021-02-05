<template>
  <chart class="chart" :options="options" :autoresize="true" />
</template>
<script>
import echarts from "echarts";
export default {
  name: "one-line-chart",
  props: {
    setData: {
      type: Object,
      default: () => {
        return {
          xData: [],
          yData: []
        }
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
    setOptions() {
      let {xData = [], yData = []} = this.setData || {};

      this.options = {
        color: ["#f0c725", "#16f892"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["新闻媒体", "政府网站"],
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          left: "6%",
          right: "4%",
          top: "25%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          show: true,
          orient: "vertical",
          x: "right",
          y: "center"
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xData,
            axisLine: {
              lineStyle: {
                color: "rgba(240,199,37,0.5)"
              }
            },
            axisLabel: {
              color: "#c1cadf",
              fontSize: 10,
              rotate: 10
            }
          }
        ],
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
            name: "新闻媒体",
            type: "line",
            smooth: true,
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(240,199,37,0.5)"
                },
                {
                  offset: 1,
                  color: "rgba(240,199,37,0.01)"
                }
              ])
            },
            data: yData[0],
            barWidth: "30%",
            itemStyle: { normal: { color: "#f0c725" } }
          },
          {
            name: "政府网站",
            type: "line",
            smooth: true,
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(22,248,146,0.5)"
                },
                {
                  offset: 1,
                  color: "rgba(22,248,146,0.01)"
                }
              ])
            },
            data: yData[1],
            barWidth: "30%",
            itemStyle: { normal: { color: "#16f892" } }
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
