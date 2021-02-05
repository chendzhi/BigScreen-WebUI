<template>
  <div>
    <div id="sichuan_map"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import sichuan from "@/api/mobilePhone/sichuanMap.json";
import { mapState } from "vuex";
export default {
  props: {
    sichuanData: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState("allMap", ["proviceMapData"]),
  },
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.load();
    });
  },
  methods: {
    load() {
      //市级坐标
      let geoCoordMap = {
        广元市: [105.850994, 32.439423],
        达州市: [107.472292, 31.214554],
        广安市: [106.638979, 30.461996],
        遂宁市: [105.598849, 30.538848],
        西昌市: [102.26413, 27.89524],
        德阳市: [104.402117, 31.134352],
        绵阳市: [104.684985, 31.471938],
        成都市: [104.076356, 30.664024],
        资阳市: [104.637312, 30.136206],
        眉山市: [103.854842, 30.081277],
        内江市: [105.061141, 29.586137],
        自贡市: [104.782145, 29.348859],
        泸州市: [105.448526, 28.878933],
        宜宾市: [104.649403, 28.75826],
        乐山市: [103.77254, 29.559197],
        雅安市: [103.050114, 30.017042],
        南充市: [106.115779, 30.845023],
        巴中市: [106.115779, 30.845023],
        攀枝花市: [101.724969, 26.588292],
        甘孜藏族自治州: [101.96912, 30.056028],
        阿坝藏族羌族自治州: [102.231991, 31.911642],
        阿坝藏族自治州: [102.231991, 31.911642],
        凉山彝族自治州: [102.262579, 27.888518],
      };
      //注册地图
      let myChart = echarts.init(document.getElementById("sichuan_map"));
      echarts.registerMap("sichuan", sichuan);
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
      let mapData = [["成都市", this.proviceMapData]];
      // console.log(this.proviceMapData);
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
              // console.log(dataItem, "12244");
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
          map: "sichuan",
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
      // console.log(222222);
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

#sichuan_map {
  width: 100%;
  height: px2rem(350);
  margin: 0 auto;
}

</style>
