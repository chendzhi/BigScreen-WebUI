<template>
  <div class="chart-con">
    <chart
      class="chart"
      :options="options"
      :autoresize="true"
      v-if="setData && setData.length > 0"
    />
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "field-chart",
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
      let datas = this.setData || [];
      // let arr = datas.map(ele => ele.value[2]);
      // let left = arr.slice(0, 4);
      // let mid = arr.slice(4, 14).filter(ele => ele !== 0);
      // let max = Math.max(...arr);
      // let min = Math.min(...arr);
      this.options = {
        // visualMap: {
        //   type: 'piecewise',
        //   splitNumber: 5,
        //   itemWidth: 12,
        //   itemHeight: 10,
        //   textStyle: {
        //     fontSize: 10,
        //     color: '#fff',
        //   },
        //   left: 'center',
        //   orient: 'horizontal',
        //   padding: [0, 3],
        //   // color: ["#079bdc", "#2267d6", "#feb063"],
        //   // show: false,
        //   min,
        //   max,
        //   // range: [min, max],
        //   inRange: {
        //     //这种写法才是目前主流的写法
        //     color: ["rgba(7,155,220, .7)", "rgba(0,182,128,0.7)", "rgba(236,128,141,0.7)", "rgba(194,128,255,0.7)", "rgba(254, 176, 99, .8)"],
        //   },
        //   // outOfRange: {
        //   //   color: ["rgb(84,173,214)"]
        //   // }
        // },
        tooltip: {
          backgroundColor: "rgba(21,91,180, .9)",
          // trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          textStyle: {
            fontSize: 10
          },
          formatter: function(params) {
            let { name, value } = params.data;
            if (!name || name === "全部") return "";
            return name + "：" + value[2];
          }
        },
        series: [
          {
            name: "全部",
            type: "treemap",
            wdith: "100%",
            height: "100%",
            bottom: "8%",
            label: {
              show: true,
              formatter: function(params) {
                let { name, value } = params.data;
                if (!name || name === "全部") return "";
                return name + "\n" + value[2];
              }
            },
            leafDepth: 4,
            breadcrumb: {
              show: true,
              top: "0",
              left: 0,
              itemStyle: {
                color: "rgba(21,91,180, 1)",
                textStyle: {
                  color: "#0be4ee"
                }
              }
            },
            roam: "move", //是否开启拖拽漫游（移动和缩放）
            // nodeClick: false, //点击节点后的行为,false无反应
            itemStyle: {
              gapWidth: 3,
              borderColor: "transparent"
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
.chart,
.chart-con {
  width: 100%;
  height: 100%;
}
.no-data {
  text-align: center;
  font-size: 14px;
  color: #ccc;
  line-height: 100%;
}
</style>
