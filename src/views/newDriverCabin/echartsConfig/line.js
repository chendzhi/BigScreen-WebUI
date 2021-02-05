import echarts from "echarts";

export const lineConfig = {
  color: ["#f0c725", "#16f892"],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "line" // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: ['新闻媒体', '政府网站'],
    textStyle: {
        color: "#fff"
    }
},
  grid: {
    left: "6%",
    right: "4%",
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
      data: ["201912", "202001", "202002", "202003", "202004", "202005"],
      axisLine: {
        lineStyle: {
          color: "rgba(240,199,37,0.5)"
        }
      },
      axisLabel: {
        color: "#c1cadf"
      }
    }
  ],


  yAxis: [{
    nameTextStyle: {
        color: '#8998AC',
        padding: [0, 25, 0, 0]
    },
    axisTick: {
      show: false
    },
    axisLine: {
        show: false,
    },
    splitLine:{
      show: true,
      lineStyle:{
        color:'#68759e',
        type:"dashed"
      }
    },
    axisLabel: {
        textStyle: {
            color: '#899dc8',
            fontSize:'11'
        }
    },
   }],


  series: [
    {
      name: "新闻媒体",
      type: "line",
      smooth: true,
      symbolSize: 8,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(240,199,37,0.5)"
          },
          {
            offset: 1,
            color: "rgba(240,199,37,0.01)"
          }
        ])
      },
      data: [127, 224, 120, 278, 227, 237],
      barWidth: "30%",
      itemStyle: { normal: { color: "#f0c725" } }
    },
    {
      name: "政府网站",
      type: "line",
      smooth: true,
      symbolSize: 8,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgba(22,248,146,0.5)"
          },
          {
            offset: 1,
            color: "rgba(22,248,146,0.01)"
          }
        ])
      },
      data: [27, 124, 70, 178, 127, 157],
      barWidth: "30%",
      itemStyle: { normal: { color: "#16f892" } }
    }
  ]
};
