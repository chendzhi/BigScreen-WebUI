<template>
  <chart class="chart" :options="options" :autoresize="true" />
</template>
<script>
import echarts from "echarts";
export default {
  name: "words-bar-chart",
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
      let { xData = [], yData = [], showLine = false } = this.setData || {};
      let bgData = Array(xData.length).fill(Math.max(...xData));
      this.options = {
        tooltip: {
          show: false,
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: function(params) {
            return params[0].name + "<br>" + params[0].value;
          }
        },
        grid: {
          left: "2%",
          right: "5%",
          bottom: "4%",
          top: "5%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          // boundaryGap: [0, 0.01],
          axisLabel: {
            show: showLine,
            textStyle: {
              color: "#899dc8",
              fontSize: "11"
            },
            formatter: "{value}"
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: showLine,
            lineStyle: {
              color: "#899dc8"
            }
          },
          axisTick: {
            show: showLine,
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "category",
          axisLabel: {
            show: true,
            textStyle: {
              // color: '#b5c3dd',
              color: "#fff",
              fontSize: "12"
            }
          },
          axisLine: {
            show: showLine,
            lineStyle: {
              color: "#899dc8"
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          data: yData
        },
        series: [
          {
            barMaxWidth: 10, //最大宽度
            itemStyle: {
              normal: {
                barBorderRadius: 0,
                color: function(params) {
                  var colorList = [
                    ["#01BDF9", "#00FEC7", "#5570cb"],
                    ["#01BDF9", "#00FEC7", "#5570cb"],
                    ["#01BDF9", "#00FEC7", "#506ee4"],
                    ["#02AE84", "#35FE56", "#1db4e7"],
                    ["#FBA344", "#FBE744"]
                  ];
                  var checkColor = colorList[params.dataIndex] || colorList[1];
                  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0,
                      color: checkColor[0]
                    },
                    // {
                    //   offset: 0.5,
                    //   color: checkColor[1]
                    // },
                    {
                      offset: 1,
                      color: checkColor[1]
                    }
                  ]);
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{c}",
                color: "#0CE4EE"
              }
            },
            data: xData,
            type: "bar"
          },
          {
            name: "背景",
            type: "bar",
            barWidth: 10,
            barGap: "-100%",
            z: 1,
            animationDuration: 1500,
            data: bgData,
            itemStyle: {
              normal: {
                color: "#1533A5",
              }
            }
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
