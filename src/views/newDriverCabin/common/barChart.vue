<template>
  <div ref="chart" class="chart-wrap"></div>
</template>
<script>
import echarts from "echarts";
import _ from "lodash";

export default {
  props: {
    chartData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.initChart();
        }
      },
    },
  },
  methods: {
    initChart() {
      this.$nextTick(() => {
        // 处理数据及排序
        let list = _.cloneDeep(this.chartData);
        let xArr = list
          .sort(function (a, b) {
            return a.value - b.value;
          })
          .map((item) => item.value);
        let yArr = list
          .sort(function (a, b) {
            return a.value - b.value;
          })
          .map((item) => item.name);

        this.chart.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            formatter: function (params) {
              return params[0].name + "<br>" + params[0].value;
            },
          },
          grid: {
            left: "20px",
            right: "40px",
            bottom: "20px",
            top: "22px",
            containLabel: true,
          },
          xAxis: {
            type: "value",
            // boundaryGap: [0, 0.01],
            axisLabel: {
              show: true,
              textStyle: {
                color: "#899dc8",
                fontSize: "11",
              },
              formatter: "{value}",
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#899dc8",
              },
            },
            axisTick: {
              alignWithLabel: true,
            },
          },
          yAxis: {
            type: "category",
            axisLabel: {
              show: true,
              textStyle: {
                // color: '#b5c3dd',
                color: "#30ddf4",
                fontSize: "13",
              },
            },
            axisLine: {
              lineStyle: {
                color: "#899dc8",
              },
            },
            data: yArr,
          },
          series: [
            {
              barMaxWidth: 13, //最大宽度
              itemStyle: {
                normal: {
                  barBorderRadius: 0,
                  color: function (params) {
                    var colorList = [
                      ["#5570cb", "#5570cb", "#5570cb"],
                      ["#5570cb", "#5570cb", "#5570cb"],
                      ["#506ee4", "#506ee4", "#506ee4"],
                      ["#40e0d0", "#018ffb", "#1db4e7"],
                      ["#d29b1a", "#ff8c00", "#02e396"],
                    ];
                    var checkColor =
                      colorList[params.dataIndex] || colorList[1];
                    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0,
                        color: checkColor[0],
                      },
                      {
                        offset: 0.5,
                        color: checkColor[1],
                      },
                      {
                        offset: 1,
                        color: checkColor[2],
                      },
                    ]);
                  },
                },
              },
              label: {
                normal: {
                  show: true,
                  position: "right",
                  formatter: "{c}",
                  color: "#899dc8",
                },
              },
              data: xArr,
              type: "bar",
            },
          ],
        });
      });
    },
    onWinResize: _.throttle(function () {
      this.chart.resize();
    }, 200),
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    window.addEventListener("resize", this.onWinResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onWinResize);
  },
};
</script>

<style scoped>
.chart-wrap {
  width: 100%;
  height: 100%;
}
</style>
