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
    setOptions() {
      let { xData = [], yData = [] } = this.setData || {};

      this.options = {
        color: ["#3893FF"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show: false,
          data: [],
          textStyle: {
            color: "#fff"
          }
        },
        grid: {
          left: "6%",
          right: "8%",
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
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#3893FF" //  0%  处的颜色
                    },
                    {
                      offset: 1,
                      color: "#3FEDFF" //  100%  处的颜色
                    }
                  ],
                  global: false //  缺省为  false
                }
              }
            },
            axisLabel: {
              color: "#c1cadf",
              fontSize: 10,
              // interval: 0,
              // rotate: 20
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
            name: "",
            type: "line",
            smooth: true,
            symbolSize: 8,
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: "#3893FF" //  0%  处的颜色
                  },
                  {
                    offset: 0,
                    color: "#3FEDFF" //  100%  处的颜色
                  }
                ],
                global: false //  缺省为  false
              }
            },
            data: yData,
            label: {
              normal: {
                show: true,
                position: "top",
                color: '#c1cadf',
                fontSize: 10
              }
            },
            itemStyle: { normal: { color: "#3893FF" } }
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
