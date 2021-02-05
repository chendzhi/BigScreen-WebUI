<template>
  <chart class="chart" :options="options" :autoresize="true" />
</template>
<script>
import echarts from "echarts";
export default {
  name: "meet-chart",
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
      var wordLength = value => {
        var ret = ""; //拼接加\n返回的类目项
        var maxLength = 4; //每项显示文字个数
        var valLength = value.length; //X轴类目项的文字个数
        var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
        // if (rowN > 1) {
        //   //如果类目项的文字大于3,
        //   for (var i = 0; i < rowN; i++) {
        //     var temp = ""; //每次截取的字符串
        //     var start = i * maxLength; //开始截取的位置
        //     var end = start + maxLength; //结束截取的位置
        //     //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
        //     temp = value.substring(start, end) + "\n";
        //     ret += temp; //凭借最终的字符串
        //   }
        //   return ret;
        // } else {
        //   return value;
        // }
        return value;
      };
      //偏移量
      var offsetData = [
        [45, 45],
        [63, 55],
        [30, 45],
        [60, 15],
        [33, 80],
        [70, 33],
        [10, 48],
        [20, 20],
        [32, 20],
        [90, 25],
        [80, 15],
        [15, 77],
        [90, 85],
        [80, 60],
        [5, 10]
      ];
      var colorData = [
        ["rgba(39,52,142,0.5)", "rgba(81,222,140,1)"],
        ["rgba(11,55,131,0.5)", "rgba(6,999,255,1)"],
        ["rgba(39,50,142,0.7)", "rgba(176,87,255,1)"]
      ];
      //symbolSize 散点气泡大小
      var symbolSizeData = [
        89,
        87,
        75,
        65,
        55,
        46,
        45,
        67,
        56,
        78,
        45,
        55,
        56,
        78,
        86
      ];
      //循环定义series的data值
      let max = data && data[0] && data[0].value;
      var datas = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var curBackground_index =
          Math.floor(Math.random() * (3 - 1 + 1) + 1) - 1; //(0-2) 随机整数
        var curBackground = colorData[curBackground_index];
        // let y = Math.random() * 100;
        // let x = Math.random() * 100;
        // y = y < 10 ? y + 8 : y;
        // x = x < 10 ? x + 5 : x;
        datas.push({
          name: wordLength(item.name),
          value: offsetData[i].concat([item.value]),
          // symbolSize: symbolSizeData[i] || 3,
          symbolSize: item.value / max * 110,
          label: {
            normal: {
              textStyle: {
                // fontSize: 12
                fontSize: item.value / max * 20 < 10 ? 10 : item.value / max * 20
              }
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                {
                  offset: 0,
                  color: curBackground[0]
                },
                {
                  offset: 1,
                  color: curBackground[1]
                }
              ]),
              opacity: 1,
              shadowColor: "#2e78eca8",
              shadowBlur: 10,
              shadowOffsetX: 1,
              shadowOffsetY: 1
            }
          }
        });
      }
      this.options = {
        backgroundColor: "transparent",
        grid: {
          show: false,
          top: 10,
          bottom: 10
        },
        xAxis: [
          {
            gridIndex: 0,
            type: "value",
            show: false,
            min: 0,
            max: 100,
            nameLocation: "middle",
            nameGap: 5
          }
        ],
        yAxis: [
          {
            gridIndex: 0,
            min: 0,
            show: false,
            max: 100,
            nameLocation: "middle",
            nameGap: 30
          }
        ],

        series: [
          {
            type: "scatter",
            symbol: "circle",
            symbolSize: 80,
            label: {
              normal: {
                show: true,
                formatter: "{b}",
                color: "#fff",
                textStyle: {
                  fontSize: "14"
                }
              }
            },
            animationDurationUpdate: 1000,
            animationEasingUpdate: 1000,
            animationDelay: function(idx) {
              // 越往后的数据延迟越大
              return idx * 100;
            },
            itemStyle: {
              normal: {
                color: "#00acea"
              }
            },
            data: datas
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
