<template>
  <chart class="chart" :options="options" :autoresize="true" />
</template>
<script>
import echarts from "echarts";
export default {
  name: "pictorial-bar-chart",
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
      let colorList = [
        ["#534fbc", "#a179ee"],
        ["#1954b4", "#2cd1f2"],
        ["#164caa", "#198575"],
        ["#3b4c6f", "#ceaa35"],
        ["#3b4c70", "#c5a438"]
      ];
      this.options = {
        grid: {
          left: "4%",
          top: "15%",
          bottom: "15%",
          right: "6%"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: xData,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#00d2ff",
              fontSize: 12
            },
            interval: 0,
            formatter: function(value, index) {
              if (value.length > 4) {
                return value.substr(0, 5) + "..";
              } else {
                return value;
              }
            }
          }
        },
        yAxis: [
          {
            nameTextStyle: {
              color: "#8998AC",
              padding: [0, 25, 0, 0]
            },
            // show: false,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#2b8de5"
              }
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: "#899dc8",
                fontSize: 10
              }
            }
          }
        ],
        series: [
          {
            type: "pictorialBar",
            barCategoryGap: "0%",
            symbol:
              "path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z",
            barWidth: "80%",
            label: {
              show: true,
              position: "top",
              color: "#fff",
              fontSize: 12,
              backgroundColor: 'rgba(43,141,229,1)',
              padding: [4, 5, 2, 5],
              borderRadius: 2,
              fontSize: 10
            },
            itemStyle: {
              color: function(params) {
                let itemColor = colorList[params.dataIndex];
                let curColor = "";
                if (Array.isArray(itemColor)) {
                  curColor = {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: itemColor[0] //  0%  处的颜色
                      },
                      {
                        offset: 1,
                        color: itemColor[1] ? itemColor[1] : itemColor[0] //  100%  处的颜色
                      }
                    ],
                    global: false //  缺省为  false
                  };
                } else {
                  curColor = itemColor;
                }
                return curColor;
              }
            },
            data: yData,
            z: 10
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
