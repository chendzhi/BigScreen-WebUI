<template>
  <div>
    <div id="china_map"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import china from "@/api/mobilePhone/chinaMap.json";
import { mapState } from "vuex";

export default {
  props: {
    chinaData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState("allMap", ["countryMapData"]),
  },
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.countryMapData, "countryMapData");
      this.load();
    });
  },
  methods: {
    load() {
      //省级坐标
      const geoCoordMap = {
        新疆维吾尔自治区: [86.61, 40.79],
        西藏自治区: [89.13, 30.66],
        黑龙江省: [128.34, 47.05],
        吉林省: [126.32, 43.38],
        辽宁省: [123.42, 41.29],
        内蒙古: [112.17, 42.81],
        北京市: [116.4, 40.4],
        宁夏回族自治区: [106.27, 36.76],
        山西省: [111.95, 37.65],
        河北省: [115.21, 38.44],
        天津市: [117.04, 39.52],
        青海省: [97.07, 35.62],
        甘肃省: [103.82, 36.05],
        山东省: [118.01, 36.37],
        陕西省: [108.94, 34.46],
        河南省: [113.46, 34.25],
        安徽省: [117.28, 31.86],
        江苏省: [120.26, 32.54],
        上海市: [121.46, 31.28],
        四川省: [103.36, 30.65],
        湖北省: [112.29, 30.98],
        浙江省: [120.15, 29.28],
        重庆市: [107.51, 29.63],
        湖南省: [112.08, 27.79],
        江西省: [115.89, 27.97],
        贵州省: [106.91, 26.67],
        福建省: [118.31, 26.07],
        云南省: [101.71, 24.84],
        广西壮族自治区: [108.67, 23.68],
        广东省: [113.98, 22.82],
        海南省: [110.03, 19.33],
      };
      //注册地图
      let myChart = echarts.init(document.getElementById("china_map"));
      echarts.registerMap("china", china);
      //数据方法
      let convertData = function (name, data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var fromCoord = geoCoordMap[name];
          var toCoord = geoCoordMap[data[i].name];
          if (fromCoord && toCoord) {
            res.push({
              //对换即可调整方向
              coords: [fromCoord, toCoord],
            });
          }
        }
        return res;
      };
      //获取series内容
      let series = [];
      let mapData = [["北京市", this.countryMapData]];
      // console.log(this.chinaData), " this.chinaData";
      mapData.forEach(function (item) {
        series.push(
          {
            name: item[0],
            type: "lines",
            zlevel: 1,
            //线特效配置
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: "#34B9FC",
              symbolSize: 5,
            },
            lineStyle: {
              normal: {
                width: 1,
                opacity: 0.4,
                curveness: 0.2, //弧线角度
                color: "#34B9FC", //线条颜色
              },
            },
            data: convertData(item[0], item[1]),
          },
          {
            type: "scatter",
            coordinateSystem: "geo",
            symbol: "pin",
             symbolSize: [30, 30],
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#fff",
                  fontSize: 9,
                },
                formatter(value) {
                  return value.data.value[2];
                },
              },
            },
            itemStyle: {
              normal: {
                color: "#D8BC37", //标志颜色
              },
            },
            data: item[1].map(function (dataItem) {
              // console.log(dataItem, "12244");
              return {
                name: dataItem.name,
                value: geoCoordMap[dataItem.name].concat([dataItem.value]),
              };
            }),
            // showEffectOn: "render",
            // rippleEffect: {
            //   brushType: "stroke",
            // },
            // hoverAnimation: true,
            // zlevel: 1,
          },
          {
            //起点
            name: item[0],
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            //波纹效果
            rippleEffect: {
              period: 2,
              brushType: "stroke",
              scale: 3,
            },
            label: {
              normal: {
                show: true,
                color: "#0C4C72",
                position: "left",
                formatter: "{b}",
              },
            },
            symbol: "circle",
            symbolSize: 10,
            //圆点大小
            /****symbolSize: function(val) {
                return val[2]*100 / goTotal;
            },***/
            itemStyle: {
              normal: {
                show: true,
              },
            },
            data: item[1].map(function (dataItem) {
              return {
                name: dataItem.name,
                value: geoCoordMap[dataItem.name].concat([dataItem.value]),
              };
            }),
          },
          {
            //终点
            name: "item[0]",
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            //波纹效果
            rippleEffect: {
              period: 2,
              brushType: "stroke",
              scale: 3,
            },
            label: {
              normal: {
                show: false,
                position: "left",
                formatter: "{b}",
                color: "#ffde00",
              },
            },
            symbolSize: function () {
              return 25;
            },
            symbol: "circle",
            itemStyle: {
              normal: {
                show: true,
              },
            },
            data: [
              {
                name: item[0],
                value: 10,
              },
            ],
          }
        );
      });
      let option = {
        backgroundColor: "#D7F1FE",
        tooltip: {
          trigger: "item",
          formatter: "{b}",
        },
        //线颜色及飞行轨道颜色
        visualMap: {
          show: false,
          min: 0,
          max: 100,
          color: ["#39BAFF"],
        },
        //地图相关设置
        geo: {
          map: "china",
          //视角缩放比例
          zoom: 1.2,
          //显示文本样式
          label: {
            normal: {
              show: false,
              textStyle: {
                color: "rgba(255,255,255,.1)",
              },
            },
            emphasis: {
              show: false,
              textStyle: {
                color: "#fff", //滑过文字颜色
              },
            },
          },
          //鼠标缩放和平移
          roam: false,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#feffff", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#d1efff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },

            emphasis: {
              areaColor: "#fff",
            },
          },
        },
        series: series,
      };
      //生成视图
      myChart.setOption(option);
    },
    resize() {
      // console.log(this.chinaData, "123", this.countryMapData);
      this.load();
      // let myChart = echarts.init(document.getElementById("sichuan_map"));
      // myChart.resize();
    },
  },
};

fnResize();
window.onresize = function () {
  fnResize();
}
function fnResize() {
  var deviceWidth = document.documentElement.clientWidth || window.innerWidth;
  if (deviceWidth >= 750) {
    deviceWidth = 750;
  }
  if (deviceWidth <= 320) {
    deviceWidth = 320;
  }
  document.documentElement.style.fontSize = (deviceWidth / 414) * 16 + 'px';
}

</script>
<style scoped lang="scss">
@function px2rem( $px ){
    @return $px/16 + rem;
}

$designWidth : 414; //414 是设计稿的宽度，要根据设计稿的宽度填写。

#china_map {
  width: 100%;
  height: px2rem(350);
  margin: 0 auto;
}
</style>
