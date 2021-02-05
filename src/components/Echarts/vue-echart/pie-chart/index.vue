<template>
  <chart class="chart" :options="options" :autoresize="true" />
</template>
<script>
import echarts from "echarts";
export default {
  name: "pie",
  props: {
    setData: {
      type: Array,
      default: () => []
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
      let data = this.setData || [];
      let color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: "#5CF9FE" // 0% 处的颜色
        },
        {
          offset: 0.17,
          //color: "#468EFD", // 100% 处的颜色
          color: "#5CF9FE" // 100% 处的颜色
        },
        {
          offset: 0.9,
          color: "#5CF9FE" // 100% 处的颜色
        },
        {
          offset: 1,
          color: "#5CF9FE" // 100% 处的颜色
        }
      ]);
      let colorSet = [
        [0.91, color],
        [1, "#15337C"]
      ];
      let rich = {
        white: {
          fontSize: 10,
          color: "#fff",
          fontWeight: "500",
          padding: [-50, 0, 0, 0]
        },
        bule: {
          fontSize: 14,
          fontFamily: "DINBold",
          color: "#fff",
          fontWeight: "500",
          padding: [-50, 0, 0, 0]
        },
        radius: {
          width: 60,
          height: 25,
          fontSize: 10,
          color: "#fff",
          textAlign: "center"
        },
        size: {
          height: 20,
          padding: [46, 0, 0, 0]
        }
      };
      this.options = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
          {
            //内圆
            type: "pie",
            radius: "85%",
            center: ["50%", "50%"],
            z: 0,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(17,24,43,0)"
                    },
                    {
                      offset: 0.5,
                      color: "rgba(28,42,91,.6)"
                    },
                    {
                      offset: 1,
                      color: "#141C33"
                    }
                  ],
                  false
                ),
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            data: [100]
          },
          {
            type: "gauge",
            radius: "70%",
            startAngle: "215",
            endAngle: "-35",
            pointer: {
              show: false
            },
            title: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontSize: 40,
              fontStyle: "italic",
              offsetCenter: [0, "60%"],
              color: "#fff"
            },
            detail: {
              formatter: function(value) {
                var num = Math.round(value);
                return (
                  "{bule|" + num + "}{white|个}" + "{size|" + "}\n{radius|}"
                );
              },
              rich: rich,
              offsetCenter: ["0%", "-50%"]
            },
            data,
            title: {
              show: true,
              offsetCenter: [0, "70%"],
              fontSize: 10,
              color: "#fff"
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: colorSet,
                width: 5,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                opacity: 1
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              length: 25,
              lineStyle: {
                color: "#00377a",
                width: 2,
                type: "solid"
              }
            },
            axisLabel: {
              show: false
            }
          },
          {
            //内圆
            type: "pie",
            radius: "90%",
            center: ["50%", "50%"],
            z: 1,
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(
                  0.5,
                  0.5,
                  0.8,
                  [
                    {
                      offset: 0,
                      color: "#261c89"
                    },
                    {
                      offset: 0.5,
                      color: "#261c89"
                    },
                    {
                      offset: 1,
                      color: "#261c89"
                    }
                  ],
                  false
                ),
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            data: [200]
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
