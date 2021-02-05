
// 堆积柱形图
export const  stackedColumn  = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: ['门户网站', '微信', '新浪微博'],
    left:0,
    textStyle:{
      color: '#fff'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    show: true,
    data: ['陕西', '山西', '四川', '北京', '河北', '甘肃', '内蒙'],
    axisLabel: {
      color: '#fff'
    },
    axisLine: {
      lineStyle: {
        color: '#fff'
      },
    },
    axisTick: {
      alignWithLabel: true
    },
  },
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
          name: '门户网站',
          type: 'bar',
          stack: '总量',
          barWidth: '40%',
          itemStyle:{
              normal: {
                color: '#28b9fc',
              }
          },

          data: [320, 302, 301, 334, 390, 330, 120]
      },
      {
          name: '微信',
          type: 'bar',
          stack: '总量',
          itemStyle:{
              normal: {
                color: '#00fbc8',
              }
          },

          data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '新浪微博',
        type: 'bar',
        stack: '总量',
        itemStyle:{
            normal: {
              color: '#fbe345',

            }
        },
        label: {
            show: true,
            position: 'inside',
            fontSize:'10',
            fontWeight:'100',
            position: "top",
            fontSize:'10',
            fontWeight:'100',
            color:'#ffffff',
            formatter: function(p) {
              return sum[p.dataIndex]
            }
        },
        data: [220, 182, 191, 234, 290, 330, 310]
      },
  ]
};

var sum = [];
for(var i = 0;i<stackedColumn.series[0].data.length;i++){
  console.log(stackedColumn.series[0].data.length);
  sum.push(Number(stackedColumn.series[0].data[i])+Number(stackedColumn.series[1].data[i])+Number(stackedColumn.series[2].data[i]))
}
