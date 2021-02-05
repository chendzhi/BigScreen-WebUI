<template>
  <chart class="chart" :options="options" :autoresize="true" />
</template>
<script>
import echarts from "echarts";
export default {
  name: "voice-pie-chart",
  props: {
    setData: {
      type: Object,
      default: () => {
        return {
          data: {}, // 名称name; 值:value
          colors: [], // 色值
          count: 100 // 总数
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
      let {data, colors = ['#3FEDFF', '#3893FF']} = this.setData || {};
      let {name = '', value = 0, count = 100} = data;
      this.options = {
        title: {
          text: "{a|" + value + "}{c|个}{d|\n"+ name +"}",
          x: "center",
          y: "center",
          textStyle: {
            rich: {
              a: {
                fontSize: 14,
                color: "#fff"
              },

              c: {
                fontSize: 8,
                color: "#ffffff"
                // padding: [5,0]
              },
              d: {
                fontSize: 10,
                color: "#ffffff",
                padding: [2,0, 0 ,0]
              }
            }
          }
        },
        series: [
          {
            name: "",
            // radius: '95%',
            type: "pie",
            radius: ["90%", "60%"],
            silent: true,
            clockwise: true,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: value,
                name: "",
                itemStyle: {
                  normal: {
                    color: {
                      // 完成的圆环的颜色
                      colorStops: [
                        {
                          offset: 0,
                          color: colors[0] // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: colors[1] // 100% 处的颜色
                        }
                      ]
                    }
                  }
                }
              },
              {
                value: count - value,
                name: "",
                label: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#1857C4"
                  }
                }
              }
            ]
          },
          {
            name: "",
            type: "pie",
            radius: ["55%", "50%"],
            silent: true,
            clockwise: true,
            startAngle: 270,
            z: 0,
            zlevel: 0,
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: 100,
                name: "",
                itemStyle: {
                  normal: {
                    color: {
                      // 完成的圆环的颜色
                      colorStops: [
                        {
                          offset: 0,
                          color: colors[0] // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: colors[0] // 100% 处的颜色
                        }
                      ]
                    }
                  }
                }
              }
            ]
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
