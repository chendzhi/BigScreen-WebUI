import echarts from "echarts";
export  const barConfig  = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function(params) {
      return params[0].name+'<br>'+ params[0].value;
    }
  },
  grid: {
      left: '20px',
      right: '40px',
      bottom: '20px',
      top: '22px',
      containLabel: true
  },
  xAxis: {
    type: 'value',
    // boundaryGap: [0, 0.01],
    axisLabel: {
      show: true,
      textStyle: {
        color: '#899dc8',
        fontSize:'11'
      },
      formatter: '{value}',
    },
    splitLine: {
      show: false
    },
    axisLine:{
      lineStyle:{
        color:'#899dc8',
      }
    },
    axisTick: {
      alignWithLabel: true
    },

  },
  yAxis: {
    type: 'category',
    axisLabel: {
      show: true,
      textStyle: {
       // color: '#b5c3dd',
        color: '#30ddf4',
        fontSize:'13',
      },

    },
    axisLine:{
      lineStyle:{
        color:'#899dc8',
      }
    },
    data:[]
  },
  series: [{
      barMaxWidth:13,//最大宽度
      itemStyle: {
        normal: {
          barBorderRadius: 0,
          color: function(params)  {
              var colorList = [                        
                ['#5570cb','#5570cb','#5570cb'],
                ['#5570cb','#5570cb','#5570cb'],
                ['#506ee4','#506ee4','#506ee4'],          
                ['#40e0d0','#018ffb','#1db4e7'],
                ['#d29b1a','#ff8c00','#02e396'],        
              ];
              var checkColor = colorList[params.dataIndex] || colorList[1];
              return new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                offset: 0,
                color: checkColor[0],
              },
              {
                offset: 0.5,
                color: checkColor[1],
              }, {
                offset: 1,
                color: checkColor[2],
              }])
           },
        },
      },
      label: {
        normal: {
          show: true,
          position: "right",
          formatter: "{c}",
          color: '#899dc8',
        }
    },
      data: [],
      type: 'bar'
  }]
};