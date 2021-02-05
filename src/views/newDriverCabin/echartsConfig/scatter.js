// 小气泡
export const scatterConfig = {
  backgroundColor: "transparent",
  grid: {
      show: false,
      top: 10,
      bottom: 10
  },
  xAxis: [{
      gridIndex: 0,
      type: "value",
      show: false,
      min: 0,
      max: 100,
      nameLocation: "middle",
      nameGap: 5,

  }],
  yAxis: [{
      gridIndex: 0,
      min: 0,
      show: false,
      max: 100,
      nameLocation: "middle",
      nameGap: 30,
  }],

  series: [{
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
      data: []
  }],
};
