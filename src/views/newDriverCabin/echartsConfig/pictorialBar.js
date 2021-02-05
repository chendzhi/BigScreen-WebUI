let colorList = [

  ['#534fbc','#a179ee'],
  ['#1954b4','#2cd1f2'],
  ['#164caa','#198575'],
  ['#3b4c6f','#ceaa35'],
  ['#3b4c70','#c5a438'],
  
]

export const pictorialBarConfig = {
  grid: {
    left: '12%',
    top: '15%',
    bottom: '14%',
    right: '8%'
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    data:[],
    axisTick: {
      show: false
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
        textStyle: {
            color: '#00d2ff',
            fontSize: 14
        },
        interval:0,
        formatter: function (value, index) {
          if(value.length > 4){
            return value.substr(0,5)+'..';
          }else{
            return value
          }
      }
    }
  },
  yAxis: [{
    nameTextStyle: {
        color: '#8998AC',
        padding: [0, 25, 0, 0]
    },
   // show: false,
    axisTick: {
        show: false
    },
    axisLine: {
        show: false,
    },
    splitLine:{
      show: true,
      lineStyle:{
        color:'#2b8de5'
      }
    },
    axisLabel: {
        textStyle: {
            color: '#899dc8',
            fontSize:'11'
        }
    },
  }
  ],
  series: [{
    type: 'pictorialBar',
    barCategoryGap: '0%',
    symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
    barWidth: '80%',
    label: {
      show: true,
      position: "top",
      color: '#fff',
      fontSize: 12,
    },
    itemStyle: {
        color: function (params) {
            let itemColor = colorList[params.dataIndex];
            let curColor = '';
            if(Array.isArray(itemColor)){
                curColor = {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: itemColor[0] //  0%  处的颜色
                    },
                    {
                      offset: 1,
                      color: itemColor[1]?itemColor[1]:itemColor[0] //  100%  处的颜色
                    }
                    ],
                    global: false //  缺省为  false
                }
            }else{
                curColor = itemColor;
            }
            return curColor
        }
    },
    data:[],
    z: 10
  }]
};